import { useState } from 'react';
import { 
  Plus,
  MoreHorizontal,
  Circle,
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  Flag,
  User,
  MessageSquare,
  Paperclip,
  ChevronDown,
  Pause,
  PlayCircle,
  XCircle
} from 'lucide-react';
import { Task, TaskStatus, TaskPriority } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ClickUpBoardViewProps {
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
}

interface BoardColumn {
  id: TaskStatus;
  title: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ReactNode;
  gradient: string;
  headerGradient: string;
  hoverGradient: string;
}

const columns: BoardColumn[] = [
  {
    id: TaskStatus.TODO,
    title: 'To Do',
    color: 'text-slate-700',
    bgColor: 'bg-gradient-to-br from-slate-50 to-gray-50',
    borderColor: 'border-slate-200',
    icon: <Circle className="h-4 w-4 text-slate-500" />,
    gradient: 'from-slate-100 to-gray-100',
    headerGradient: 'bg-gradient-to-r from-slate-100 via-gray-50 to-slate-100',
    hoverGradient: 'hover:from-slate-100 hover:to-gray-200'
  },
  {
    id: TaskStatus.IN_PROGRESS,
    title: 'In Progress',
    color: 'text-blue-700',
    bgColor: 'bg-gradient-to-br from-blue-50 to-indigo-50',
    borderColor: 'border-blue-200',
    icon: <PlayCircle className="h-4 w-4 text-blue-600" />,
    gradient: 'from-blue-100 to-indigo-100',
    headerGradient: 'bg-gradient-to-r from-blue-100 via-indigo-50 to-blue-100',
    hoverGradient: 'hover:from-blue-100 hover:to-indigo-200'
  },
  {
    id: TaskStatus.IN_REVIEW,
    title: 'In Review',
    color: 'text-amber-700',
    bgColor: 'bg-gradient-to-br from-amber-50 to-yellow-50',
    borderColor: 'border-amber-200',
    icon: <Clock className="h-4 w-4 text-amber-600" />,
    gradient: 'from-amber-100 to-yellow-100',
    headerGradient: 'bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100',
    hoverGradient: 'hover:from-amber-100 hover:to-yellow-200'
  },
  {
    id: TaskStatus.COMPLETED,
    title: 'Completed',
    color: 'text-emerald-700',
    bgColor: 'bg-gradient-to-br from-emerald-50 to-green-50',
    borderColor: 'border-emerald-200',
    icon: <CheckCircle2 className="h-4 w-4 text-emerald-600" />,
    gradient: 'from-emerald-100 to-green-100',
    headerGradient: 'bg-gradient-to-r from-emerald-100 via-green-50 to-emerald-100',
    hoverGradient: 'hover:from-emerald-100 hover:to-green-200'
  }
];

const priorityConfig = {
  [TaskPriority.URGENT]: { 
    color: 'border-l-red-600', 
    width: 'border-l-4',
    flagColor: 'text-red-600',
    bgColor: 'bg-gradient-to-r from-red-50 to-rose-50',
    fill: true,
    cardGradient: 'hover:shadow-red-200/50',
    iconBg: 'bg-red-100'
  },
  [TaskPriority.HIGH]: { 
    color: 'border-l-amber-500', 
    width: 'border-l-4',
    flagColor: 'text-amber-600',
    bgColor: 'bg-gradient-to-r from-amber-50 to-yellow-50',
    fill: true,
    cardGradient: 'hover:shadow-amber-200/50',
    iconBg: 'bg-amber-100'
  },
  [TaskPriority.MEDIUM]: { 
    color: 'border-l-blue-500', 
    width: 'border-l-4',
    flagColor: 'text-blue-600',
    bgColor: 'bg-gradient-to-r from-blue-50 to-indigo-50',
    fill: false,
    cardGradient: 'hover:shadow-blue-200/50',
    iconBg: 'bg-blue-100'
  },
  [TaskPriority.LOW]: { 
    color: 'border-l-gray-400', 
    width: 'border-l-2',
    flagColor: 'text-gray-500',
    bgColor: 'bg-gradient-to-r from-gray-50 to-slate-50',
    fill: false,
    cardGradient: 'hover:shadow-gray-200/50',
    iconBg: 'bg-gray-100'
  },
};

