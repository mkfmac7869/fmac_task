
import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ListChecks, Users } from 'lucide-react';
import { Project } from '@/types/task';

interface ProjectStatsProps {
  project: Project;
  tasks: any[];
  colorClass: string;
}

const ProjectStats: React.FC<ProjectStatsProps> = ({ project, tasks, colorClass }) => {
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const totalTasks = tasks.length;
  
  // Calculate average progress of all tasks
  const progress = totalTasks > 0 ? Math.round(
    tasks.reduce((sum, task) => sum + (task.progress || 0), 0) / totalTasks
  ) : 0;
  
  return (
    <Card>
      <div className={`h-2 ${colorClass} rounded-t-lg`}></div>
      <CardHeader>
        <h2 className="text-xl font-semibold">Stats</h2>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Progress */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`${colorClass} h-2 rounded-full`}
                style={{ width: `${progress}%` }} 
              ></div>
            </div>
          </div>
          
          {/* Tasks */}
          <div className="flex items-center gap-3">
            <ListChecks className="h-5 w-5 text-gray-500" />
            <div>
              <span className="font-medium">{totalTasks} Tasks</span>
              <span className="text-gray-500 text-sm"> ({completedTasks} completed)</span>
            </div>
          </div>
          
          {/* Team Members */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Users className="h-5 w-5 text-gray-500" />
              <span className="font-medium">Team Members</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-1">
              {project.members.slice(0, 3).map(member => (
                <div key={member.id} className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{member.name}</span>
                </div>
              ))}
              {project.members.length > 3 && (
                <Avatar className="border-2 border-white bg-gray-200 h-6 w-6">
                  <AvatarFallback className="text-xs text-gray-600">
                    +{project.members.length - 3}
                  </AvatarFallback>
                </Avatar>
              )}
              {project.members.length === 0 && (
                <span className="text-gray-500 text-sm">No team members</span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectStats;
