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
  Edit3
} from 'lucide-react';
import { Task, TaskStatus, TaskPriority, Comment } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
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
import { useAuth } from '@/context/AuthContext';
import { useTask } from '@/context/TaskContext';
import { toast } from '@/hooks/use-toast';
import { useFetchMembers } from '@/hooks/memberManagement/useFetchMembers';

interface MobileTaskPanelProps {
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

const MobileTaskPanel = ({ 
  task, 
  isOpen, 
  onClose, 
  onUpdateTask,
  onDeleteTask 
}: MobileTaskPanelProps) => {
  const { user } = useAuth();
  const { projects } = useTask();
  const { users, isLoading: isLoadingMembers } = useFetchMembers();
  const navigate = useNavigate();
  
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedDescription, setEditedDescription] = useState('');
  const [activeTab, setActiveTab] = useState<'details' | 'comments'>('details');

  useEffect(() => {
    if (task) {
      setComments(task.comments || []);
      setEditedDescription(task.description || '');
    }
  }, [task]);

  if (!task) return null;

  const currentStatus = statusOptions.find(opt => opt.value === task.status);
  const StatusIcon = currentStatus?.icon || Circle;
  const priority = task.priority ? priorityOptions.find(p => p.value === task.priority) : null;
  const project = task.projectId ? projects.find(p => p.id === task.projectId) : null;
  
  const isAdmin = user?.roles?.includes('admin');

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

  const handleStatusCycle = () => {
    const statusOrder = [
      TaskStatus.TODO,
      TaskStatus.IN_PROGRESS,
      TaskStatus.IN_REVIEW,
      TaskStatus.COMPLETED
    ];
    const currentIndex = statusOrder.indexOf(task.status);
    const nextIndex = (currentIndex + 1) % statusOrder.length;
    onUpdateTask(task.id, { status: statusOrder[nextIndex] });
  };

  const handleSaveDescription = () => {
    onUpdateTask(task.id, { description: editedDescription });
    setIsEditingDescription(false);
    toast({
      title: "Description Updated",
      description: "Task description has been saved.",
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side="bottom" 
        className="h-[95vh] p-0 rounded-t-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-3">
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
              
              <button
                onClick={handleStatusCycle}
                className={cn(
                  "p-1.5 rounded transition-colors",
                  currentStatus?.color,
                  "hover:bg-gray-100"
                )}
              >
                <StatusIcon className="h-5 w-5" />
              </button>
              
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">Task Details</span>
                {priority && (
                  <div className={cn("w-2 h-2 rounded-full", priority.dotColor)} />
                )}
              </div>
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
        <div className="flex border-b border-gray-200 bg-white">
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
            onClick={() => setActiveTab('comments')}
            className={cn(
              "flex-1 py-3 text-sm font-medium transition-colors relative",
              activeTab === 'comments' 
                ? "text-red-600 border-b-2 border-red-600" 
                : "text-gray-500"
            )}
          >
            Comments
            {comments.length > 0 && (
              <Badge 
                variant="secondary" 
                className="ml-2 h-5 px-1.5 text-xs bg-gray-100"
              >
                {comments.length}
              </Badge>
            )}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          {activeTab === 'details' ? (
            <div className="p-4 space-y-4">
              {/* Title */}
              <div className="bg-white rounded-lg p-4">
                <h2 className="text-lg font-semibold text-gray-900">{task.title}</h2>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg p-4 space-y-3">
                {/* Project */}
                {project && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Project</span>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded" 
                        style={{ backgroundColor: project.color }}
                      />
                      <span className="text-sm font-medium">{project.name}</span>
                    </div>
                  </div>
                )}

                {/* Assignee */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Assignee</span>
                  {task.assignee ? (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={task.assignee.avatar} />
                        <AvatarFallback className="text-xs">
                          {task.assignee.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{task.assignee.name}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">Unassigned</span>
                  )}
                </div>

                {/* Due Date */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Due date</span>
                  <span className="text-sm font-medium">
                    {task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy') : 'No due date'}
                  </span>
                </div>

                {/* Priority */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Priority</span>
                  {priority && (
                    <div className={cn(
                      "inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium",
                      priority.color,
                      priority.bgColor
                    )}>
                      <Flag className="h-3.5 w-3.5 fill-current" />
                      <span>{priority.label}</span>
                    </div>
                  )}
                </div>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Progress</span>
                    <span className="text-sm font-medium">{task.progress}%</span>
                  </div>
                  <Progress value={task.progress} className="h-2" />
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
                      <Button 
                        size="sm" 
                        onClick={handleSaveDescription}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Save
                      </Button>
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

              {/* Tags */}
              {task.tags && task.tags.length > 0 && (
                <div className="bg-white rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {task.tags.map((tag, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="bg-gray-100"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Comments Tab */
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-y-auto p-4">
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
              <div className="bg-white border-t border-gray-200 p-4">
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

export default MobileTaskPanel;
