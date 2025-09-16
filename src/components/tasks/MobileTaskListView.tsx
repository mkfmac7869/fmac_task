import { useState } from 'react';
import { 
  Circle,
  CheckCircle2,
  Clock,
  AlertCircle,
  Flag,
  Calendar,
  User,
  ChevronRight,
  Plus,
  Search,
  Filter,
  X
} from 'lucide-react';
import { Task, TaskStatus, TaskPriority } from '@/types/task';
import { useTask } from '@/context/TaskContext';
import { useTaskFilters } from '@/hooks/useTaskFilters';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { format, isToday, isTomorrow, isPast } from 'date-fns';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface MobileTaskListViewProps {
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onNewTask: () => void;
}

const statusConfig = {
  [TaskStatus.TODO]: { 
    icon: Circle, 
    color: 'text-gray-500',
    bgColor: 'bg-gray-50',
    label: 'To Do'
  },
  [TaskStatus.IN_PROGRESS]: { 
    icon: Clock, 
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    label: 'In Progress'
  },
  [TaskStatus.IN_REVIEW]: { 
    icon: AlertCircle, 
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    label: 'In Review'
  },
  [TaskStatus.COMPLETED]: { 
    icon: CheckCircle2, 
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    label: 'Completed'
  }
};

const priorityConfig = {
  [TaskPriority.URGENT]: { 
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-300',
    dotColor: 'bg-red-600'
  },
  [TaskPriority.HIGH]: { 
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    borderColor: 'border-yellow-300',
    dotColor: 'bg-yellow-600'
  },
  [TaskPriority.MEDIUM]: { 
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-300',
    dotColor: 'bg-blue-600'
  },
  [TaskPriority.LOW]: { 
    color: 'text-gray-500',
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-300',
    dotColor: 'bg-gray-500'
  },
};

const formatDueDate = (date: string) => {
  const dueDate = new Date(date);
  
  if (isToday(dueDate)) return 'Today';
  if (isTomorrow(dueDate)) return 'Tomorrow';
  if (isPast(dueDate)) return format(dueDate, 'MMM d');
  
  return format(dueDate, 'MMM d');
};

