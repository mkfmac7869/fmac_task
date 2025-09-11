import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useTask } from '@/context/TaskContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { format, parseISO, isThisWeek, isThisMonth, subDays } from 'date-fns';
import { useAuth } from '@/context/AuthContext';
import { Download, Calendar, Users, BarChart2, PieChart as PieChartIcon } from 'lucide-react';
import { TaskStatus } from '@/types/task';

// Colors for charts
const COLORS = ['#ea384c', '#f97316', '#16a34a', '#3b82f6', '#8b5cf6'];

const Reports = () => {
  const { tasks, projects, isLoading } = useTask();
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('all');
  const [selectedProject, setSelectedProject] = useState('all');
  
  console.log('Reports page - tasks:', tasks);
  console.log('Reports page - projects:', projects);
  console.log('Reports page - isLoading:', isLoading);
  console.log('Reports page - user:', user);
  
  // Filter tasks based on time range
  const filteredTasks = tasks.filter(task => {
    const taskDate = parseISO(task.dueDate);
    
    if (timeRange === 'week') {
      return isThisWeek(taskDate);
    }
    if (timeRange === 'month') {
      return isThisMonth(taskDate);
    }
    if (timeRange === '30days') {
      return taskDate >= subDays(new Date(), 30);
    }
    return true; // 'all' time range
  }).filter(task => {
    // Filter by project if needed
    if (selectedProject !== 'all') {
      return task.projectId === selectedProject;
    }
    return true;
  });
  
  // Calculate statistics
  const totalTasks = filteredTasks.length;
  const completedTasks = filteredTasks.filter(task => task.status === TaskStatus.COMPLETED).length;
  const inProgressTasks = filteredTasks.filter(task => task.status === TaskStatus.IN_PROGRESS).length;
  const todoTasks = filteredTasks.filter(task => task.status === TaskStatus.TODO).length;
  
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // Data for task status chart
  const statusData = [
    { name: 'Completed', value: completedTasks },
    { name: 'In Progress', value: inProgressTasks },
    { name: 'To Do', value: todoTasks },
  ];
  
  // Data for priority chart
  const priorityData = [
    { name: 'High', value: filteredTasks.filter(task => task.priority === 'high').length },
    { name: 'Medium', value: filteredTasks.filter(task => task.priority === 'medium').length },
    { name: 'Low', value: filteredTasks.filter(task => task.priority === 'low').length },
  ];
  
  // Generate data for task completion over time (simplified for demo)
  const generateTaskProgressData = () => {
    const projectData = projects.map(project => {
      const projectTasks = filteredTasks.filter(task => task.projectId === project.id);
      const totalProjectTasks = projectTasks.length;
      const completedProjectTasks = projectTasks.filter(task => task.status === TaskStatus.COMPLETED).length;
      const completionRate = totalProjectTasks > 0 ? (completedProjectTasks / totalProjectTasks) * 100 : 0;
      
      return {
        name: project.name,
        'Completion Rate': Math.round(completionRate),
      };
    });
    
    return projectData;
  };
  
  const taskProgressData = generateTaskProgressData();
  
  // Generate team performance data
  const generateTeamPerformanceData = () => {
    // Get unique team members from assignees
    const uniqueMembers = Array.from(new Set(filteredTasks
      .filter(task => task.assignee)
      .map(task => task.assignee?.id)))
      .map(id => {
        const tasksByMember = filteredTasks.filter(task => task.assignee && task.assignee.id === id);
        const member = tasksByMember[0].assignee;
        const completed = tasksByMember.filter(task => task.status === TaskStatus.COMPLETED).length;
        const total = tasksByMember.length;
        
        return {
          id: member?.id || '',
          name: member?.name || '',
          avatar: member?.avatar || '',
          completed,
          inProgress: tasksByMember.filter(task => task.status === TaskStatus.IN_PROGRESS).length,
          todo: tasksByMember.filter(task => task.status === TaskStatus.TODO).length,
          totalTasks: total,
          completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
        };
      });
      
    return uniqueMembers;
  };
  
  const teamData = generateTeamPerformanceData();
  
  const handleExportReport = () => {
    // In a real app, this would generate and download a PDF or Excel file
    alert('Report export functionality would be implemented here.');
  };
  
  if (isLoading) {
    return (
      <Layout>
        <div className="p-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg">Loading reports...</div>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Reports & Analytics</h1>
            <p className="text-gray-600">View detailed insights about tasks and projects</p>
          </div>
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedProject} onValueChange={setSelectedProject}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {projects.map(project => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button variant="outline" onClick={handleExportReport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalTasks}</div>
              <p className="text-sm text-gray-600 mt-1">
                {completedTasks} completed, {inProgressTasks} in progress
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{completionRate}%</div>
              <Progress value={completionRate} className="mt-2" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Deadlines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {filteredTasks.filter(task => 
                  task.status !== TaskStatus.COMPLETED && 
                  parseISO(task.dueDate) >= new Date()
                ).length}
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Tasks due soon
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {projects.length}
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Across {teamData.length} team members
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Charts and Data */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart2 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Team Performance
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Task Status Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Task Status Distribution</CardTitle>
                  <CardDescription>Breakdown of tasks by current status</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-80 p-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              {/* Task Priority Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Task Priority Distribution</CardTitle>
                  <CardDescription>Breakdown of tasks by priority level</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-80 p-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={priorityData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#ea384c" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="projects" className="space-y-6">
            {/* Project Completion Rates */}
            <Card>
              <CardHeader>
                <CardTitle>Project Completion Rates</CardTitle>
                <CardDescription>Percentage of completed tasks per project</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-80 p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={taskProgressData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Completion Rate" fill="#ea384c" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Projects List with Stats */}
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Project Details</h3>
              {projects.map(project => {
                const projectTasks = filteredTasks.filter(task => task.projectId === project.id);
                const totalProjectTasks = projectTasks.length;
                const completedProjectTasks = projectTasks.filter(task => task.status === TaskStatus.COMPLETED).length;
                
                // Calculate average progress of all tasks
                const completionRate = totalProjectTasks > 0 ? Math.round(
                  projectTasks.reduce((sum, task) => sum + (task.progress || 0), 0) / totalProjectTasks
                ) : 0;
                
                return (
                  <Card key={project.id}>
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row justify-between">
                        <div>
                          <h4 className="font-semibold text-lg">{project.name}</h4>
                          <p className="text-sm text-gray-600">{project.description}</p>
                        </div>
                        <div className="flex items-center gap-3 mt-4 md:mt-0">
                          <div className="text-sm">
                            <span className="font-medium">{completedProjectTasks}/{totalProjectTasks}</span> tasks completed
                          </div>
                          <Badge variant="outline" className={`${project.color === 'purple' ? 'bg-purple-100 text-purple-800' : project.color === 'blue' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}`}>
                            {project.color}
                          </Badge>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="flex justify-between items-center text-sm mb-1">
                          <span>Progress</span>
                          <span>{Math.round(completionRate)}%</span>
                        </div>
                        <Progress value={completionRate} />
                      </div>
                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        {project.members && project.members.map(member => (
                          <Avatar key={member.id} className="h-8 w-8">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback>{member.name ? member.name.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
          
          <TabsContent value="team" className="space-y-6">
            {/* Team Performance Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Team Performance Overview</CardTitle>
                <CardDescription>Task completion rates by team member</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {teamData.length > 0 ? (
                    teamData.map(member => (
                      <div key={member.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Avatar className="h-10 w-10 mr-3">
                              <AvatarImage src={member.avatar} />
                              <AvatarFallback>{member.name ? member.name.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-medium">{member.name || 'Unknown User'}</h4>
                              <div className="text-sm text-gray-600">
                                {member.completed} completed, {member.inProgress} in progress, {member.todo} to do
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{member.completionRate}%</div>
                            <div className="text-sm text-gray-600">{member.totalTasks} total tasks</div>
                          </div>
                        </div>
                        <Progress value={member.completionRate} />
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-600 py-8">No team data available for the selected time period.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Reports;
