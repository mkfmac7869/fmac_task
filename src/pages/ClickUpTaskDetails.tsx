import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
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
  Hash,
  ListChecks,
  CheckSquare,
  Square,
  X,
  TrendingUp
} from 'lucide-react';
import Layout from '@/components/Layout';
import { useTask } from '@/context/TaskContext';
import { useAuth } from '@/context/AuthContext';
import { Task, TaskStatus, TaskPriority, Comment, Attachment, SubTask, Checklist, ChecklistItem } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { FirebaseService } from '@/lib/firebaseService';
import { useFetchMembers } from '@/hooks/memberManagement/useFetchMembers';

interface Activity {
  id: string;
  type: 'status_change' | 'assignment' | 'progress' | 'comment' | 'attachment';
  userId: string;
  userName: string;
  userAvatar: string;
  description: string;
  oldValue?: string;
  newValue?: string;
  timestamp: Date;
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

const ClickUpTaskDetails = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { tasks, getTaskById, updateTask, deleteTask, projects, isLoading } = useTask();
  const { users, isLoading: isLoadingMembers } = useFetchMembers();
  
  // State
  const [task, setTask] = useState<Task | undefined>(undefined);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedDescription, setEditedDescription] = useState('');
  const [isEditingProgress, setIsEditingProgress] = useState(false);
  const [tempProgress, setTempProgress] = useState(0);
  const [isAssigneeDropdownOpen, setIsAssigneeDropdownOpen] = useState(false);
  
  const isAdmin = user?.roles?.includes('admin') || false;
  
  // Subtasks
  const [subtasks, setSubtasks] = useState<SubTask[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);
  
  // Checklists
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [newChecklistTitle, setNewChecklistTitle] = useState('');
  const [isAddingChecklist, setIsAddingChecklist] = useState(false);
  const [newChecklistItems, setNewChecklistItems] = useState<{ [key: string]: string }>({});
  
  // Comments & Activity
  const [comments, setComments] = useState<Comment[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [newComment, setNewComment] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load task data
  useEffect(() => {
    if (taskId && !isLoading) {
      const foundTask = getTaskById(taskId);
      if (foundTask) {
        setTask(foundTask);
        // Initialize state from task data
        setSubtasks(foundTask.subtasks || []);
        setChecklists(foundTask.checklists || []);
        setComments(foundTask.comments || []);
        // Don't initialize attachments from task - we'll load from Firestore
        setAttachments([]);
        // Load related data (in production, this would come from Firebase)
        loadTaskRelatedData(taskId, foundTask);
      } else {
        navigate('/tasks');
      }
    }
  }, [taskId, tasks, isLoading, getTaskById, navigate]);

  const loadTaskRelatedData = async (taskId: string, currentTask?: Task) => {
    try {
      // Load comments
      const commentsData = await FirebaseService.getDocuments('comments', [
        { field: 'taskId', operator: '==', value: taskId }
      ]);
      setComments(commentsData.map((c: any) => ({
        ...c,
        createdAt: c.createdAt?.toDate() || new Date()
      })));

      // Load attachments from Firebase - this is the source of truth
      const attachmentsData = await FirebaseService.getDocuments('attachments', [
        { field: 'taskId', operator: '==', value: taskId }
      ]);
      
      // Always use attachments from Firestore as the source of truth
      setAttachments(attachmentsData.map((a: any) => ({
        id: a.id,
        name: a.name,
        size: a.size,
        type: a.type,
        url: a.url,
        uploadedBy: a.uploadedBy,
        uploadedAt: a.uploadedAt
      })))

      // Load activities from Firebase - try multiple approaches
      console.log('Loading activities for taskId:', taskId);
      
      try {
        // First try with getDocumentsOrdered
        const activitiesData = await FirebaseService.getDocumentsOrdered(
          'activities',
          'timestamp',
          'desc',
          [{ field: 'taskId', operator: '==', value: taskId }]
        );
        
        console.log('Activities query result:', activitiesData);
        
        // Also try a simple getDocuments query as backup
        if (!activitiesData || activitiesData.length === 0) {
          console.log('Trying alternative query...');
          const altActivities = await FirebaseService.getDocuments('activities', [
            { field: 'taskId', operator: '==', value: taskId }
          ]);
          console.log('Alternative query result:', altActivities);
          
          if (altActivities && altActivities.length > 0) {
            // Sort by timestamp manually
            altActivities.sort((a: any, b: any) => {
              const aTime = a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp);
              const bTime = b.timestamp?.toDate ? b.timestamp.toDate() : new Date(b.timestamp);
              return bTime.getTime() - aTime.getTime();
            });
            
            setActivities(altActivities.map((a: any) => ({
              id: a.id,
              type: a.type || 'status_change',
              userId: a.userId || a.user_id,
              userName: a.userName || 'Unknown User',
              userAvatar: a.userAvatar || '/placeholder.svg',
              description: a.description || a.action || 'made changes',
              oldValue: a.oldValue,
              newValue: a.newValue,
              timestamp: a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp)
            })));
            return;
          }
        }
        
        if (activitiesData && activitiesData.length > 0) {
          setActivities(activitiesData.map((a: any) => ({
            id: a.id,
            type: a.type || 'status_change',
            userId: a.userId || a.user_id,
            userName: a.userName || 'Unknown User',
            userAvatar: a.userAvatar || '/placeholder.svg',
            description: a.description || a.action || 'made changes',
            oldValue: a.oldValue,
            newValue: a.newValue,
            timestamp: a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp)
          })));
        } else {
          // If no activities exist, create the initial "created" activity
          console.log('No activities found, creating initial activity...');
          
          // Use the task passed as parameter or the current task state
          const taskToUse = currentTask || task;
          
          // Get creator info
          let creatorId = taskToUse?.creator?.id || (taskToUse as any)?.created_by || user?.id || 'system';
          let creatorName = taskToUse?.creator?.name || 'Unknown User';
          let creatorAvatar = taskToUse?.creator?.avatar || '/placeholder.svg';
          
          // If we only have creator ID but not full creator info, fetch it
          if (!taskToUse?.creator && creatorId && creatorId !== 'system') {
            try {
              const creatorProfile = await FirebaseService.getDocument('profiles', creatorId);
              if (creatorProfile) {
                creatorName = creatorProfile.name || 'Unknown User';
                creatorAvatar = creatorProfile.avatar || `/placeholder.svg`;
              }
            } catch (error) {
              console.log('Could not fetch creator profile:', error);
            }
          }
          
          const createdActivity: Activity = {
            id: Date.now().toString(),
            type: 'status_change',
            userId: creatorId,
            userName: creatorName,
            userAvatar: creatorAvatar,
            description: 'created this task',
            timestamp: taskToUse?.createdAt ? new Date(taskToUse.createdAt) : new Date()
          };
          
          // Save the initial activity
          const savedActivity = await FirebaseService.addDocument('activities', {
            ...createdActivity,
            taskId: taskId,
            timestamp: createdActivity.timestamp
          });
          
          console.log('Created initial activity:', savedActivity);
          setActivities([{ ...createdActivity, id: savedActivity.id }]);
        }
      } catch (error) {
        console.error('Error loading activities:', error);
      }
    } catch (error) {
      console.error('Error loading task data:', error);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      </Layout>
    );
  }

  if (!task) {
    return null;
  }

  const project = task.projectId ? projects.find(p => p.id === task.projectId) : null;
  const currentStatus = statusOptions.find(opt => opt.value === task.status);
  const StatusIcon = currentStatus?.icon || Circle;

  // Handlers
  const handleTitleSubmit = async () => {
    if (editedTitle.trim() && editedTitle !== task.title) {
      updateTask(task.id, { title: editedTitle });
      await addActivity('status_change', `changed title from "${task.title}" to "${editedTitle}"`, task.title, editedTitle);
    }
    setIsEditingTitle(false);
  };

  const handleDescriptionSubmit = async () => {
    if (editedDescription !== task.description) {
      updateTask(task.id, { description: editedDescription });
      await addActivity('status_change', 'updated the description');
    }
    setIsEditingDescription(false);
  };

  const handleProgressSubmit = async () => {
    updateTask(task.id, { progress: tempProgress });
    await addActivity('progress', `updated progress from ${task.progress}% to ${tempProgress}%`, task.progress.toString(), tempProgress.toString());
    setIsEditingProgress(false);
    toast({
      title: "Progress Updated",
      description: `Task progress set to ${tempProgress}%`,
    });
  };

  const handleStatusChange = async (newStatus: TaskStatus) => {
    updateTask(task.id, { status: newStatus });
    const oldStatus = statusOptions.find(s => s.value === task.status)?.label;
    const newStatusLabel = statusOptions.find(s => s.value === newStatus)?.label;
    await addActivity('status_change', `changed status from ${oldStatus} to ${newStatusLabel}`, task.status, newStatus);
  };

  const handlePriorityChange = async (newPriority: TaskPriority) => {
    updateTask(task.id, { priority: newPriority });
    const oldPriority = priorityOptions.find(p => p.value === task.priority)?.label;
    const newPriorityLabel = priorityOptions.find(p => p.value === newPriority)?.label;
    await addActivity('status_change', `changed priority from ${oldPriority} to ${newPriorityLabel}`, task.priority, newPriority);
  };

  const addActivity = async (type: Activity['type'], description: string, oldValue?: string, newValue?: string) => {
    if (!task) return;
    
    const activity: Activity = {
      id: Date.now().toString(),
      type,
      userId: user?.id || '',
      userName: user?.name || 'Unknown User',
      userAvatar: user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}`,
      description,
      oldValue,
      newValue,
      timestamp: new Date()
    };
    
    try {
      // Save to Firebase
      const result = await FirebaseService.addDocument('activities', {
        ...activity,
        taskId: task.id,
        timestamp: activity.timestamp
      });
      
      // Update with the real ID from Firebase
      activity.id = result.id;
      
      // Update local state - add to beginning for latest first
      setActivities(prev => [activity, ...prev]);
    } catch (error) {
      console.error('Error saving activity:', error);
    }
  };

  const handleAddComment = async () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        userId: user?.id || '',
        userName: user?.name || 'Unknown User',
        userAvatar: user?.avatar || '/placeholder.svg',
        content: newComment,
        createdAt: new Date().toISOString()
      };
      
      try {
        // Save to Firebase
        await FirebaseService.addDocument('comments', {
          ...comment,
          taskId: task.id
        });
        
        const updatedComments = [...comments, comment];
        setComments(updatedComments);
        updateTask(task.id, { comments: updatedComments });
        setNewComment('');
        await addActivity('comment', 'added a comment');
        toast({
          title: "Comment Added",
          description: "Your comment has been posted.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to add comment.",
          variant: "destructive"
        });
      }
    }
  };

  const handleAddSubtask = async () => {
    if (newSubtaskTitle.trim() && task) {
      const subtask: SubTask = {
        id: Date.now().toString(),
        title: newSubtaskTitle,
        completed: false,
        createdAt: new Date().toISOString()
      };
      const updatedSubtasks = [...subtasks, subtask];
      setSubtasks(updatedSubtasks);
      updateTask(task.id, { subtasks: updatedSubtasks });
      await addActivity('status_change', `added subtask "${newSubtaskTitle}"`);
      setNewSubtaskTitle('');
      setIsAddingSubtask(false);
      toast({
        title: "Subtask Added",
        description: "New subtask has been created.",
      });
    }
  };

  const toggleSubtask = async (subtaskId: string) => {
    if (task) {
      const subtask = subtasks.find(st => st.id === subtaskId);
      if (subtask) {
        const updatedSubtasks = subtasks.map(st => 
          st.id === subtaskId ? { ...st, completed: !st.completed } : st
        );
        setSubtasks(updatedSubtasks);
        updateTask(task.id, { subtasks: updatedSubtasks });
        const action = !subtask.completed ? 'completed' : 'uncompleted';
        await addActivity('status_change', `${action} subtask "${subtask.title}"`);
      }
    }
  };

  const handleAddChecklist = async () => {
    if (newChecklistTitle.trim() && task) {
      const checklist: Checklist = {
        id: Date.now().toString(),
        title: newChecklistTitle,
        items: []
      };
      const updatedChecklists = [...checklists, checklist];
      setChecklists(updatedChecklists);
      updateTask(task.id, { checklists: updatedChecklists });
      await addActivity('status_change', `added checklist "${newChecklistTitle}"`);
      setNewChecklistTitle('');
      setIsAddingChecklist(false);
    }
  };

  const addChecklistItem = async (checklistId: string) => {
    const itemText = newChecklistItems[checklistId];
    if (itemText?.trim() && task) {
      const checklist = checklists.find(cl => cl.id === checklistId);
      const updatedChecklists = checklists.map(cl => {
        if (cl.id === checklistId) {
          return {
            ...cl,
            items: [...cl.items, {
              id: Date.now().toString(),
              content: itemText,
              completed: false
            }]
          };
        }
        return cl;
      });
      setChecklists(updatedChecklists);
      updateTask(task.id, { checklists: updatedChecklists });
      if (checklist) {
        await addActivity('status_change', `added item "${itemText.trim()}" to checklist "${checklist.title}"`);
      }
      setNewChecklistItems({ ...newChecklistItems, [checklistId]: '' });
    }
  };

  const toggleChecklistItem = async (checklistId: string, itemId: string) => {
    if (task) {
      const checklist = checklists.find(cl => cl.id === checklistId);
      const item = checklist?.items.find(i => i.id === itemId);
      
      const updatedChecklists = checklists.map(cl => {
        if (cl.id === checklistId) {
          return {
            ...cl,
            items: cl.items.map(item => 
              item.id === itemId ? { ...item, completed: !item.completed } : item
            )
          };
        }
        return cl;
      });
      setChecklists(updatedChecklists);
      updateTask(task.id, { checklists: updatedChecklists });
      
      if (checklist && item) {
        const action = !item.completed ? 'completed' : 'uncompleted';
        await addActivity('status_change', `${action} checklist item "${item.content}" in "${checklist.title}"`);
      }
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0 && task) {
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
        updateTask(task.id, { attachments: updatedAttachments });
        
        // Add activity
        await addActivity('attachment', `attached ${file.name}`);
        
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

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (type.includes('pdf')) return <FileText className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  const handleDeleteAttachment = async (attachmentToDelete: Attachment) => {
    try {
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
        }
        
        // Delete the metadata from Firestore
        await FirebaseService.deleteDocument('attachments', attachmentDocs[0].id);
      }

      // Add activity
      await addActivity('attachment', `removed ${attachmentToDelete.name}`);

      // Reload attachments from Firestore to ensure consistency
      await loadTaskRelatedData(task.id, task);

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

  const handleDeleteTask = () => {
    if (task.id) {
      deleteTask(task.id);
      navigate('/tasks');
      toast({
        title: "Task Deleted",
        description: "The task has been deleted successfully.",
      });
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/tasks')}
                  className="h-8 px-2"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
                
                <div className="flex items-center gap-2">
                  <StatusIcon className={cn("h-5 w-5", currentStatus?.color)} />
                  {project && (
                    <>
                      <span className="text-sm text-gray-500">{project.name}</span>
                      <span className="text-sm text-gray-400">/</span>
                    </>
                  )}
                  <span className="text-sm font-medium">Task #{task.id.slice(-6)}</span>
                </div>
              </div>

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
                    onClick={handleDeleteTask}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete task
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title */}
              <div className="bg-white rounded-lg p-6">
                {isEditingTitle ? (
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    onBlur={handleTitleSubmit}
                    onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
                    className="text-2xl font-semibold w-full bg-transparent border-b-2 border-red-600 outline-none"
                    autoFocus
                  />
                ) : (
                  <h1 
                    className="text-2xl font-semibold cursor-pointer hover:bg-gray-50 rounded px-2 py-1 -ml-2"
                    onClick={() => {
                      setEditedTitle(task.title);
                      setIsEditingTitle(true);
                    }}
                  >
                    {task.title}
                  </h1>
                )}

                {/* Description */}
                <div className="mt-6">
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
                        className="min-h-[150px] resize-none"
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
              </div>

              {/* Subtasks */}
              <div className="bg-white rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Hash className="h-5 w-5 text-gray-400" />
                    Subtasks
                    {subtasks.length > 0 && (
                      <span className="text-sm text-gray-500">
                        ({subtasks.filter(st => st.completed).length}/{subtasks.length})
                      </span>
                    )}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsAddingSubtask(true)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  {subtasks.map((subtask) => (
                    <div key={subtask.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                      <Checkbox
                        checked={subtask.completed}
                        onCheckedChange={() => toggleSubtask(subtask.id)}
                      />
                      <span className={cn(
                        "flex-1",
                        subtask.completed && "line-through text-gray-400"
                      )}>
                        {subtask.title}
                      </span>
                    </div>
                  ))}

                  {isAddingSubtask && (
                    <div className="flex items-center gap-2">
                      <Input
                        value={newSubtaskTitle}
                        onChange={(e) => setNewSubtaskTitle(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddSubtask()}
                        placeholder="Subtask name..."
                        className="flex-1"
                        autoFocus
                      />
                      <Button size="sm" onClick={handleAddSubtask}>Add</Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setIsAddingSubtask(false);
                          setNewSubtaskTitle('');
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  {subtasks.length === 0 && !isAddingSubtask && (
                    <p className="text-sm text-gray-400 text-center py-4">No subtasks yet</p>
                  )}
                </div>
              </div>

              {/* Checklists */}
              <div className="bg-white rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <ListChecks className="h-5 w-5 text-gray-400" />
                    Checklists
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsAddingChecklist(true)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  {checklists.map((checklist) => {
                    const completedCount = checklist.items.filter(item => item.completed).length;
                    const progress = checklist.items.length > 0 
                      ? (completedCount / checklist.items.length) * 100 
                      : 0;

                    return (
                      <div key={checklist.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium">{checklist.title}</h4>
                          <span className="text-sm text-gray-500">
                            {completedCount}/{checklist.items.length}
                          </span>
                        </div>
                        
                        {checklist.items.length > 0 && (
                          <Progress value={progress} className="h-2 mb-3" />
                        )}

                        <div className="space-y-2">
                          {checklist.items.map((item) => (
                            <div key={item.id} className="flex items-center gap-3">
                              <Checkbox
                                checked={item.completed}
                                onCheckedChange={() => toggleChecklistItem(checklist.id, item.id)}
                              />
                              <span className={cn(
                                "flex-1 text-sm",
                                item.completed && "line-through text-gray-400"
                              )}>
                                {item.content}
                              </span>
                            </div>
                          ))}

                          <div className="flex items-center gap-2 mt-2">
                            <Input
                              value={newChecklistItems[checklist.id] || ''}
                              onChange={(e) => setNewChecklistItems({
                                ...newChecklistItems,
                                [checklist.id]: e.target.value
                              })}
                              onKeyDown={(e) => e.key === 'Enter' && addChecklistItem(checklist.id)}
                              placeholder="Add item..."
                              className="flex-1 h-8"
                            />
                            <Button
                              size="sm"
                              className="h-8"
                              onClick={() => addChecklistItem(checklist.id)}
                            >
                              Add
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {isAddingChecklist && (
                    <div className="flex items-center gap-2">
                      <Input
                        value={newChecklistTitle}
                        onChange={(e) => setNewChecklistTitle(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddChecklist()}
                        placeholder="Checklist title..."
                        className="flex-1"
                        autoFocus
                      />
                      <Button size="sm" onClick={handleAddChecklist}>Create</Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setIsAddingChecklist(false);
                          setNewChecklistTitle('');
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  {checklists.length === 0 && !isAddingChecklist && (
                    <p className="text-sm text-gray-400 text-center py-4">No checklists yet</p>
                  )}
                </div>
              </div>

              {/* Attachments */}
              <div className="bg-white rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Attachments</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {attachments.map((attachment) => (
                      <div 
                        key={attachment.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {getFileIcon(attachment.type)}
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{attachment.name}</p>
                            <p className="text-xs text-gray-500">
                              {formatFileSize(attachment.size)} • {attachment.uploadedBy}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 ml-2">
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
                  <p className="text-sm text-gray-400 text-center py-8">No attachments yet</p>
                )}
              </div>

              {/* Activity & Comments */}
              <div className="bg-white rounded-lg p-6">
                <Tabs defaultValue="comments" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="comments">
                      Comments ({comments.length})
                    </TabsTrigger>
                    <TabsTrigger value="activity">
                      Activity ({activities.length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="comments" className="mt-4">
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
                                <p className="text-sm text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 text-center py-8">
                        No comments yet. Be the first to comment!
                      </p>
                    )}
                  </TabsContent>

                  <TabsContent value="activity" className="mt-4">
                    <div className="space-y-4">
                      {activities.length > 0 ? (
                        activities.map((activity) => {
                          let icon = null;
                          let iconColor = 'text-gray-400';
                          
                          switch (activity.type) {
                            case 'status_change':
                              icon = <Circle className="h-4 w-4" />;
                              iconColor = 'text-blue-500';
                              break;
                            case 'assignment':
                              icon = <User className="h-4 w-4" />;
                              iconColor = 'text-purple-500';
                              break;
                            case 'progress':
                              icon = <TrendingUp className="h-4 w-4" />;
                              iconColor = 'text-green-500';
                              break;
                            case 'comment':
                              icon = <MessageSquare className="h-4 w-4" />;
                              iconColor = 'text-gray-500';
                              break;
                            case 'attachment':
                              icon = <Paperclip className="h-4 w-4" />;
                              iconColor = 'text-amber-500';
                              break;
                          }
                          
                          return (
                            <div key={activity.id} className="flex gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                              <div className="relative">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={activity.userAvatar} />
                                  <AvatarFallback>{activity.userName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                {icon && (
                                  <div className={cn(
                                    "absolute -bottom-1 -right-1 p-1 bg-white rounded-full shadow-sm",
                                    iconColor
                                  )}>
                                    {icon}
                                  </div>
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="text-sm">
                                    <span className="font-medium text-gray-900">{activity.userName}</span>
                                    <span className="text-gray-600 ml-1">{activity.description}</span>
                                    {activity.oldValue && activity.newValue && (
                                      <div className="mt-1 text-xs">
                                        <span className="text-gray-500 line-through">{activity.oldValue}</span>
                                        <span className="mx-2">→</span>
                                        <span className="text-gray-700 font-medium">{activity.newValue}</span>
                                      </div>
                                    )}
                                  </div>
                                  <span className="text-xs text-gray-400 whitespace-nowrap">
                                    {format(activity.timestamp, 'MMM d, h:mm a')}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-sm text-gray-400 text-center py-8">
                          No activity recorded yet.
                        </p>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            {/* Right Column - Properties */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6 sticky top-24">
                <h3 className="text-lg font-medium mb-4">Properties</h3>
                
                <div className="space-y-4">
                  {/* Status */}
                  <div>
                    <label className="text-sm text-gray-500 mb-1 block">Status</label>
                    <Select
                      value={task.status}
                      onValueChange={(value) => handleStatusChange(value as TaskStatus)}
                    >
                      <SelectTrigger className="w-full">
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
                  <div>
                    <label className="text-sm text-gray-500 mb-1 block">Assigned by</label>
                    {task.creator ? (
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <Avatar className="h-7 w-7">
                          <AvatarImage src={task.creator.avatar} />
                          <AvatarFallback>{task.creator.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{task.creator.name}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">Unknown</span>
                    )}
                  </div>

                  {/* Assignee */}
                  <div>
                    <label className="text-sm text-gray-500 mb-1 block">Assignee</label>
                    {isAdmin ? (
                      // Admin can select any user
                      <Select
                        value={task.assignee?.id || 'unassigned'}
                        onValueChange={async (value) => {
                          if (value === 'unassigned') {
                            updateTask(task.id, { assignee: null });
                            await addActivity('assignment', 'removed assignee');
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
                              updateTask(task.id, { assignee });
                              await addActivity('assignment', `assigned task to ${selectedUser.name}`);
                              toast({
                                title: "Task Updated",
                                description: `Task assigned to ${selectedUser.name}`,
                              });
                            }
                          }
                        }}
                        disabled={isLoadingMembers}
                      >
                        <SelectTrigger>
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
                              <span className="text-sm text-gray-500">Select assignee</span>
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
                          <div className="flex items-center justify-between bg-gray-50 rounded-md p-2">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-7 w-7">
                                <AvatarImage src={task.assignee.avatar} />
                                <AvatarFallback>{task.assignee.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span className="text-sm">{task.assignee.name} (You)</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2"
                              onClick={async () => {
                                updateTask(task.id, { assignee: null });
                                await addActivity('assignment', 'unassigned themselves from task');
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
                          <div className="bg-gray-50 rounded-md p-2">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-7 w-7">
                                <AvatarImage src={task.assignee.avatar} />
                                <AvatarFallback>{task.assignee.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span className="text-sm">{task.assignee.name}</span>
                            </div>
                          </div>
                        ) : (
                          <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={async () => {
                              if (user) {
                                const assignee = {
                                  id: user.id,
                                  name: user.name,
                                  avatar: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`,
                                  email: user.email
                                };
                                updateTask(task.id, { assignee });
                                await addActivity('assignment', 'assigned themselves to task');
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
                  <div>
                    <label className="text-sm text-gray-500 mb-1 block">Due date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                          <Calendar className="h-3.5 w-3.5 mr-2" />
                          {task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy') : 'Set due date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={task.dueDate ? new Date(task.dueDate) : undefined}
                          onSelect={async (date) => {
                            if (date) {
                              const oldDate = task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy') : 'No due date';
                              const newDate = format(date, 'MMM d, yyyy');
                              updateTask(task.id, { dueDate: date.toISOString() });
                              await addActivity('status_change', `changed due date from ${oldDate} to ${newDate}`, task.dueDate, date.toISOString());
                              toast({
                                title: "Due Date Updated",
                                description: `Due date set to ${newDate}`,
                              });
                            }
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="text-sm text-gray-500 mb-1 block">Priority</label>
                    <Select
                      value={task.priority}
                      onValueChange={(value) => handlePriorityChange(value as TaskPriority)}
                    >
                      <SelectTrigger className="w-full">
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
                  <div>
                    <label className="text-sm text-gray-500 mb-1 block">Progress</label>
                    {isEditingProgress ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <Slider
                            value={[tempProgress]}
                            onValueChange={(v) => setTempProgress(v[0])}
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
                        className="cursor-pointer hover:bg-gray-50 rounded p-2 -m-2"
                        onClick={() => {
                          setTempProgress(task.progress);
                          setIsEditingProgress(true);
                        }}
                      >
                        <Progress value={task.progress} className="mb-1" />
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{task.progress}%</span>
                          <Edit3 className="h-3.5 w-3.5 text-gray-400" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="text-sm text-gray-500 mb-1 block">Tags</label>
                    <div className="flex flex-wrap gap-2">
                      {task.tags.map((tag, idx) => (
                        <Badge key={idx} variant="secondary" className="bg-gray-100">
                          {tag}
                        </Badge>
                      ))}
                      <Button variant="ghost" size="sm" className="h-6 px-2">
                        <Plus className="h-3 w-3 mr-1" />
                        Add tag
                      </Button>
                    </div>
                  </div>

                  {/* Project */}
                  <div>
                    <label className="text-sm text-gray-500 mb-1 block">Project</label>
                    <Select
                      value={task.projectId || 'no-project'}
                      onValueChange={async (value) => {
                        const projectId = value === 'no-project' ? null : value;
                        updateTask(task.id, { projectId });
                        await addActivity('status_change', projectId ? 
                          `assigned task to ${projects.find(p => p.id === projectId)?.name}` : 
                          'removed project assignment'
                        );
                        toast({
                          title: "Project Updated",
                          description: projectId ? "Task assigned to project" : "Project removed from task",
                        });
                      }}
                    >
                      <SelectTrigger className="w-full">
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ClickUpTaskDetails;