const ClickUpBoardView = ({ tasks, onTaskClick, onUpdateTask }: ClickUpBoardViewProps) => {
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [draggedOverTask, setDraggedOverTask] = useState<string | null>(null);

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter(task => task.status === status);
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTask(taskId);
    e.dataTransfer.effectAllowed = 'move';
    // Add visual feedback
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '0.5';
    }
  };

  const handleDragOver = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    setDragOverColumn(status);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    if (draggedTask) {
      onUpdateTask(draggedTask, { status });
    }
    setDraggedTask(null);
    setDragOverColumn(null);
    setDraggedOverTask(null);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    // Restore opacity
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '1';
    }
    setDraggedTask(null);
    setDragOverColumn(null);
    setDraggedOverTask(null);
  };

  const TaskCard = ({ task }: { task: Task }) => {
    const priorityStyle = task.priority ? priorityConfig[task.priority] : null;
    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();

    return (
      <div
        draggable
        onDragStart={(e) => handleDragStart(e, task.id)}
        onDragEnd={handleDragEnd}
        onDragEnter={() => setDraggedOverTask(task.id)}
        onDragLeave={() => setDraggedOverTask(null)}
        onClick={() => onTaskClick(task.id)}
        onMouseEnter={() => setHoveredCard(task.id)}
        onMouseLeave={() => setHoveredCard(null)}
        className={cn(
          "bg-white/90 backdrop-blur-sm rounded-lg border shadow-sm hover:shadow-lg transition-all cursor-move",
          "p-3 mb-2",
          priorityStyle?.color,
          priorityStyle?.width,
          "hover:bg-gradient-to-br hover:from-white hover:to-gray-50",
          priorityStyle?.cardGradient,
          draggedTask === task.id && "opacity-50 cursor-grabbing scale-105",
          hoveredCard === task.id && "transform -translate-y-0.5 shadow-lg",
          draggedOverTask === task.id && draggedTask !== task.id && "border-t-2 border-t-red-500 mt-8"
        )}
      >
        {/* Task header */}
        <div className="flex items-start justify-between mb-2">
          <h4 className="text-sm font-medium text-gray-900 line-clamp-2 flex-1">
            {task.title}
          </h4>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-5 w-5 p-0 ml-2 opacity-0 transition-opacity",
                  hoveredCard === task.id && "opacity-100"
                )}
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit task</DropdownMenuItem>
              <DropdownMenuItem>Move to top</DropdownMenuItem>
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">Delete task</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Task description */}
        {task.description && (
          <p className="text-xs text-gray-600 line-clamp-2 mb-3">
            {task.description}
          </p>
        )}

        {/* Task tags */}
        {task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {task.tags.slice(0, 2).map((tag, idx) => (
              <Badge
                key={idx}
                variant="secondary"
                className="text-xs px-2 py-0 h-5 bg-gray-100 text-gray-700"
              >
                {tag}
              </Badge>
            ))}
            {task.tags.length > 2 && (
              <span className="text-xs text-gray-500">+{task.tags.length - 2}</span>
            )}
          </div>
        )}

        {/* Task footer */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-3">
            {/* Due date */}
            {task.dueDate && (
              <div className={cn(
                "flex items-center gap-1 text-xs",
                isOverdue ? "text-red-600" : "text-gray-500"
              )}>
                <Calendar className="h-3 w-3" />
                {format(new Date(task.dueDate), 'MMM d')}
              </div>
            )}

            {/* Comments */}
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <MessageSquare className="h-3 w-3" />
              <span>0</span>
            </div>

            {/* Attachments */}
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Paperclip className="h-3 w-3" />
              <span>0</span>
            </div>
          </div>

          {/* Assignees */}
          <div className="flex items-center justify-end">
            {task.assignees && task.assignees.length > 0 ? (
              <div className="flex items-center">
                {task.assignees.slice(0, 3).map((assignee, index) => (
                  <Avatar key={assignee.id} className="h-6 w-6 border-2 border-white" style={{ marginLeft: index > 0 ? '-8px' : '0' }}>
                    <AvatarImage src={assignee.avatar} />
                    <AvatarFallback className="text-xs">
                      {assignee.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {task.assignees.length > 3 && (
                  <div className="h-6 w-6 bg-gray-200 rounded-full flex items-center justify-center text-xs text-gray-600 border-2 border-white" style={{ marginLeft: '-8px' }}>
                    +{task.assignees.length - 3}
                  </div>
                )}
              </div>
            ) : task.assignee ? (
              <Avatar className="h-6 w-6">
                <AvatarImage src={task.assignee.avatar} />
                <AvatarFallback className="text-xs">
                  {task.assignee.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
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
        </div>

        {/* Progress bar */}
        <div className="mt-3">
          <div className="h-1.5 bg-gray-200/50 rounded-full overflow-hidden backdrop-blur-sm">
            <div
              className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${task.progress}%` }}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 px-4 bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-full">
      {columns.map((column) => {
        const columnTasks = getTasksByStatus(column.id);
        const isDragOver = dragOverColumn === column.id;

        return (
          <div
            key={column.id}
            className="flex-shrink-0 w-80"
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            {/* Column header */}
            <div className={cn(
              "rounded-t-lg p-4 backdrop-blur-sm shadow-sm",
              column.headerGradient,
              "border border-white/20"
            )}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={cn("p-1.5 rounded-lg", column.bgColor)}>
                    {column.icon}
                  </div>
                  <h3 className={cn("font-semibold text-sm", column.color)}>
                    {column.title}
                  </h3>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "h-5 px-2 text-xs font-medium",
                      "bg-white/80 backdrop-blur-sm",
                      "shadow-sm"
                    )}
                  >
                    {columnTasks.length}
                  </Badge>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 hover:bg-white/50"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 hover:bg-white/50"
                  >
                    <MoreHorizontal className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Column content */}
            <div className={cn(
              "rounded-b-lg p-3 min-h-[calc(100vh-300px)] transition-all duration-200 relative",
              "bg-gradient-to-b", column.gradient,
              "border border-t-0 border-white/20",
              "shadow-inner",
              isDragOver && "ring-2 ring-red-500 ring-opacity-50 bg-red-50/20"
            )}>
              {/* Drop zone indicator */}
              {isDragOver && draggedTask && (
                <div className="absolute inset-0 border-2 border-dashed border-red-400 rounded-lg pointer-events-none opacity-50" />
              )}
              {columnTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}

              {/* Add task button */}
              <Button
                variant="ghost"
                className={cn(
                  "w-full h-8 text-sm mt-2 transition-all duration-200",
                  "hover:bg-white/60 backdrop-blur-sm",
                  column.color
                )}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add task
              </Button>
            </div>
          </div>
        );
      })}

    </div>
  );
};

export default ClickUpBoardView;
