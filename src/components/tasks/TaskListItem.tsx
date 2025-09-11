
import { Task } from '@/types/task';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import { format } from 'date-fns';

interface TaskListItemProps {
  task: Task;
  onClick: () => void;
}

const TaskListItem = ({ task, onClick }: TaskListItemProps) => {
  const isMobile = useIsMobile();
  
  return (
    <li 
      className={`hover:bg-gray-50 cursor-pointer ${isMobile ? 'p-3 border-b last:border-b-0' : 'p-4'}`}
      onClick={onClick}
    >
      <div className={`flex ${isMobile ? 'flex-col gap-2' : 'justify-between items-center'}`}>
        <div className={`${isMobile ? 'w-full' : ''}`}>
          <h3 className={`font-medium ${isMobile ? 'text-sm mb-0.5' : ''}`}>{task.title}</h3>
          <p className={`text-gray-500 ${isMobile ? 'text-xs line-clamp-1' : 'text-sm mt-1'}`}>{task.description}</p>
          {isMobile ? (
            <div className="flex justify-between items-center mt-2">
              <div className="flex gap-2">
                {task.tags && task.tags.slice(0, 2).map((tag: string, idx: number) => (
                  <Badge key={idx} variant="outline" className="text-xs bg-gray-50 px-1.5 py-0">
                    {tag}
                  </Badge>
                ))}
                {task.tags && task.tags.length > 2 && (
                  <span className="text-xs text-gray-400">+{task.tags.length - 2}</span>
                )}
              </div>
              <div className="text-xs text-gray-400">
                {format(new Date(task.dueDate), 'MMM dd')}
              </div>
            </div>
          ) : (
            <div className="flex gap-2 mt-2">
              {task.tags && task.tags.map((tag: string, idx: number) => (
                <Badge key={idx} variant="outline" className="text-xs bg-gray-50">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
        {!isMobile && (
          <div className="text-sm text-gray-500 flex flex-col items-end">
            <div className="mb-1">Due: {new Date(task.dueDate).toLocaleDateString()}</div>
            <div className="flex items-center">
              <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden mr-2">
                <div 
                  className="h-full bg-fmac-red rounded-full"
                  style={{ width: `${task.progress}%` }}
                ></div>
              </div>
              <span>{task.progress}%</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Only show progress on mobile */}
      {isMobile && (
        <div className="mt-2 flex items-center">
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mr-2">
            <div 
              className="h-full bg-fmac-red rounded-full"
              style={{ width: `${task.progress}%` }}
            ></div>
          </div>
          <span className="text-xs text-gray-500 min-w-8 text-right">{task.progress}%</span>
        </div>
      )}
    </li>
  );
};

export default TaskListItem;
