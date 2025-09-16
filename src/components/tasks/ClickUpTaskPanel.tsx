import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  MoreHorizontal,
  Circle,
  CheckCircle2,
  Clock,
  AlertCircle,
  Flag,
  Calendar,
  User,
  Tag,
  MessageSquare,
  Paperclip,
  Plus,
  Edit3,
  Copy,
  Trash2,
  ChevronDown,
  Upload,
  FileText,
  Image,
  File,
  Download,
  Send,
  ExternalLink
} from 'lucide-react';
import { Task, TaskStatus, TaskPriority, Comment, Attachment } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import { useTask } from '@/context/TaskContext';
import { toast } from '@/hooks/use-toast';
import { useFetchMembers } from '@/hooks/memberManagement/useFetchMembers';
import { FirebaseService } from '@/lib/firebaseService';

interface ClickUpTaskPanelProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask?: (taskId: string) => void;
}


const statusOptions = [
  { value: TaskStatus.TODO, label: 'To Do', icon: Circle, color: 'text-gray-400' },
  { value: TaskStatus.IN_PROGRESS, label: 'In Progress', icon: Clock, color: 'text-blue-600' },
  { value: TaskStatus.IN_REVIEW, label: 'In Review', icon: AlertCircle, color: 'text-yellow-600' },
  { value: TaskStatus.COMPLETED, label: 'Completed', icon: CheckCircle2, color: 'text-green-600' },
];

const priorityOptions = [
  { value: TaskPriority.URGENT, label: 'Urgent', color: 'text-red-700', bgColor: 'bg-red-100', fill: true },
  { value: TaskPriority.HIGH, label: 'High', color: 'text-yellow-600', bgColor: 'bg-yellow-100', fill: true },
  { value: TaskPriority.MEDIUM, label: 'Medium', color: 'text-blue-600', bgColor: 'bg-blue-100', fill: false },
  { value: TaskPriority.LOW, label: 'Low', color: 'text-gray-500', bgColor: 'bg-gray-100', fill: false },
];

