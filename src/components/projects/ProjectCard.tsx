
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MoreHorizontal } from 'lucide-react';
import { useTask } from '@/context/TaskContext';

interface ProjectCardProps {
  project: any;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const navigate = useNavigate();
  const { getTasksByProject } = useTask();
  const projectTasks = getTasksByProject(project.id);
  
  const completedTasks = projectTasks.filter(task => task.status === 'completed').length;
  const totalTasks = projectTasks.length;
  
  // Calculate average progress of all tasks
  const progress = totalTasks > 0 ? Math.round(
    projectTasks.reduce((sum, task) => sum + (task.progress || 0), 0) / totalTasks
  ) : 0;
  
  // Get different colors based on project.color
  const getBgColor = () => {
    switch (project.color) {
      case 'purple': return 'bg-purple-500 hover:bg-purple-600';
      case 'blue': return 'bg-blue-500 hover:bg-blue-600';
      case 'green': return 'bg-green-500 hover:bg-green-600';
      case 'orange': return 'bg-orange-400 hover:bg-orange-500';
      case 'pink': return 'bg-pink-500 hover:bg-pink-600';
      case 'teal': return 'bg-teal-500 hover:bg-teal-600';
      case 'red': return 'bg-fmac-red hover:bg-red-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const handleViewDetails = () => {
    // Navigate to project details page
    navigate(`/projects/${project.id}`);
  };
  
  return (
    <Card>
      <div className={`h-2 ${getBgColor().split(' ')[0]} rounded-t-lg`}></div>
      <CardHeader>
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">{project.name}</h3>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">{project.description}</p>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="progress-bar">
            <div
              className={`progress-bar-value ${getBgColor().split(' ')[0]}`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        
        <div className="flex justify-between text-sm text-gray-600">
          <span>{projectTasks.length} Tasks</span>
          <span>{completedTasks} Completed</span>
        </div>
      </CardContent>
      <CardFooter className="border-t p-4 flex justify-between">
        <div className="flex -space-x-2 avatar-group">
          {project.members && project.members.slice(0, 3).map((member: any) => (
            <Avatar key={member.id} className="border-2 border-white h-6 w-6">
              <AvatarImage src={member.avatar} alt={member.name} />
              <AvatarFallback>{member.name ? member.name.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
            </Avatar>
          ))}
          {project.members && project.members.length > 3 && (
            <Avatar className="border-2 border-white bg-gray-200 h-6 w-6">
              <AvatarFallback className="text-xs text-gray-600">
                +{project.members.length - 3}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={handleViewDetails}>View Details</Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
