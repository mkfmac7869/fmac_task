
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useTask } from '@/context/TaskContext';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { CalendarIcon, ChevronDown, ChevronLeft, ChevronRight, Filter, Grid, List } from 'lucide-react';
import { format, isToday, isSameDay, parseISO } from 'date-fns';

const Calendar = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const { tasks } = useTask();

  // Get tasks for the selected date
  const tasksForSelectedDate = tasks.filter((task) => {
    const taskDate = parseISO(task.dueDate);
    return date ? isSameDay(taskDate, date) : false;
  });

  // Find days with tasks for custom styling
  const daysWithTasks = tasks.reduce<Date[]>((dates, task) => {
    const taskDate = parseISO(task.dueDate);
    if (!dates.some(date => isSameDay(date, taskDate))) {
      dates.push(taskDate);
    }
    return dates;
  }, []);

  // Navigate to task details
  const viewTaskDetails = (taskId: string) => {
    navigate(`/tasks/${taskId}`);
  };

  return (
    <Layout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Calendar</h1>
            <p className="text-gray-600">Manage your schedule and task deadlines</p>
          </div>
          <div className="flex items-center gap-3">
            <Tabs defaultValue="month" className="w-auto">
              <TabsList>
                <TabsTrigger value="month" onClick={() => setView('month')}>Month</TabsTrigger>
                <TabsTrigger value="week" onClick={() => setView('week')}>Week</TabsTrigger>
                <TabsTrigger value="day" onClick={() => setView('day')}>Day</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex items-center gap-1 border rounded-md">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Grid className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <List className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Calendar Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar - Now takes full width on mobile and 2/3 on desktop */}
          <Card className="p-4 lg:col-span-2 max-h-[800px] overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => setDate(new Date())}>
                  <CalendarIcon className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="flex items-center gap-1">
                  {date ? format(date, 'MMMM yyyy') : 'Select a date'}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => {}}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" onClick={() => setDate(new Date())}>
                  Today
                </Button>
                <Button variant="outline" size="icon" onClick={() => {}}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="h-[600px] w-full flex items-start justify-center overflow-hidden">
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border w-full max-w-full"
                classNames={{
                  day_selected: "bg-fmac-red text-white hover:bg-fmac-red hover:text-white focus:bg-fmac-red focus:text-white",
                  day_today: "bg-gray-100 text-gray-900 font-bold",
                }}
                modifiers={{
                  hasTasks: daysWithTasks
                }}
                modifiersClassNames={{
                  hasTasks: "before:absolute before:bottom-0 before:left-1/2 before:-translate-x-1/2 before:w-1 before:h-1 before:bg-fmac-red before:rounded-full"
                }}
              />
            </div>
          </Card>

          {/* Events for selected day */}
          <Card className="p-4 h-[calc(100vh-180px)] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">
                {date ? format(date, 'MMMM d, yyyy') : 'Select a date'}
              </h3>
              {isToday(date || new Date()) && (
                <Badge variant="outline" className="bg-fmac-red text-white border-fmac-red">
                  Today
                </Badge>
              )}
            </div>
            
            {tasksForSelectedDate.length > 0 ? (
              <div className="space-y-3">
                {tasksForSelectedDate.map((task) => (
                  <div 
                    key={task.id} 
                    className="border rounded-lg p-3 bg-white hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => viewTaskDetails(task.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{task.title}</h4>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                          {task.description}
                        </p>
                      </div>
                      
                      {task.priority === 'high' && (
                        <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200">
                          High
                        </Badge>
                      )}
                      {task.priority === 'medium' && (
                        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200">
                          Medium
                        </Badge>
                      )}
                      {task.priority === 'low' && (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">
                          Low
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center mt-2">
                      {task.assignee ? (
                        <div className="flex items-center">
                          <Avatar className="h-5 w-5 mr-2">
                            <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                            <AvatarFallback>{task.assignee.name[0]}</AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-gray-600">{task.assignee.name}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-500">Unassigned</span>
                      )}
                      
                      <div className="flex items-center">
                        <div className="w-16 h-1 bg-gray-200 rounded-full mr-2">
                          <div
                            className="h-full rounded-full bg-fmac-red"
                            style={{ width: `${task.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600">{task.progress}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CalendarIcon className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                <h3 className="font-medium text-gray-900">No tasks for this day</h3>
                <p className="text-gray-600 text-sm mt-1">
                  Select a different day or add a new task
                </p>
                <Button className="mt-4 bg-fmac-red hover:bg-fmac-red/90" onClick={() => navigate('/tasks')}>
                  Add Task
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Calendar;
