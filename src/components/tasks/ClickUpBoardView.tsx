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
}

const columns: BoardColumn[] = [
  {
    id: TaskStatus.TODO,
    title: 'To Do',
    color: 'text-gray-700',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    icon: <Circle className="h-4 w-4 text-gray-500" />
  },
  {
    id: TaskStatus.IN_PROGRESS,
    title: 'In Progress',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    icon: <PlayCircle className="h-4 w-4 text-blue-600" />
  },
  {
    id: TaskStatus.IN_REVIEW,
    title: 'In Review',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    icon: <Clock className="h-4 w-4 text-yellow-600" />
  },
  {
    id: TaskStatus.COMPLETED,
    title: 'Completed',
    color: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    icon: <CheckCircle2 className="h-4 w-4 text-green-600" />
  }
];

const priorityConfig = {
  [TaskPriority.URGENT]: { 
    color: 'border-l-red-700', 
    width: 'border-l-4',
    flagColor: 'text-red-700',
    bgColor: 'bg-red-100',
    fill: true
  },
  [TaskPriority.HIGH]: { 
    color: 'border-l-yellow-600', 
    width: 'border-l-4',
    flagColor: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    fill: true
  },
  [TaskPriority.MEDIUM]: { 
    color: 'border-l-blue-600', 
    width: 'border-l-4',
    flagColor: 'text-blue-600',
    bgColor: 'bg-blue-100',
    fill: false
  },
  [TaskPriority.LOW]: { 
    color: 'border-l-gray-400', 
    width: 'border-l-2',
    flagColor: 'text-gray-500',
    bgColor: 'bg-gray-100',
    fill: false
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
          "bg-white rounded-lg border shadow-sm hover:shadow-md transition-all cursor-move",
          "p-3 mb-2",
          priorityStyle?.color,
          priorityStyle?.width,
          draggedTask === task.id && "opacity-50 cursor-grabbing",
          hoveredCard === task.id && "transform -translate-y-0.5",
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

          {/* Assignee */}
          {task.assignee ? (
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

        {/* Progress bar */}
        <div className="mt-3">
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-red-600 rounded-full transition-all"
              style={{ width: `${task.progress}%` }}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 px-4">
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
              "rounded-t-lg border-t border-l border-r p-3",
              column.bgColor,
              column.borderColor
            )}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {column.icon}
                  <h3 className={cn("font-medium text-sm", column.color)}>
                    {column.title}
                  </h3>
                  <Badge
                    variant="secondary"
                    className="h-5 px-1.5 text-xs bg-white/70"
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
              "border-l border-r border-b rounded-b-lg p-2 min-h-[calc(100vh-300px)] transition-all duration-200 relative",
              column.borderColor,
              isDragOver && "bg-red-50 border-red-300"
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
                className="w-full h-8 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 mt-2"
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
