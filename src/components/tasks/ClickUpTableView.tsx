import { useState } from 'react';
import { 
  ChevronDown,
  ChevronUp,
  Circle,
  CheckCircle2,
  Clock,
  AlertCircle,
  Flag,
  Calendar,
  User,
  Tag,
  MessageSquare,
  MoreHorizontal,
  ArrowUpDown,
  Folder
} from 'lucide-react';
import { Task, TaskStatus, TaskPriority, Project } from '@/types/task';
import { useTask } from '@/context/TaskContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ClickUpTableViewProps {
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
}

type SortField = 'title' | 'status' | 'priority' | 'dueDate' | 'assignee' | 'progress' | 'project';
type SortDirection = 'asc' | 'desc';

const statusConfig = {
  [TaskStatus.TODO]: { 
    icon: <Circle className="h-4 w-4" />, 
    label: 'To Do',
    color: 'text-gray-400'
  },
  [TaskStatus.IN_PROGRESS]: { 
    icon: <Clock className="h-4 w-4" />, 
    label: 'In Progress',
    color: 'text-blue-600'
  },
  [TaskStatus.IN_REVIEW]: { 
    icon: <AlertCircle className="h-4 w-4" />, 
    label: 'In Review',
    color: 'text-yellow-600'
  },
  [TaskStatus.COMPLETED]: { 
    icon: <CheckCircle2 className="h-4 w-4" />, 
    label: 'Completed',
    color: 'text-green-600'
  }
};

