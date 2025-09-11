
import { format } from 'date-fns';
import { MoreVertical } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Task } from '@/types/task';

interface TaskItemProps {
  task: Task;
}

const DashboardTaskItem = ({ task }: TaskItemProps) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-lg font-medium">{task.title}</div>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>
      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{task.description}</p>
      
      {task.tags && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.map((tag: string, idx: number) => (
            <div 
              key={idx} 
              className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700"
            >
              {tag}
            </div>
          ))}
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {task.assignee ? (
            <Avatar className="h-6 w-6">
              <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
              <AvatarFallback>{task.assignee.name.charAt(0)}</AvatarFallback>
            </Avatar>
          ) : (
            <Avatar className="h-6 w-6">
              <AvatarFallback>?</AvatarFallback>
            </Avatar>
          )}
          <div className="text-xs text-gray-600">{task.dueDate && format(new Date(task.dueDate), 'dd MMM yyyy')}</div>
        </div>
        
        <div className="flex flex-col items-end">
          <div className="text-xs text-gray-600 mb-1">{task.progress}%</div>
          <div className="progress-bar w-16">
            <div
              className="progress-bar-value bg-fmac-red"
              style={{ width: `${task.progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTaskItem;
