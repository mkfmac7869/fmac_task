import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  ChevronLeft,
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
  Send,
  ExternalLink,
  Trash2,
  Copy,
  Edit3,
  Plus,
  ChevronDown,
  Folder,
  Hash,
  ListChecks
} from 'lucide-react';
import { Task, TaskStatus, TaskPriority, Comment, SubTask, Checklist } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  Sheet,
  SheetContent,
  SheetHeader,
} from '@/components/ui/sheet';
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { useAuth } from '@/context/AuthContext';
import { useTask } from '@/context/TaskContext';
import { toast } from '@/hooks/use-toast';
import { useFetchMembers } from '@/hooks/memberManagement/useFetchMembers';

interface EnhancedMobileTaskPanelProps {
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
  { 
    value: TaskPriority.URGENT, 
    label: 'Urgent', 
    color: 'text-red-700', 
    bgColor: 'bg-red-100', 
    dotColor: 'bg-red-600'
  },
  { 
    value: TaskPriority.HIGH, 
    label: 'High', 
    color: 'text-yellow-600', 
    bgColor: 'bg-yellow-100',
    dotColor: 'bg-yellow-600'
  },
  { 
    value: TaskPriority.MEDIUM, 
    label: 'Medium', 
    color: 'text-blue-600', 
    bgColor: 'bg-blue-100',
    dotColor: 'bg-blue-600'
  },
  { 
    value: TaskPriority.LOW, 
    label: 'Low', 
    color: 'text-gray-500', 
    bgColor: 'bg-gray-100',
    dotColor: 'bg-gray-500'
  },
];

