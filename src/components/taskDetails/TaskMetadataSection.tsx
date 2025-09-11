
import React from 'react';
import { format, parseISO } from 'date-fns';
import { Calendar, Paperclip, Tag, UserPlus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Project, Task } from '@/types/task';
import { Separator } from '@/components/ui/separator';

interface TaskMetadataSectionProps {
  task: Task;
  project: Project | null;
  isEditing: boolean;
}

const TaskMetadataSection = ({ task, project, isEditing }: TaskMetadataSectionProps) => {
  return (
    <>
      <Separator />
      
      <div>
        <h3 className="text-sm font-medium mb-2">Assignee</h3>
        <div className="flex items-center">
          {task.assignee ? (
            <>
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src={task.assignee.avatar} />
                <AvatarFallback>{task.assignee.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span>{task.assignee.name}</span>
            </>
          ) : (
            <div className="flex items-center text-gray-500">
              <span>Unassigned</span>
            </div>
          )}
          
          {!isEditing && (
            <Button variant="ghost" size="icon" className="ml-auto">
              <UserPlus className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      {/* Task Assignment Information */}
      {task.creator && (
        <div>
          <h3 className="text-sm font-medium mb-2">Assigned By</h3>
          <div className="flex items-center">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src={task.creator.avatar} />
              <AvatarFallback>{task.creator.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span>{task.creator.name}</span>
          </div>
        </div>
      )}
      
      <div>
        <h3 className="text-sm font-medium mb-2">Due Date</h3>
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
          <span>{task.dueDate ? format(parseISO(task.dueDate), 'MMMM d, yyyy') : 'No due date'}</span>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Project</h3>
        {project && (
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 bg-${project.color}-500`}></div>
            <span>{project.name}</span>
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {task.tags && task.tags.length > 0 ? (
            task.tags.map((tag, idx) => (
              <Badge key={idx} variant="outline" className="bg-gray-100">
                {tag}
              </Badge>
            ))
          ) : (
            <span className="text-sm text-gray-500">No tags</span>
          )}
          
          {!isEditing && (
            <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
              <Tag className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Attachments</h3>
        <Button variant="outline" className="w-full text-left justify-start">
          <Paperclip className="h-4 w-4 mr-2" />
          Add Attachment
        </Button>
      </div>
    </>
  );
};

export default TaskMetadataSection;
