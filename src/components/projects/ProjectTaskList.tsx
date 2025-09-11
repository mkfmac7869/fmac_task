
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar } from 'lucide-react';
import { Task, TaskStatus } from '@/types/task';
import { useIsMobile } from '@/hooks/use-mobile';

interface ProjectTaskListProps {
  tasks: Task[];
}

const ProjectTaskList: React.FC<ProjectTaskListProps> = ({ tasks }) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  if (tasks.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 sm:p-8 text-center">
          <p className="text-gray-500 mb-4">No tasks found for this project</p>
          <Button onClick={() => navigate('/tasks')}>
            Create Task
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className={`grid grid-cols-1 ${isMobile ? '' : 'md:grid-cols-2 lg:grid-cols-3'} gap-3 sm:gap-4`}>
      {tasks.map(task => (
        <Card 
          key={task.id} 
          className={`hover:shadow-md transition-shadow cursor-pointer ${isMobile ? 'border-gray-200' : ''}`}
          onClick={() => navigate(`/tasks/${task.id}`)}
        >
          <CardContent className={`${isMobile ? 'p-3' : 'p-4'}`}>
            <div className="flex justify-between items-center mb-2">
              <span className={`px-2 py-1 rounded text-xs ${
                task.status === TaskStatus.COMPLETED ? 'bg-green-100 text-green-800' : 
                task.status === TaskStatus.IN_PROGRESS ? 'bg-orange-100 text-orange-800' : 
                'bg-gray-100 text-gray-800'
              }`}>
                {task.status === TaskStatus.IN_PROGRESS ? 'In Progress' : 
                 task.status.charAt(0).toUpperCase() + task.status.slice(1).replace('_', ' ')}
              </span>
              <span className={`px-2 py-1 rounded text-xs ${
                task.priority === 'high' ? 'bg-red-100 text-red-800' : 
                task.priority === 'medium' ? 'bg-blue-100 text-blue-800' : 
                'bg-gray-100 text-gray-800'
              }`}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </span>
            </div>
            <h3 className={`font-medium mb-1 ${isMobile ? 'text-sm' : ''}`}>{task.title}</h3>
            <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600 mb-3 line-clamp-2`}>{task.description}</p>
            <div className="flex justify-between items-center">
              {task.assignee ? (
                <div className="flex items-center gap-2">
                  <Avatar className={`${isMobile ? 'h-5 w-5' : 'h-6 w-6'}`}>
                    <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                    <AvatarFallback>{task.assignee.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600`}>{task.assignee.name}</span>
                </div>
              ) : (
                <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>Unassigned</span>
              )}
              <div className={`flex items-center gap-1 ${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>
                <Calendar className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                {format(new Date(task.dueDate), 'MMM dd')}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProjectTaskList;