const EnhancedMobileTaskPanel = ({ 
  task, 
  isOpen, 
  onClose, 
  onUpdateTask,
  onDeleteTask 
}: EnhancedMobileTaskPanelProps) => {
  const { user } = useAuth();
  const { projects } = useTask();
  const { users, isLoading: isLoadingMembers } = useFetchMembers();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'details' | 'activity'>('details');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedDescription, setEditedDescription] = useState('');
  const [isEditingProgress, setIsEditingProgress] = useState(false);
  const [tempProgress, setTempProgress] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [subtasks, setSubtasks] = useState<SubTask[]>([]);
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);

  useEffect(() => {
    if (task) {
      setEditedTitle(task.title);
      setEditedDescription(task.description || '');
      setTempProgress(task.progress || 0);
      setComments(task.comments || []);
      setSubtasks(task.subtasks || []);
      setChecklists(task.checklists || []);
      setTags(task.tags || []);
    }
  }, [task]);

  if (!task) return null;

  const currentStatus = statusOptions.find(opt => opt.value === task.status);
  const StatusIcon = currentStatus?.icon || Circle;
  const priority = task.priority ? priorityOptions.find(p => p.value === task.priority) : null;
  const project = task.projectId ? projects.find(p => p.id === task.projectId) : null;
  
  const isAdmin = user?.roles?.includes('admin');

  const handleTitleSubmit = () => {
    if (editedTitle.trim() && editedTitle !== task.title) {
      onUpdateTask(task.id, { title: editedTitle });
      setIsEditingTitle(false);
      toast({
        title: "Title Updated",
        description: "Task title has been saved.",
      });
    }
  };

  const handleDescriptionSubmit = () => {
    onUpdateTask(task.id, { description: editedDescription });
    setIsEditingDescription(false);
    toast({
      title: "Description Updated",
      description: "Task description has been saved.",
    });
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

  const handleAddSubtask = () => {
    if (newSubtaskTitle.trim()) {
      const subtask: SubTask = {
        id: Date.now().toString(),
        title: newSubtaskTitle,
        completed: false,
        createdAt: new Date().toISOString()
      };
      const updatedSubtasks = [...subtasks, subtask];
      setSubtasks(updatedSubtasks);
      onUpdateTask(task.id, { subtasks: updatedSubtasks });
      setNewSubtaskTitle('');
      setIsAddingSubtask(false);
    }
  };

  const toggleSubtask = (subtaskId: string) => {
    const updatedSubtasks = subtasks.map(st => 
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );
    setSubtasks(updatedSubtasks);
    onUpdateTask(task.id, { subtasks: updatedSubtasks });
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      const updatedTags = [...tags, newTag.trim()];
      setTags(updatedTags);
      onUpdateTask(task.id, { tags: updatedTags });
      setNewTag('');
      setShowTagInput(false);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = tags.filter(tag => tag !== tagToRemove);
    setTags(updatedTags);
    onUpdateTask(task.id, { tags: updatedTags });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side="bottom" 
        className="h-[95vh] p-0 rounded-t-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-9 w-9 p-0"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              
              <Select
                value={task.status}
                onValueChange={(value) => onUpdateTask(task.id, { status: value as TaskStatus })}
              >
                <SelectTrigger className="h-8 w-fit border-0 p-0 focus:ring-0">
                  <div className={cn("flex items-center gap-2", currentStatus?.color)}>
                    <StatusIcon className="h-5 w-5" />
                    <span className="text-sm font-medium">{currentStatus?.label}</span>
                  </div>
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
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  navigate(`/tasks/${task.id}`);
                  onClose();
                }}
                className="h-9 px-3"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                    <MoreHorizontal className="h-5 w-5" />
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

        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-white flex-shrink-0">
          <button
            onClick={() => setActiveTab('details')}
            className={cn(
              "flex-1 py-3 text-sm font-medium transition-colors",
              activeTab === 'details' 
                ? "text-red-600 border-b-2 border-red-600" 
                : "text-gray-500"
            )}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={cn(
              "flex-1 py-3 text-sm font-medium transition-colors relative",
              activeTab === 'activity' 
                ? "text-red-600 border-b-2 border-red-600" 
                : "text-gray-500"
            )}
          >
            Activity
            {comments.length > 0 && (
              <Badge 
                variant="secondary" 
                className="ml-2 h-5 px-1.5 text-xs"
              >
                {comments.length}
              </Badge>
            )}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50 min-h-0">
          {activeTab === 'details' ? (
            <div className="p-4 space-y-4">
              {/* Title */}
              <div className="bg-white rounded-lg p-4">
                {isEditingTitle ? (
                  <div className="space-y-2">
                    <Input
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
                      className="text-lg font-semibold"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleTitleSubmit}>Save</Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setIsEditingTitle(false);
                          setEditedTitle(task.title);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div 
                    className="flex items-center justify-between cursor-pointer hover:bg-gray-50 -m-2 p-2 rounded"
                    onClick={() => setIsEditingTitle(true)}
                  >
                    <h2 className="text-lg font-semibold text-gray-900">{task.title}</h2>
                    <Edit3 className="h-4 w-4 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Core Properties */}
              <div className="bg-white rounded-lg p-4 space-y-4">
                {/* Project */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Folder className="h-4 w-4" />
                    <span>Project</span>
                  </div>
                  <Select
                    value={task.projectId || 'no-project'}
                    onValueChange={(value) => {
                      const projectId = value === 'no-project' ? null : value;
                      onUpdateTask(task.id, { projectId });
                    }}
                  >
                    <SelectTrigger className="h-8 w-fit min-w-[120px] text-sm">
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

                {/* Assignee */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="h-4 w-4" />
                    <span>Assignee</span>
                  </div>
                  {isAdmin ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8">
                          {task.assignee ? (
                            <div className="flex items-center gap-2">
                              <Avatar className="h-5 w-5">
                                <AvatarImage src={task.assignee.avatar} />
                                <AvatarFallback className="text-xs">
                                  {task.assignee.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm">{task.assignee.name}</span>
                            </div>
                          ) : (
                            <>
                              <User className="h-4 w-4 mr-2" />
                              <span className="text-sm">Assign</span>
                            </>
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56 max-h-60 overflow-auto">
                        <DropdownMenuItem
                          onClick={() => onUpdateTask(task.id, { assignee: null })}
                        >
                          <span className="text-gray-400">Unassigned</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {isLoadingMembers ? (
                          <div className="flex justify-center p-2">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600" />
                          </div>
                        ) : (
                          users.map(member => (
                            <DropdownMenuItem
                              key={member.id}
                              onClick={() => {
                                const assignee = {
                                  id: member.id,
                                  name: member.name,
                                  avatar: member.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}`,
                                  email: member.email
                                };
                                onUpdateTask(task.id, { assignee });
                              }}
                            >
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={member.avatar} />
                                  <AvatarFallback className="text-xs">
                                    {member.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-sm">{member.name}</span>
                              </div>
                            </DropdownMenuItem>
                          ))
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <div className="text-sm">
                      {task.assignee ? (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-5 w-5">
                            <AvatarImage src={task.assignee.avatar} />
                            <AvatarFallback className="text-xs">
                              {task.assignee.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span>{task.assignee.name}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">Unassigned</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Due Date */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>Due date</span>
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8 text-sm">
                        {task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy') : 'Set date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <CalendarComponent
                        mode="single"
                        selected={task.dueDate ? new Date(task.dueDate) : undefined}
                        onSelect={(date) => {
                          onUpdateTask(task.id, { dueDate: date?.toISOString() || '' });
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Priority */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Flag className="h-4 w-4" />
                    <span>Priority</span>
                  </div>
                  <Select
                    value={task.priority || TaskPriority.MEDIUM}
                    onValueChange={(value) => onUpdateTask(task.id, { priority: value as TaskPriority })}
                  >
                    <SelectTrigger className="h-8 w-fit min-w-[100px] text-sm">
                      <SelectValue>
                        {priority && (
                          <div className="flex items-center gap-2">
                            <div className={cn("w-2 h-2 rounded-full", priority.dotColor)} />
                            <span>{priority.label}</span>
                          </div>
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {priorityOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <div className={cn("w-2 h-2 rounded-full", option.dotColor)} />
                            <span>{option.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Progress */}
                <div>
                  {isEditingProgress ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">{tempProgress}%</span>
                      </div>
                      <Slider
                        value={[tempProgress]}
                        onValueChange={(v) => setTempProgress(v[0])}
                        max={100}
                        step={5}
                        className="w-full"
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleProgressSubmit}>Save</Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setIsEditingProgress(false);
                            setTempProgress(task.progress || 0);
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div 
                      className="space-y-2 cursor-pointer hover:bg-gray-50 -m-2 p-2 rounded"
                      onClick={() => setIsEditingProgress(true)}
                    >
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">{task.progress}%</span>
                      </div>
                      <Progress value={task.progress} className="h-2" />
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-700">Description</h3>
                  {!isEditingDescription && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditingDescription(true)}
                      className="h-8 px-2"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
                
                {isEditingDescription ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editedDescription}
                      onChange={(e) => setEditedDescription(e.target.value)}
                      className="min-h-[100px] resize-none"
                      placeholder="Add a description..."
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleDescriptionSubmit}>Save</Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setIsEditingDescription(false);
                          setEditedDescription(task.description || '');
                        }}
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

              {/* Subtasks */}
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-gray-400" />
                    <h3 className="text-sm font-medium text-gray-700">Subtasks</h3>
                    {subtasks.length > 0 && (
                      <span className="text-xs text-gray-500">
                        ({subtasks.filter(st => st.completed).length}/{subtasks.length})
                      </span>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsAddingSubtask(true)}
                    className="h-8 px-2"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                </div>

                <div className="space-y-2">
                  {subtasks.map((subtask) => (
                    <div key={subtask.id} className="flex items-center gap-2">
                      <Checkbox
                        checked={subtask.completed}
                        onCheckedChange={() => toggleSubtask(subtask.id)}
                      />
                      <span className={cn(
                        "text-sm flex-1",
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
                        className="h-8"
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
                    <p className="text-sm text-gray-400 text-center py-2">No subtasks yet</p>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-gray-400" />
                    <h3 className="text-sm font-medium text-gray-700">Tags</h3>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="bg-gray-100 cursor-pointer hover:bg-gray-200"
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  {showTagInput ? (
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        } else if (e.key === 'Escape') {
                          setShowTagInput(false);
                          setNewTag('');
                        }
                      }}
                      onBlur={handleAddTag}
                      placeholder="Tag name..."
                      className="h-6 w-24 text-sm"
                      autoFocus
                    />
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2"
                      onClick={() => setShowTagInput(true)}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add tag
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Activity Tab */
            <div className="flex flex-col h-full min-h-0">
              <div className="flex-1 overflow-y-auto p-4 min-h-0">
                {comments.length > 0 ? (
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div key={comment.id} className="bg-white rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={comment.userAvatar} />
                            <AvatarFallback className="text-xs">
                              {comment.userName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium">{comment.userName}</span>
                              <span className="text-xs text-gray-500">
                                {format(new Date(comment.createdAt), 'MMM d, h:mm a')}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">
                              {comment.content}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">No comments yet</p>
                    <p className="text-xs text-gray-400 mt-1">Be the first to comment!</p>
                  </div>
                )}
              </div>

              {/* Comment Input */}
              <div className="bg-white border-t border-gray-200 p-4 flex-shrink-0">
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar || '/placeholder.svg'} />
                    <AvatarFallback className="text-xs">
                      {user?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      placeholder="Write a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="min-h-[80px] resize-none"
                    />
                    <div className="flex justify-end mt-2">
                      <Button 
                        size="sm" 
                        className="bg-red-600 hover:bg-red-700"
                        onClick={handleAddComment}
                        disabled={!newComment.trim()}
                      >
                        <Send className="h-3.5 w-3.5 mr-1" />
                        Send
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default EnhancedMobileTaskPanel;
