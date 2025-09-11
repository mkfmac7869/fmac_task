
import { useState } from 'react';
import { format } from 'date-fns';
import { Eye, Calendar } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import TaskPriorityBadge from './TaskPriorityBadge';
import TaskTagsList from './TaskTagsList';
import TaskProgressBar from './TaskProgressBar';
import { Task } from '@/types/task';
import { useIsMobile } from '@/hooks/use-mobile';

interface TaskCardProps {
  task: Task;
  onTaskClick: (task: Task) => void;
  isAssignedToUser: boolean;
  onDragStart?: (e: React.DragEvent, taskId: string) => void;
}

const TaskCard = ({ task, onTaskClick, isAssignedToUser, onDragStart }: TaskCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useIsMobile();
  
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (!isMobile && onDragStart) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', task.id);
      onDragStart(e, task.id);
    }
  };
  
  return (
    <div 
      className={`border border-gray-200 rounded-xl p-3 sm:p-4 bg-white mb-2 sm:mb-3 shadow-sm hover:shadow-md transition-shadow ${isMobile ? 'active:bg-gray-50' : ''}`}
      draggable={!isMobile}
      onDragStart={handleDragStart}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        onTaskClick(task);
      }}
      data-task-id={task.id}
    >
      <div className="flex justify-between items-start mb-2 sm:mb-3">
        <div className="flex-1">
          <h3 className={`font-medium ${isMobile ? 'text-sm' : 'text-base'} line-clamp-2`}>{task.title}</h3>
        </div>
        <TaskPriorityBadge priority={task.priority} />
      </div>
      
      <p className={`text-gray-600 ${isMobile ? 'text-xs' : 'text-sm'} line-clamp-2 mb-2 sm:mb-3`}>{task.description}</p>
      
      <TaskTagsList tags={task.tags} />
      
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <div className="flex items-center">
          <Calendar className="h-3.5 w-3.5 text-gray-500 mr-1.5" />
          <span className="text-xs text-gray-600">{task.dueDate ? format(new Date(task.dueDate), 'MMM dd') : 'No due date'}</span>
        </div>
        
        {task.assignee && (
          <Avatar className="h-5 w-5 sm:h-6 sm:w-6">
            <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
            <AvatarFallback>{task.assignee.name.charAt(0)}</AvatarFallback>
          </Avatar>
        )}
      </div>
      
      <div className="flex justify-between items-center">
        <TaskProgressBar progress={task.progress} />
        
        {/* Always show View button on mobile */}
        <div className={`transition-opacity duration-200 ${isMobile || isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`${isMobile ? 'h-6 px-2' : 'h-7 px-2'} hover:bg-gray-100`}
            onClick={(e) => {
              e.stopPropagation();
              onTaskClick(task);
            }}
          >
            <Eye className={`${isMobile ? 'h-3 w-3' : 'h-3.5 w-3.5'} mr-1`} />
            <span className="text-xs">View</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