const MobileTaskListView = ({ 
  tasks, 
  onTaskClick, 
  onUpdateTask,
  onNewTask 
}: MobileTaskListViewProps) => {
  const { projects } = useTask();
  const {
    filters,
    sortConfig,
    filteredTasks,
    updateFilter,
    resetFilters,
    updateSort,
    activeFilterCount
  } = useTaskFilters(tasks);
  
  const [showFilters, setShowFilters] = useState(false);

  // Group tasks by status for better organization
  const groupedTasks = filteredTasks.reduce((groups, task) => {
    const status = task.status;
    if (!groups[status]) {
      groups[status] = [];
    }
    groups[status].push(task);
    return groups;
  }, {} as Record<TaskStatus, Task[]>);

  const handleStatusToggle = (taskId: string, currentStatus: TaskStatus) => {
    const statusOrder = [
      TaskStatus.TODO,
      TaskStatus.IN_PROGRESS,
      TaskStatus.IN_REVIEW,
      TaskStatus.COMPLETED
    ];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const nextIndex = (currentIndex + 1) % statusOrder.length;
    onUpdateTask(taskId, { status: statusOrder[nextIndex] });
  };

  const TaskCard = ({ task }: { task: Task }) => {
    const status = statusConfig[task.status];
    const priority = task.priority ? priorityConfig[task.priority] : null;
    const project = task.projectId ? projects.find(p => p.id === task.projectId) : null;
    const StatusIcon = status.icon;
    
    const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && task.status !== TaskStatus.COMPLETED;
    
    return (
      <div 
        className="bg-white rounded-lg border border-gray-200 p-4 mb-3 shadow-sm active:scale-[0.98] transition-transform"
        onClick={() => onTaskClick(task.id)}
      >
        {/* Header Row */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-start gap-3 flex-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleStatusToggle(task.id, task.status);
              }}
              className={cn(
                "mt-0.5 p-1 rounded transition-colors",
                status.color,
                "hover:bg-gray-100"
              )}
            >
              <StatusIcon className="h-5 w-5" />
            </button>
            
            <div className="flex-1">
              <h3 className={cn(
                "font-medium text-gray-900 mb-1",
                task.status === TaskStatus.COMPLETED && "line-through text-gray-500"
              )}>
                {task.title}
              </h3>
              
              {task.description && (
                <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                  {task.description}
                </p>
              )}
            </div>
          </div>
          
          {priority && (
            <div className={cn("w-2 h-2 rounded-full mt-2", priority.dotColor)} />
          )}
        </div>

        {/* Metadata Row */}
        <div className="flex items-center gap-4 text-xs">
          {/* Project */}
          {project && (
            <div className="flex items-center gap-1.5">
              <div 
                className="w-2.5 h-2.5 rounded" 
                style={{ backgroundColor: project.color }}
              />
              <span className="text-gray-600">{project.name}</span>
            </div>
          )}
          
          {/* Multiple Assignees */}
          {task.assignees && task.assignees.length > 0 ? (
            <div className="flex items-center gap-1">
              {task.assignees.slice(0, 2).map((assignee) => (
                <Avatar key={assignee.id} className="h-5 w-5">
                  <AvatarImage src={assignee.avatar} />
                  <AvatarFallback className="text-[10px]">
                    {assignee.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              ))}
              {task.assignees.length > 2 && (
                <div className="h-5 w-5 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-[10px] text-gray-600">+{task.assignees.length - 2}</span>
                </div>
              )}
            </div>
          ) : task.assignee ? (
            <div className="flex items-center gap-1.5">
              <Avatar className="h-5 w-5">
                <AvatarImage src={task.assignee.avatar} />
                <AvatarFallback className="text-[10px]">
                  {task.assignee.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="text-gray-600">{task.assignee.name.split(' ')[0]}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-gray-400">
              <User className="h-4 w-4" />
              <span>Unassigned</span>
            </div>
          )}
          
          {/* Due Date */}
          {task.dueDate && (
            <div className={cn(
              "flex items-center gap-1.5",
              isOverdue ? "text-red-600" : "text-gray-600"
            )}>
              <Calendar className="h-4 w-4" />
              <span>{formatDueDate(task.dueDate)}</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {task.tags.slice(0, 3).map((tag, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="text-[10px] px-2 py-0.5"
              >
                {tag}
              </Badge>
            ))}
            {task.tags.length > 3 && (
              <Badge 
                variant="secondary" 
                className="text-[10px] px-2 py-0.5"
              >
                +{task.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        {/* Search Bar */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search tasks..." 
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-9 pr-9 h-10 bg-gray-50 border-gray-200 focus:bg-white"
          />
          {filters.search && (
            <button
              onClick={() => updateFilter('search', '')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 no-scrollbar">
          <Button
            variant={filters.status === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => updateFilter('status', 'all')}
            className={cn(
              "whitespace-nowrap h-8",
              filters.status === 'all' && "bg-red-600 hover:bg-red-700 text-white"
            )}
          >
            All Tasks
            <Badge variant="secondary" className="ml-2 bg-white/20 text-white">
              {tasks.length}
            </Badge>
          </Button>
          
          {Object.entries(statusConfig).map(([status, config]) => {
            const count = tasks.filter(t => t.status === status).length;
            const Icon = config.icon;
            
            return (
              <Button
                key={status}
                variant={filters.status === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateFilter('status', status as TaskStatus)}
                className={cn(
                  "whitespace-nowrap h-8",
                  filters.status === status && "bg-red-600 hover:bg-red-700 text-white"
                )}
              >
                <Icon className="h-3.5 w-3.5 mr-1.5" />
                {config.label}
                {count > 0 && (
                  <Badge variant="secondary" className="ml-2 bg-white/20 text-white">
                    {count}
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No tasks found</p>
            <Button 
              onClick={onNewTask}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Task
            </Button>
          </div>
        ) : (
          <>
            {filters.status === 'all' ? (
              // Show grouped tasks when "All" is selected
              Object.entries(groupedTasks).map(([status, statusTasks]) => {
                if (statusTasks.length === 0) return null;
                const config = statusConfig[status as TaskStatus];
                
                return (
                  <div key={status} className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <config.icon className={cn("h-4 w-4", config.color)} />
                      <h2 className="text-sm font-semibold text-gray-700">
                        {config.label}
                      </h2>
                      <Badge variant="secondary" className="text-xs">
                        {statusTasks.length}
                      </Badge>
                    </div>
                    {statusTasks.map(task => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                  </div>
                );
              })
            ) : (
              // Show filtered tasks
              filteredTasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))
            )}
          </>
        )}
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-20 right-4 z-20">
        <Button
          onClick={onNewTask}
          size="lg"
          className="h-14 w-14 rounded-full shadow-lg bg-red-600 hover:bg-red-700 text-white"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default MobileTaskListView;
