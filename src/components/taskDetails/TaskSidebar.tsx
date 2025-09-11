
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Project, Task, TaskStatus, TaskPriority } from '@/types/task';
import TaskStatusSection from './TaskStatusSection';
import TaskPrioritySection from './TaskPrioritySection';
import TaskMetadataSection from './TaskMetadataSection';
import RelatedTasks from './RelatedTasks';
import { useIsMobile } from '@/hooks/use-mobile';

interface TaskSidebarProps {
  task: Task;
  project: Project | null;
  isEditing: boolean;
  editedTask: {
    status: TaskStatus;
    priority: TaskPriority;
  };
  handleStatusChange: (value: TaskStatus) => void;
  handlePriorityChange: (value: TaskPriority) => void;
}

const TaskSidebar = ({ task, project, isEditing, editedTask, handleStatusChange, handlePriorityChange }: TaskSidebarProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="lg:col-span-1">
      <Card>
        <CardContent className={`${isMobile ? 'p-4' : 'p-6'} space-y-5`}>
          <TaskStatusSection 
            status={isEditing ? editedTask.status : task.status} 
            handleStatusChange={handleStatusChange}
            isEditing={isEditing}
          />
          
          <TaskPrioritySection 
            priority={isEditing ? editedTask.priority : task.priority}
            handlePriorityChange={handlePriorityChange}
            isEditing={isEditing}
          />
          
          <TaskMetadataSection 
            task={task} 
            project={project}
            isEditing={isEditing}
          />
        </CardContent>
      </Card>
      
      {/* Related tasks section may be conditionally shown for mobile */}
      {(!isMobile || task.status !== TaskStatus.COMPLETED) && (
        <div className="mt-4 sm:mt-6">
          <Card>
            <CardContent className={`${isMobile ? 'p-4' : 'p-6'}`}>
              <h2 className={`${isMobile ? 'text-base' : 'text-lg'} font-medium mb-4`}>Related Tasks</h2>
              <RelatedTasks />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TaskSidebar;
