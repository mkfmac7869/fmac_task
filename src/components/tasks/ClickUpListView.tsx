import { useState } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  Plus, 
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
  Pause,
  PlayCircle,
  XCircle
} from 'lucide-react';
import { Task, TaskStatus, TaskPriority, Project } from '@/types/task';
import { useTask } from '@/context/TaskContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ClickUpListViewProps {
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
}

interface GroupedTasks {
  [key: string]: {
    title: string;
    tasks: Task[];
    icon: React.ReactNode;
    color: string;
    bgColor: string;
  };
}

const statusConfig = {
  [TaskStatus.TODO]: { 
    icon: <Circle className="h-4 w-4" />, 
    color: 'text-gray-500',
    bgColor: 'bg-gray-50'
  },
  [TaskStatus.IN_PROGRESS]: { 
    icon: <PlayCircle className="h-4 w-4" />, 
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  [TaskStatus.IN_REVIEW]: { 
    icon: <Clock className="h-4 w-4" />, 
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50'
  },
  [TaskStatus.COMPLETED]: { 
    icon: <CheckCircle2 className="h-4 w-4" />, 
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  }
};

const priorityConfig = {
  [TaskPriority.URGENT]: { 
    icon: <Flag className="h-3.5 w-3.5 fill-current" />, 
    color: 'text-red-700',
    bgColor: 'bg-red-100'
  },
  [TaskPriority.HIGH]: { 
    icon: <Flag className="h-3.5 w-3.5 fill-current" />, 
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100'
  },
  [TaskPriority.MEDIUM]: { 
    icon: <Flag className="h-3.5 w-3.5" />, 
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  [TaskPriority.LOW]: { 
    icon: <Flag className="h-3.5 w-3.5" />, 
    color: 'text-gray-500',
    bgColor: 'bg-gray-100'
  },
};

const ClickUpListView = ({ tasks, onTaskClick, onUpdateTask }: ClickUpListViewProps) => {
  const { projects } = useTask();
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(Object.values(TaskStatus)));
  const [hoveredTask, setHoveredTask] = useState<string | null>(null);

  // Group tasks by status
  const groupedTasks: GroupedTasks = {
    [TaskStatus.TODO]: {
      title: 'To Do',
      tasks: tasks.filter(t => t.status === TaskStatus.TODO),
      icon: statusConfig[TaskStatus.TODO].icon,
      color: statusConfig[TaskStatus.TODO].color,
      bgColor: statusConfig[TaskStatus.TODO].bgColor
    },
    [TaskStatus.IN_PROGRESS]: {
      title: 'In Progress',
      tasks: tasks.filter(t => t.status === TaskStatus.IN_PROGRESS),
      icon: statusConfig[TaskStatus.IN_PROGRESS].icon,
      color: statusConfig[TaskStatus.IN_PROGRESS].color,
      bgColor: statusConfig[TaskStatus.IN_PROGRESS].bgColor
    },
    [TaskStatus.IN_REVIEW]: {
      title: 'In Review',
      tasks: tasks.filter(t => t.status === TaskStatus.IN_REVIEW),
      icon: statusConfig[TaskStatus.IN_REVIEW].icon,
      color: statusConfig[TaskStatus.IN_REVIEW].color,
      bgColor: statusConfig[TaskStatus.IN_REVIEW].bgColor
    },
    [TaskStatus.COMPLETED]: {
      title: 'Completed',
      tasks: tasks.filter(t => t.status === TaskStatus.COMPLETED),
      icon: statusConfig[TaskStatus.COMPLETED].icon,
      color: statusConfig[TaskStatus.COMPLETED].color,
      bgColor: statusConfig[TaskStatus.COMPLETED].bgColor
    }
  };

  const toggleGroup = (groupId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    onUpdateTask(taskId, { status: newStatus });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Column headers */}
      <div className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-gray-100 bg-gray-50 text-xs font-medium text-gray-600">
        <div className="col-span-4">Name</div>
        <div className="col-span-2">Assignee</div>
        <div className="col-span-2">Project</div>
        <div className="col-span-1">Due date</div>
        <div className="col-span-2">Priority</div>
        <div className="col-span-1"></div>
      </div>

      {/* Task groups */}
      {Object.entries(groupedTasks).map(([groupId, group]) => {
        if (group.tasks.length === 0) return null;
        
        return (
          <div key={groupId} className="border-b border-gray-100 last:border-b-0">
            {/* Group header */}
            <div
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors",
                "hover:bg-gray-50",
                expandedGroups.has(groupId) && group.bgColor
              )}
              onClick={() => toggleGroup(groupId)}
            >
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0"
              >
                {expandedGroups.has(groupId) ? (
                  <ChevronDown className="h-3.5 w-3.5" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5" />
                )}
              </Button>
              <div className={cn("flex items-center gap-2", group.color)}>
                {group.icon}
                <span className="font-medium text-sm">{group.title}</span>
                <span className="text-xs text-gray-500 font-normal">{group.tasks.length}</span>
              </div>
            </div>

            {/* Task items */}
            {expandedGroups.has(groupId) && (
              <>
                {group.tasks.map((task) => {
                  const priority = task.priority ? priorityConfig[task.priority] : null;
                  
                  return (
                    <div
                      key={task.id}
                      className={cn(
                        "grid grid-cols-12 gap-4 px-4 py-3 border-t border-gray-50",
                        "hover:bg-gray-50 cursor-pointer transition-colors group",
                        hoveredTask === task.id && "bg-gray-50"
                      )}
                      onMouseEnter={() => setHoveredTask(task.id)}
                      onMouseLeave={() => setHoveredTask(null)}
                      onClick={() => onTaskClick(task.id)}
                    >
                      {/* Task name and status */}
                      <div className="col-span-4 flex items-center gap-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className={cn(
                                "h-5 w-5 p-0 rounded hover:bg-gray-200",
                                statusConfig[task.status].color
                              )}
                            >
                              {statusConfig[task.status].icon}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start">
                            {Object.entries(statusConfig).map(([status, config]) => (
                              <DropdownMenuItem 
                                key={status}
                                onClick={() => handleStatusChange(task.id, status as TaskStatus)}
                              >
                                <span className={config.color}>{config.icon}</span>
                                <span className="ml-2">{groupedTasks[status]?.title || status}</span>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <span className="text-sm font-medium text-gray-900 truncate">
                          {task.title}
                        </span>
                      </div>

                      {/* Assignee */}
                      <div className="col-span-2 flex items-center">
                        {task.assignee ? (
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={task.assignee.avatar} />
                              <AvatarFallback className="text-xs">
                                {task.assignee.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-gray-700 truncate hidden lg:block">
                              {task.assignee.name}
                            </span>
                          </div>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 rounded-full border-2 border-dashed border-gray-300"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <User className="h-3 w-3 text-gray-400" />
                          </Button>
                        )}
                      </div>

                      {/* Project */}
                      <div className="col-span-2 flex items-center">
                        {task.projectId ? (
                          (() => {
                            const project = projects.find(p => p.id === task.projectId);
                            return project ? (
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-3 h-3 rounded" 
                                  style={{ backgroundColor: project.color }}
                                />
                                <span className="text-sm text-gray-700 truncate">{project.name}</span>
                              </div>
                            ) : <span className="text-sm text-gray-400">—</span>;
                          })()
                        ) : (
                          <span className="text-sm text-gray-400">—</span>
                        )}
                      </div>

                      {/* Due date */}
                      <div className="col-span-1 flex items-center text-sm text-gray-600">
                        {task.dueDate ? (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 text-gray-400" />
                            {format(new Date(task.dueDate), 'MMM d')}
                          </span>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs text-gray-400"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Calendar className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>

                      {/* Priority */}
                      <div className="col-span-2 flex items-center">
                        {priority && (
                          <div className={cn(
                            "inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium",
                            priority.color,
                            priority.bgColor
                          )}>
                            {priority.icon}
                            <span className="capitalize">{task.priority}</span>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="col-span-1 flex items-center justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className={cn(
                                "h-6 w-6 p-0 opacity-0 transition-opacity",
                                "group-hover:opacity-100"
                              )}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit task</DropdownMenuItem>
                            <DropdownMenuItem>Duplicate</DropdownMenuItem>
                            <DropdownMenuItem>Copy link</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              Delete task
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  );
                })}

                {/* Add task button */}
                <div className="px-4 py-2 border-t border-gray-50">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-gray-500 hover:text-gray-700"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    Add Task
                  </Button>
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ClickUpListView;