const ClickUpTaskPanel = ({ 
  task, 
  isOpen, 
  onClose, 
  onUpdateTask,
  onDeleteTask 
}: ClickUpTaskPanelProps) => {
  const { user } = useAuth();
  const { projects } = useTask();
  const { users, isLoading: isLoadingMembers } = useFetchMembers();
  const navigate = useNavigate();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedDescription, setEditedDescription] = useState('');
  const [isEditingProgress, setIsEditingProgress] = useState(false);
  const [tempProgress, setTempProgress] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isAssigneeDropdownOpen, setIsAssigneeDropdownOpen] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isEditingTags, setIsEditingTags] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const isAdmin = user?.roles?.includes('admin') || false;

  const loadAttachments = useCallback(async () => {
    if (!task) return;
    try {
      console.log('Loading attachments for task:', task.id);
      const attachmentsData = await FirebaseService.getDocuments('attachments', [
        { field: 'taskId', operator: '==', value: task.id }
      ]);
      console.log('Found attachments:', attachmentsData.length);
      setAttachments(attachmentsData.map((a: any) => ({
        id: a.id,
        name: a.name,
        size: a.size,
        type: a.type,
        url: a.url,
        uploadedBy: a.uploadedBy,
        uploadedAt: a.uploadedAt
      })));
    } catch (error) {
      console.error('Error loading attachments:', error);
    }
  }, [task?.id]);

  // Initialize state when task changes
  useEffect(() => {
    if (task) {
      setComments(task.comments || []);
      // Don't initialize attachments from task - we'll load from Firestore
      setTags(task.tags || []);
      loadAttachments();
    }
  }, [task, loadAttachments]);

  if (!task || !isOpen) return null;

  const handleTitleSubmit = () => {
    if (editedTitle.trim() && editedTitle !== task.title) {
      onUpdateTask(task.id, { title: editedTitle });
    }
    setIsEditingTitle(false);
  };

  const handleDescriptionSubmit = () => {
    if (editedDescription !== task.description) {
      onUpdateTask(task.id, { description: editedDescription });
    }
    setIsEditingDescription(false);
  };

  const handleProgressUpdate = (value: number[]) => {
    setTempProgress(value[0]);
  };

  const handleProgressSubmit = () => {
    onUpdateTask(task.id, { progress: tempProgress });
    setIsEditingProgress(false);
    toast({
      title: "Progress Updated",
      description: `Task progress set to ${tempProgress}%`,
    });
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        userId: user?.id || '',
        userName: user?.name || 'Unknown User',
        userAvatar: user?.avatar || '/placeholder.svg',
        content: newComment,
        createdAt: new Date().toISOString()
      };
      const updatedComments = [...comments, comment];
      setComments(updatedComments);
      onUpdateTask(task.id, { comments: updatedComments });
      setNewComment('');
      toast({
        title: "Comment Added",
        description: "Your comment has been posted.",
      });
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      
      try {
        // Show loading toast
        toast({
          title: "Uploading File",
          description: "Please wait while the file is being uploaded...",
        });
        
        // Generate a unique path for the file
        const filePath = FirebaseService.generateFilePath(task.id, file.name);
        
        // Upload file to Firebase Storage
        const downloadURL = await FirebaseService.uploadFile(file, filePath);
        
        // Create attachment object with the Firebase Storage URL
        const attachment: Attachment = {
          id: Date.now().toString(),
          name: file.name,
          size: file.size,
          type: file.type,
          url: downloadURL,
          uploadedBy: user?.name || 'Unknown User',
          uploadedAt: new Date().toISOString()
        };
        
        // Save attachment metadata to Firestore
        await FirebaseService.addDocument('attachments', {
          ...attachment,
          taskId: task.id,
          filePath: filePath // Store the path for potential deletion later
        });
        
        // Update local state and task
        const updatedAttachments = [...attachments, attachment];
        setAttachments(updatedAttachments);
        onUpdateTask(task.id, { attachments: updatedAttachments });
        
        toast({
          title: "File Attached",
          description: `${file.name} has been successfully uploaded.`,
        });
      } catch (error) {
        console.error('Error uploading file:', error);
        toast({
          title: "Upload Failed",
          description: "Failed to upload the file. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (!tags.includes(newTag)) {
        const updatedTags = [...tags, newTag];
        setTags(updatedTags);
        onUpdateTask(task.id, { tags: updatedTags });
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = tags.filter(tag => tag !== tagToRemove);
    setTags(updatedTags);
    onUpdateTask(task.id, { tags: updatedTags });
  };

  const handleDeleteAttachment = async (attachmentToDelete: Attachment) => {
    try {
      // Show loading toast
      toast({
        title: "Deleting attachment...",
        description: "Please wait while we remove the file.",
      });

      // Find the attachment metadata in Firestore
      const attachmentDocs = await FirebaseService.getDocuments('attachments', [
        { field: 'taskId', operator: '==', value: task.id },
        { field: 'id', operator: '==', value: attachmentToDelete.id }
      ]);

      // Delete from Firebase Storage if we have the file path
      if (attachmentDocs.length > 0 && attachmentDocs[0].filePath) {
        try {
          await FirebaseService.deleteFile(attachmentDocs[0].filePath);
        } catch (storageError) {
          console.error('Error deleting file from storage:', storageError);
          // Continue even if storage deletion fails
        }
        
        // Delete the metadata from Firestore
        await FirebaseService.deleteDocument('attachments', attachmentDocs[0].id);
      }

      // Clear attachments first to show immediate feedback
      setAttachments(prev => prev.filter(att => att.id !== attachmentToDelete.id));
      
      // Then reload from Firestore to ensure consistency
      await loadAttachments();

      toast({
        title: "Attachment Deleted",
        description: "The file has been successfully removed.",
      });
    } catch (error) {
      console.error('Error deleting attachment:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete the attachment. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (type.includes('pdf')) return <FileText className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  const currentStatus = statusOptions.find(opt => opt.value === task.status);
  const StatusIcon = currentStatus?.icon || Circle;
  const project = task.projectId ? projects.find(p => p.id === task.projectId) : null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-[600px] bg-white shadow-xl z-50 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2">
                <StatusIcon className={cn("h-5 w-5", currentStatus?.color)} />
                <span className="text-sm font-medium">Task Details</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigate(`/tasks/${task.id}`);
                  onClose();
                }}
                className="h-8 px-3"
              >
                <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                Open Full Page
              </Button>
              <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate task
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy link
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-red-600"
                  onClick={() => onDeleteTask?.(task.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete task
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title */}
          <div className="mb-6">
            {isEditingTitle ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  onBlur={handleTitleSubmit}
                  onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
                  className="flex-1 text-2xl font-semibold bg-transparent border-b-2 border-red-600 outline-none"
                  autoFocus
                />
              </div>
            ) : (
              <h2 
                className="text-2xl font-semibold cursor-pointer hover:bg-gray-50 rounded px-2 py-1 -ml-2"
                onClick={() => {
                  setEditedTitle(task.title);
                  setIsEditingTitle(true);
                }}
              >
                {task.title}
              </h2>
            )}
          </div>

          {/* Task properties */}
          <div className="space-y-4 mb-8">
            {/* Status */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500 w-24">Status</span>
              <Select
                value={task.status}
                onValueChange={(value) => onUpdateTask(task.id, { status: value as TaskStatus })}
              >
                <SelectTrigger className="w-48 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <Icon className={cn("h-4 w-4", option.color)} />
                          <span>{option.label}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Assigned by */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500 w-24">Assigned by</span>
              {task.creator ? (
                <div className="flex items-center gap-2">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={task.creator.avatar} />
                    <AvatarFallback>{task.creator.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{task.creator.name}</span>
                </div>
              ) : (
                <span className="text-sm text-gray-400">Unknown</span>
              )}
            </div>

            {/* Assignee */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500 w-24">Assignee</span>
              {isAdmin ? (
                // Admin can select any user
                <Select
                  value={task.assignee?.id || 'unassigned'}
                  onValueChange={(value) => {
                    if (value === 'unassigned') {
                      onUpdateTask(task.id, { assignee: null });
                      toast({
                        title: "Task Updated",
                        description: "Assignee removed",
                      });
                    } else {
                      const selectedUser = users.find(u => u.id === value);
                      if (selectedUser) {
                        const assignee = {
                          id: selectedUser.id,
                          name: selectedUser.name,
                          avatar: selectedUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser.name)}`,
                          email: selectedUser.email
                        };
                        onUpdateTask(task.id, { assignee });
                        toast({
                          title: "Task Updated",
                          description: `Task assigned to ${selectedUser.name}`,
                        });
                      }
                    }
                  }}
                  disabled={isLoadingMembers}
                >
                  <SelectTrigger className="h-8 w-[180px]">
                    <SelectValue>
                      {task.assignee ? (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-5 w-5">
                            <AvatarImage src={task.assignee.avatar} />
                            <AvatarFallback>{task.assignee.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{task.assignee.name}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">Unassigned</span>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span>Unassigned</span>
                      </div>
                    </SelectItem>
                    {users?.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-5 w-5">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span>{member.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                // Non-admin users can only assign/unassign themselves
                <>
                  {task.assignee?.id === user?.id ? (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-7 w-7">
                        <AvatarImage src={task.assignee.avatar} />
                        <AvatarFallback>{task.assignee.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{task.assignee.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 ml-2"
                        onClick={() => {
                          onUpdateTask(task.id, { assignee: null });
                          toast({
                            title: "Task Updated",
                            description: "You have unassigned yourself from this task",
                          });
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : task.assignee ? (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-7 w-7">
                        <AvatarImage src={task.assignee.avatar} />
                        <AvatarFallback>{task.assignee.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{task.assignee.name}</span>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8"
                      onClick={() => {
                        if (user) {
                          const assignee = {
                            id: user.id,
                            name: user.name,
                            avatar: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`,
                            email: user.email
                          };
                          onUpdateTask(task.id, { assignee });
                          toast({
                            title: "Task Updated",
                            description: "You have assigned yourself to this task",
                          });
                        }
                      }}
                    >
                      <User className="h-3.5 w-3.5 mr-2" />
                      Assign to me
                    </Button>
                  )}
                </>
              )}
            </div>

            {/* Due date */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500 w-24">Due date</span>
              <Button variant="outline" size="sm" className="h-8">
                <Calendar className="h-3.5 w-3.5 mr-2" />
                {task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy') : 'Set due date'}
              </Button>
            </div>

            {/* Priority */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500 w-24">Priority</span>
              <Select
                value={task.priority}
                onValueChange={(value) => onUpdateTask(task.id, { priority: value as TaskPriority })}
              >
                <SelectTrigger className="w-32 h-8">
                  <SelectValue>
                    {task.priority && (() => {
                      const option = priorityOptions.find(opt => opt.value === task.priority);
                      return option ? (
                        <div className="flex items-center gap-2">
                          <div className={cn("rounded px-1.5 py-0.5", option.bgColor)}>
                            <Flag className={cn(
                              "h-3.5 w-3.5", 
                              option.color,
                              option.fill && "fill-current"
                            )} />
                          </div>
                          <span>{option.label}</span>
                        </div>
                      ) : null;
                    })()}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <div className={cn("rounded px-1.5 py-0.5", option.bgColor)}>
                          <Flag className={cn(
                            "h-3.5 w-3.5", 
                            option.color,
                            option.fill && "fill-current"
                          )} />
                        </div>
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Progress */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500 w-24">Progress</span>
              <div className="flex-1">
                {isEditingProgress ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Slider
                        value={[tempProgress]}
                        onValueChange={handleProgressUpdate}
                        max={100}
                        step={5}
                        className="flex-1"
                      />
                      <span className="text-sm font-medium w-12 text-right">{tempProgress}%</span>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={handleProgressSubmit}
                        className="h-7 bg-red-600 hover:bg-red-700"
                      >
                        Save
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="h-7"
                        onClick={() => {
                          setIsEditingProgress(false);
                          setTempProgress(task.progress);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div 
                    className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded p-1 -m-1"
                    onClick={() => {
                      setTempProgress(task.progress);
                      setIsEditingProgress(true);
                    }}
                  >
                    <Progress value={task.progress} className="flex-1" />
                    <span className="text-sm font-medium">{task.progress}%</span>
                    <Edit3 className="h-3.5 w-3.5 text-gray-400" />
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            <div className="flex items-start gap-4">
              <span className="text-sm text-gray-500 w-24 pt-1">Tags</span>
              <div className="flex-1">
                {isEditingTags ? (
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag, idx) => (
                        <Badge key={idx} variant="secondary" className="bg-gray-100 flex items-center gap-1">
                          {tag}
                          <button
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-1 hover:text-red-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleAddTag}
                        placeholder="Type a tag and press Enter"
                        className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setIsEditingTags(false);
                          setTagInput('');
                        }}
                        className="h-7"
                      >
                        Done
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, idx) => (
                      <Badge key={idx} variant="secondary" className="bg-gray-100">
                        {tag}
                      </Badge>
                    ))}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 px-2"
                      onClick={() => setIsEditingTags(true)}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add tag
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Project */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500 w-24">Project</span>
              <Select
                value={task.projectId || 'no-project'}
                onValueChange={(value) => {
                  const projectId = value === 'no-project' ? null : value;
                  onUpdateTask(task.id, { projectId });
                  toast({
                    title: "Project Updated",
                    description: projectId ? "Task assigned to project" : "Project removed from task",
                  });
                }}
              >
                <SelectTrigger className="w-48 h-8">
                  <SelectValue>
                    {project ? (
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded" 
                          style={{ backgroundColor: project.color }}
                        />
                        <span>{project.name}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">No project</span>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no-project">
                    <span className="text-gray-400">No project</span>
                  </SelectItem>
                  {projects.map((proj) => (
                    <SelectItem key={proj.id} value={proj.id}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded" 
                          style={{ backgroundColor: proj.color }}
                        />
                        <span>{proj.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-700">Description</h3>
              {!isEditingDescription && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2"
                  onClick={() => {
                    setEditedDescription(task.description);
                    setIsEditingDescription(true);
                  }}
                >
                  <Edit3 className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
            {isEditingDescription ? (
              <div>
                <Textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  className="min-h-[100px] resize-none"
                  placeholder="Add a description..."
                  autoFocus
                />
                <div className="flex gap-2 mt-2">
                  <Button 
                    size="sm" 
                    onClick={handleDescriptionSubmit}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Save
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setIsEditingDescription(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <p className={cn(
                "text-sm text-gray-600 whitespace-pre-wrap",
                !task.description && "text-gray-400 italic"
              )}>
                {task.description || 'No description added'}
              </p>
            )}
          </div>

          {/* Attachments */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-700">Attachments</h3>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-3.5 w-3.5 mr-1" />
                Attach
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                accept="*/*"
              />
            </div>
            {attachments.length > 0 ? (
              <div className="space-y-2">
                {attachments.map((attachment) => (
                  <div 
                    key={attachment.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {getFileIcon(attachment.type)}
                      <div>
                        <p className="text-sm font-medium">{attachment.name}</p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(attachment.size)} • Uploaded by {attachment.uploadedBy}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => window.open(attachment.url, '_blank')}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:text-red-600"
                        onClick={() => handleDeleteAttachment(attachment)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic">No attachments yet</p>
            )}
          </div>

          {/* Activity section */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-4">Activity</h3>
            
            {/* Comment input */}
            <div className="flex gap-3 mb-6">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar || '/placeholder.svg'} />
                <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  placeholder="Write a comment..."
                  className="min-h-[80px] resize-none"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <div className="flex justify-end gap-2 mt-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Paperclip className="h-3.5 w-3.5 mr-1" />
                    Attach
                  </Button>
                  <Button 
                    size="sm" 
                    className="bg-red-600 hover:bg-red-700"
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                  >
                    <Send className="h-3.5 w-3.5 mr-1" />
                    Comment
                  </Button>
                </div>
              </div>
            </div>

            {/* Comments list */}
            {comments.length > 0 ? (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={comment.userAvatar} />
                      <AvatarFallback>{comment.userName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{comment.userName}</span>
                          <span className="text-xs text-gray-500">
                            {format(new Date(comment.createdAt), 'MMM d, h:mm a')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-sm text-gray-500">
                No comments yet. Be the first to comment!
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ClickUpTaskPanel;