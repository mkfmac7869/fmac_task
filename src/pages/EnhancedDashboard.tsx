import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/context/AuthContext';
import { useTask } from '@/context/TaskContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { 
  Activity, ArrowUpRight, ArrowDownRight, Calendar, Clock, Users, 
  TrendingUp, AlertCircle, CheckCircle2, MoreVertical, Plus,
  Target, Zap, Award, Briefcase
} from 'lucide-react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, subDays } from 'date-fns';
import { FirebaseService } from '@/lib/firebaseService';
import { TaskStatus, TaskPriority } from '@/types/task';
import { cn } from '@/lib/utils';
import { WorkingHoursTracker } from '@/components/dashboard/WorkingHoursTracker';
import { AnimatedNumber } from '@/components/dashboard/AnimatedNumber';
import { useNavigate } from 'react-router-dom';

interface Activity {
  id: string;
  type: string;
  description: string;
  timestamp: Date;
  userName: string;
  userAvatar: string;
}

const EnhancedDashboard = () => {
  const { user } = useAuth();
  const { tasks, projects } = useTask();
  const navigate = useNavigate();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  // Real-time data calculations
  const completedTasks = tasks.filter(t => t.status === TaskStatus.COMPLETED);
  const inProgressTasks = tasks.filter(t => t.status === TaskStatus.IN_PROGRESS);
  const todoTasks = tasks.filter(t => t.status === TaskStatus.TODO);
  const inReviewTasks = tasks.filter(t => t.status === TaskStatus.IN_REVIEW);
  
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;
  
  // Calculate productivity score
  const productivityScore = Math.min(100, Math.round(
    (completedTasks.length * 10 + inProgressTasks.length * 5 + inReviewTasks.length * 7) / 
    Math.max(1, totalTasks) * 10
  ));

  // Priority distribution
  const priorityData = [
    { name: 'Urgent', value: tasks.filter(t => t.priority === TaskPriority.URGENT).length, color: '#dc2626' },
    { name: 'High', value: tasks.filter(t => t.priority === TaskPriority.HIGH).length, color: '#f59e0b' },
    { name: 'Medium', value: tasks.filter(t => t.priority === TaskPriority.MEDIUM).length, color: '#3b82f6' },
    { name: 'Low', value: tasks.filter(t => t.priority === TaskPriority.LOW).length, color: '#6b7280' }
  ];

  // Weekly task completion data
  const weekStart = startOfWeek(new Date());
  const weekEnd = endOfWeek(new Date());
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
  
  const weeklyData = weekDays.map(day => {
    const dayTasks = tasks.filter(task => {
      const taskDate = new Date(task.createdAt);
      return format(taskDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
    });
    
    return {
      day: format(day, 'EEE'),
      completed: dayTasks.filter(t => t.status === TaskStatus.COMPLETED).length,
      created: dayTasks.length,
      inProgress: dayTasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length
    };
  });

  // Project progress data
  const projectProgress = projects.map(project => {
    const projectTasks = tasks.filter(t => t.projectId === project.id);
    const completed = projectTasks.filter(t => t.status === TaskStatus.COMPLETED).length;
    const total = projectTasks.length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return {
      name: project.name,
      progress,
      completed,
      total,
      color: project.color
    };
  });

  // Team performance (mock data for now)
  const teamPerformance = [
    { name: 'This Week', tasks: 24, hours: 156 },
    { name: 'Last Week', tasks: 18, hours: 142 },
    { name: '2 Weeks Ago', tasks: 22, hours: 168 },
    { name: '3 Weeks Ago', tasks: 20, hours: 160 }
  ];

  // Load activities
  useEffect(() => {
    const loadActivities = async () => {
      try {
        const activitiesData = await FirebaseService.getDocumentsOrdered(
          'activities',
          'timestamp',
          'desc',
          [],
          10
        );
        
        setActivities(activitiesData.map((a: any) => ({
          ...a,
          timestamp: a.timestamp?.toDate() || new Date()
        })));
      } catch (error) {
        console.error('Error loading activities:', error);
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, []);

  return (
    <Layout>
      <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Welcome back, {user?.name.split(' ')[0]}! 👋
              </h1>
              <p className="text-gray-600 mt-2">{format(new Date(), 'EEEE, MMMM dd, yyyy')}</p>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={() => navigate('/tasks')}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Task
              </Button>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-violet-600 to-purple-700 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                  <Target className="h-6 w-6" />
                </div>
                <Badge className="bg-white/20 text-white border-0">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  12%
                </Badge>
              </div>
              <h3 className="text-3xl font-bold mb-1">
                <AnimatedNumber value={totalTasks} />
              </h3>
              <p className="text-white/80">Total Tasks</p>
              <Progress value={completionRate} className="mt-3 bg-white/20" />
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-amber-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                  <Clock className="h-6 w-6" />
                </div>
                <Badge className="bg-white/20 text-white border-0">Active</Badge>
              </div>
              <h3 className="text-3xl font-bold mb-1">
                <AnimatedNumber value={inProgressTasks.length} />
              </h3>
              <p className="text-white/80">In Progress</p>
              <div className="mt-3 flex gap-1">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                    <div className={cn("h-full bg-white", i <= 3 ? "w-full" : "w-0")} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-emerald-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <Badge className="bg-white/20 text-white border-0">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  8%
                </Badge>
              </div>
              <h3 className="text-3xl font-bold mb-1">
                <AnimatedNumber value={completedTasks.length} />
              </h3>
              <p className="text-white/80">Completed</p>
              <p className="text-sm text-white/60 mt-2">{completionRate}% completion rate</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                  <Zap className="h-6 w-6" />
                </div>
                <Badge className="bg-white/20 text-white border-0">Score</Badge>
              </div>
              <h3 className="text-3xl font-bold mb-1">
                <AnimatedNumber value={productivityScore} suffix="%" />
              </h3>
              <p className="text-white/80">Productivity</p>
              <div className="mt-3 flex items-center gap-2">
                <Award className="h-4 w-4 text-yellow-300" />
                <span className="text-sm text-white/60">Great performance!</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Task Completion Trend */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Weekly Task Activity</span>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorInProgress" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip />
                  <Area type="monotone" dataKey="completed" stroke="#10b981" fillOpacity={1} fill="url(#colorCompleted)" />
                  <Area type="monotone" dataKey="inProgress" stroke="#f59e0b" fillOpacity={1} fill="url(#colorInProgress)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Priority Distribution */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Task Priority Distribution</span>
                <Badge variant="outline">{totalTasks} tasks</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={priorityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Working Hours and Team Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Working Hours Tracker */}
          <WorkingHoursTracker />

          {/* Team Performance */}
          <Card className="border-0 shadow-lg lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Team Performance Overview</span>
                <Tabs defaultValue="week" className="w-auto">
                  <TabsList className="h-8">
                    <TabsTrigger value="week" className="text-xs">Week</TabsTrigger>
                    <TabsTrigger value="month" className="text-xs">Month</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={teamPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip />
                  <Bar dataKey="tasks" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="hours" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Projects and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Project Progress */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Project Progress</span>
                  <Button variant="ghost" size="sm">View All</Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projectProgress.slice(0, 5).map((project, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: project.color }}
                          />
                          <span className="font-medium">{project.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">
                            {project.completed}/{project.total} tasks
                          </span>
                          <Badge variant="outline">{project.progress}%</Badge>
                        </div>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.slice(0, 6).map((activity) => (
                  <div key={activity.id} className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={activity.userAvatar} />
                      <AvatarFallback>{activity.userName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm">
                        <span className="font-medium">{activity.userName}</span>
                        <span className="text-gray-600 ml-1">{activity.description}</span>
                      </p>
                      <p className="text-xs text-gray-500">
                        {format(activity.timestamp, 'MMM d, h:mm a')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default EnhancedDashboard;