const priorityConfig = {
  [TaskPriority.URGENT]: { 
    icon: <Flag className="h-3.5 w-3.5 fill-current" />, 
    label: 'Urgent',
    color: 'text-red-700',
    bgColor: 'bg-red-100'
  },
  [TaskPriority.HIGH]: { 
    icon: <Flag className="h-3.5 w-3.5 fill-current" />, 
    label: 'High',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100'
  },
  [TaskPriority.MEDIUM]: { 
    icon: <Flag className="h-3.5 w-3.5" />, 
    label: 'Medium',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  [TaskPriority.LOW]: { 
    icon: <Flag className="h-3.5 w-3.5" />, 
    label: 'Low',
    color: 'text-gray-500',
    bgColor: 'bg-gray-100'
  },
};

const ClickUpTableView = ({ tasks, onTaskClick, onUpdateTask }: ClickUpTableViewProps) => {
  const { projects } = useTask();
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<SortField>('title');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    let aValue: any = a[sortField];
    let bValue: any = b[sortField];

    if (sortField === 'assignee') {
      aValue = a.assignee?.name || '';
      bValue = b.assignee?.name || '';
    }
    
    if (sortField === 'project') {
      aValue = a.projectId ? projects.find(p => p.id === a.projectId)?.name || '' : '';
      bValue = b.projectId ? projects.find(p => p.id === b.projectId)?.name || '' : '';
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const toggleTaskSelection = (taskId: string) => {
    const newSelected = new Set(selectedTasks);
    if (newSelected.has(taskId)) {
      newSelected.delete(taskId);
    } else {
      newSelected.add(taskId);
    }
    setSelectedTasks(newSelected);
  };

  const toggleAllSelection = () => {
    if (selectedTasks.size === tasks.length) {
      setSelectedTasks(new Set());
    } else {
      setSelectedTasks(new Set(tasks.map(t => t.id)));
    }
  };

  const TableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <th className="px-4 py-3 text-left">
      <Button
        variant="ghost"
        size="sm"
        className="h-auto p-0 font-medium text-xs text-gray-500 hover:text-gray-700"
        onClick={() => handleSort(field)}
      >
        {children}
        <ArrowUpDown className="ml-1 h-3 w-3" />
      </Button>
    </th>
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="w-12 px-4 py-3">
                <Checkbox
                  checked={selectedTasks.size === tasks.length && tasks.length > 0}
                  onCheckedChange={toggleAllSelection}
                />
              </th>
              <TableHeader field="title">Task Name</TableHeader>
              <TableHeader field="status">Status</TableHeader>
              <TableHeader field="assignee">Assignee</TableHeader>
              <TableHeader field="project">Project</TableHeader>
              <TableHeader field="dueDate">Due Date</TableHeader>
              <TableHeader field="priority">Priority</TableHeader>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Tags</th>
              <TableHeader field="progress">Progress</TableHeader>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Comments</th>
              <th className="w-12 px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sortedTasks.map((task) => (
              <tr
                key={task.id}
                className={cn(
                  "hover:bg-gray-50 cursor-pointer transition-colors",
                  selectedTasks.has(task.id) && "bg-blue-50 hover:bg-blue-100"
                )}
                onMouseEnter={() => setHoveredRow(task.id)}
                onMouseLeave={() => setHoveredRow(null)}
                onClick={() => onTaskClick(task.id)}
              >
                <td className="px-4 py-3">
                  <Checkbox
                    checked={selectedTasks.has(task.id)}
                    onCheckedChange={() => toggleTaskSelection(task.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </td>
                
                {/* Task name */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900 max-w-xs truncate">
                      {task.title}
                    </span>
                  </div>
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "h-7 px-2 text-xs font-medium",
                          statusConfig[task.status].color
                        )}
                      >
                        {statusConfig[task.status].icon}
                        <span className="ml-1.5">{statusConfig[task.status].label}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      {Object.entries(statusConfig).map(([status, config]) => (
                        <DropdownMenuItem
                          key={status}
                          onClick={() => onUpdateTask(task.id, { status: status as TaskStatus })}
                        >
                          <span className={config.color}>{config.icon}</span>
                          <span className="ml-2">{config.label}</span>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>

                {/* Multiple Assignees */}
                <td className="px-4 py-3">
                  {task.assignees && task.assignees.length > 0 ? (
                    <div className="flex items-center gap-1">
                      {task.assignees.slice(0, 3).map((assignee) => (
                        <Avatar key={assignee.id} className="h-6 w-6">
                          <AvatarImage src={assignee.avatar} />
                          <AvatarFallback className="text-xs">
                            {assignee.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {task.assignees.length > 3 && (
                        <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-xs text-gray-600">+{task.assignees.length - 3}</span>
                        </div>
                      )}
                    </div>
                  ) : task.assignee ? (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={task.assignee.avatar} />
                        <AvatarFallback>{task.assignee.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-gray-700">{task.assignee.name}</span>
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
                </td>

                {/* Project */}
                <td className="px-4 py-3">
                  {task.projectId ? (
                    (() => {
                      const project = projects.find(p => p.id === task.projectId);
                      return project ? (
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded" 
                            style={{ backgroundColor: project.color }}
                          />
                          <span className="text-sm text-gray-700">{project.name}</span>
                        </div>
                      ) : <span className="text-sm text-gray-400">—</span>;
                    })()
                  ) : (
                    <span className="text-sm text-gray-400">—</span>
                  )}
                </td>

                {/* Due date */}
                <td className="px-4 py-3">
                  {task.dueDate ? (
                    <span className="flex items-center gap-1 text-sm text-gray-600">
                      <Calendar className="h-3.5 w-3.5" />
                      {format(new Date(task.dueDate), 'MMM d, yyyy')}
                    </span>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs text-gray-400"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Calendar className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </td>

                {/* Priority */}
                <td className="px-4 py-3">
                  {task.priority && (
                    <div className={cn(
                      "inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium",
                      priorityConfig[task.priority].color,
                      priorityConfig[task.priority].bgColor
                    )}>
                      {priorityConfig[task.priority].icon}
                      {priorityConfig[task.priority].label}
                    </div>
                  )}
                </td>

                {/* Tags */}
                <td className="px-4 py-3">
                  {task.tags.length > 0 ? (
                    <div className="flex items-center gap-1">
                      <Tag className="h-3.5 w-3.5 text-gray-400" />
                      <span className="text-sm text-gray-600">{task.tags.length}</span>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Tag className="h-3.5 w-3.5 text-gray-400" />
                    </Button>
                  )}
                </td>

                {/* Progress */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 min-w-[100px]">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-600 rounded-full transition-all"
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-600 min-w-[35px]">{task.progress}%</span>
                  </div>
                </td>

                {/* Comments */}
                <td className="px-4 py-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MessageSquare className="h-3.5 w-3.5 text-gray-400" />
                  </Button>
                </td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "h-6 w-6 p-0 opacity-0 transition-opacity",
                          hoveredRow === task.id && "opacity-100"
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
                      <DropdownMenuItem className="text-red-600">Delete task</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClickUpTableView;
