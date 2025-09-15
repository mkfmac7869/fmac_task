import React, { useState, useMemo } from 'react';
import Layout from '@/components/Layout';
import { useTask } from '@/context/TaskContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown,
  Filter, 
  Plus,
  Clock,
  Calendar as CalendarIcon,
  Circle,
  Flag
} from 'lucide-react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  parseISO,
  addMonths,
  subMonths
} from 'date-fns';
import { cn } from '@/lib/utils';
import { Task, TaskPriority, TaskStatus } from '@/types/task';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Calendar = () => {
  const navigate = useNavigate();
  const { tasks, projects } = useTask();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');

  // Get all days in the current month view
  const monthDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  // Group tasks by date
  const tasksByDate = useMemo(() => {
    const grouped: { [key: string]: Task[] } = {};
    tasks.forEach(task => {
      if (task.dueDate) {
        const dateKey = format(parseISO(task.dueDate), 'yyyy-MM-dd');
        if (!grouped[dateKey]) {
          grouped[dateKey] = [];
        }
        grouped[dateKey].push(task);
      }
    });
    return grouped;
  }, [tasks]);

  // Priority colors with gradients
  const priorityConfig = {
    [TaskPriority.URGENT]: { 
      bg: 'bg-gradient-to-r from-red-500 to-rose-500',
      text: 'text-white',
      dot: 'bg-red-500'
    },
    [TaskPriority.HIGH]: { 
      bg: 'bg-gradient-to-r from-amber-400 to-yellow-400',
      text: 'text-amber-900',
      dot: 'bg-amber-500'
    },
    [TaskPriority.MEDIUM]: { 
      bg: 'bg-gradient-to-r from-blue-400 to-indigo-400',
      text: 'text-white',
      dot: 'bg-blue-500'
    },
    [TaskPriority.LOW]: { 
      bg: 'bg-gradient-to-r from-gray-300 to-slate-300',
      text: 'text-gray-700',
      dot: 'bg-gray-400'
    }
  };

  // Status colors
  const statusConfig = {
    [TaskStatus.TODO]: { icon: <Circle className="h-3 w-3" />, color: 'text-gray-500' },
    [TaskStatus.IN_PROGRESS]: { icon: <Clock className="h-3 w-3" />, color: 'text-blue-500' },
    [TaskStatus.IN_REVIEW]: { icon: <Flag className="h-3 w-3" />, color: 'text-amber-500' },
    [TaskStatus.COMPLETED]: { icon: <Circle className="h-3 w-3 fill-current" />, color: 'text-emerald-500' }
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleToday = () => {
    setCurrentMonth(new Date());
    setSelectedDate(new Date());
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleTaskClick = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/tasks/${taskId}`);
  };

  // Get tasks for selected date
  const selectedDateTasks = selectedDate 
    ? tasksByDate[format(selectedDate, 'yyyy-MM-dd')] || []
    : [];

  return (
    <Layout>
      <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-50">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b bg-white/80 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              {format(currentMonth, 'MMMM yyyy')}
            </h1>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePreviousMonth}
                className="h-8 w-8 hover:bg-gray-100"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleToday}
                className="h-8 px-3 hover:bg-gray-100"
              >
                Today
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNextMonth}
                className="h-8 w-8 hover:bg-gray-100"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                  Month <ChevronDown className="ml-2 h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setViewMode('month')}>Month</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setViewMode('week')}>Week</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setViewMode('day')}>Day</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button variant="outline" size="icon" className="h-8 w-8">
              <Filter className="h-4 w-4" />
            </Button>
            
            <Button 
              className="h-8 bg-red-600 hover:bg-red-700"
              onClick={() => navigate('/tasks')}
            >
              <Plus className="h-4 w-4 mr-1" />
              New Task
            </Button>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
            {/* Calendar Grid */}
            <div className="lg:col-span-3">
              <Card className="h-full p-4 shadow-lg bg-white/90 backdrop-blur-sm">
                {/* Day headers */}
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
                    <div key={day} className="text-center py-2">
                      <span className="text-xs font-semibold text-gray-600">{day}</span>
                    </div>
                  ))}
                </div>

                {/* Calendar days */}
                <div className="grid grid-cols-7 gap-2 flex-1">
                  {monthDays.map((day) => {
                    const dateKey = format(day, 'yyyy-MM-dd');
                    const dayTasks = tasksByDate[dateKey] || [];
                    const isCurrentMonth = isSameMonth(day, currentMonth);
                    const isSelected = selectedDate && isSameDay(day, selectedDate);
                    const isCurrentDay = isToday(day);

                    return (
                      <div
                        key={day.toString()}
                        onClick={() => handleDateClick(day)}
                        className={cn(
                          "min-h-[100px] p-2 rounded-lg border transition-all duration-200 cursor-pointer",
                          "hover:shadow-md hover:border-gray-300",
                          isCurrentMonth ? "bg-white" : "bg-gray-50/50",
                          isSelected && "ring-2 ring-red-500 border-red-500",
                          isCurrentDay && "bg-gradient-to-br from-red-50 to-rose-50"
                        )}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className={cn(
                            "text-sm font-medium",
                            isCurrentMonth ? "text-gray-900" : "text-gray-400",
                            isCurrentDay && "text-red-600 font-bold"
                          )}>
                            {format(day, 'd')}
                          </span>
                          {dayTasks.length > 0 && (
                            <Badge 
                              variant="secondary" 
                              className="h-5 px-1.5 text-xs bg-gray-100 text-gray-600"
                            >
                              {dayTasks.length}
                            </Badge>
                          )}
                        </div>

                        {/* Task previews */}
                        <div className="space-y-1 overflow-hidden">
                          {dayTasks.slice(0, 3).map((task) => {
                            const priority = priorityConfig[task.priority];
                            const project = projects.find(p => p.id === task.projectId);
                            
                            return (
                              <div
                                key={task.id}
                                onClick={(e) => handleTaskClick(task.id, e)}
                                className={cn(
                                  "text-xs p-1.5 rounded cursor-pointer transition-all duration-200",
                                  "hover:scale-105 hover:shadow-sm",
                                  priority.bg,
                                  priority.text
                                )}
                              >
                                <div className="flex items-center gap-1">
                                  {statusConfig[task.status].icon}
                                  <span className="truncate font-medium">{task.title}</span>
                                </div>
                                {project && (
                                  <div className="flex items-center gap-1 mt-0.5 opacity-80">
                                    <div 
                                      className="w-2 h-2 rounded-full" 
                                      style={{ backgroundColor: project.color }}
                                    />
                                    <span className="text-[10px] truncate">{project.name}</span>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                          {dayTasks.length > 3 && (
                            <div className="text-[10px] text-gray-500 text-center">
                              +{dayTasks.length - 3} more
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>

            {/* Selected Day Details */}
            <div className="lg:col-span-1">
              <Card className="h-full p-4 shadow-lg bg-white/90 backdrop-blur-sm overflow-hidden">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg">
                      {selectedDate ? format(selectedDate, 'EEEE, MMMM d') : 'Select a date'}
                    </h3>
                    {selectedDate && isToday(selectedDate) && (
                      <Badge className="bg-red-100 text-red-700">Today</Badge>
                    )}
                  </div>

                  <div className="flex-1 overflow-y-auto">
                    {selectedDateTasks.length > 0 ? (
                      <div className="space-y-3">
                        {selectedDateTasks.map((task) => {
                          const priority = priorityConfig[task.priority];
                          const status = statusConfig[task.status];
                          const project = projects.find(p => p.id === task.projectId);
                          
                          return (
                            <div
                              key={task.id}
                              onClick={() => navigate(`/tasks/${task.id}`)}
                              className="p-3 rounded-lg border bg-white hover:shadow-md transition-all duration-200 cursor-pointer"
                            >
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-medium text-sm flex-1">{task.title}</h4>
                                <div className={cn("p-1", status.color)}>
                                  {status.icon}
                                </div>
                              </div>
                              
                              {task.description && (
                                <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                                  {task.description}
                                </p>
                              )}

                              <div className="flex items-center justify-between">
                                <div className={cn(
                                  "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
                                  priority.bg,
                                  priority.text
                                )}>
                                  <div className={cn("w-1.5 h-1.5 rounded-full", priority.dot)} />
                                  {task.priority}
                                </div>

                                {task.assignee && (
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage src={task.assignee.avatar} />
                                    <AvatarFallback className="text-xs">
                                      {task.assignee.name[0]}
                                    </AvatarFallback>
                                  </Avatar>
                                )}
                              </div>

                              {project && (
                                <div className="flex items-center gap-1 mt-2">
                                  <div 
                                    className="w-3 h-3 rounded" 
                                    style={{ backgroundColor: project.color }}
                                  />
                                  <span className="text-xs text-gray-600">{project.name}</span>
                                </div>
                              )}

                              <div className="mt-2">
                                <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-red-500 to-red-600 transition-all duration-300"
                                    style={{ width: `${task.progress}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        <CalendarIcon className="h-12 w-12 text-gray-300 mb-3" />
                        <p className="text-gray-500 text-sm">No tasks scheduled</p>
                        {selectedDate && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-3"
                            onClick={() => navigate('/tasks')}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add Task
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Calendar;