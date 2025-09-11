
import { Badge } from '@/components/ui/badge';
import { TaskStatus } from '@/types/task';

interface KanbanColumnHeaderProps {
  title: string;
  taskCount: number;
  status?: TaskStatus;
}

const KanbanColumnHeader = ({ title, taskCount, status }: KanbanColumnHeaderProps) => {
  return (
    <div className="p-4 border-b">
      <div className="flex justify-between items-center">
        <div className="font-medium">{title}</div>
        <Badge variant="outline" className={`
          ${status === TaskStatus.TODO ? 'bg-blue-50 text-blue-700 border-blue-200' : 
           status === TaskStatus.IN_PROGRESS ? 'bg-amber-50 text-amber-700 border-amber-200' : 
           status === TaskStatus.COMPLETED || status === TaskStatus.DONE ? 'bg-green-50 text-green-700 border-green-200' :
           status === TaskStatus.IN_REVIEW ? 'bg-purple-50 text-purple-700 border-purple-200' :
           status === TaskStatus.BACKLOG ? 'bg-gray-50 text-gray-700 border-gray-200' :
           status === TaskStatus.BLOCKED ? 'bg-red-50 text-red-700 border-red-200' :
           'bg-blue-50 text-blue-700 border-blue-200'}
        `}>
          {taskCount}
        </Badge>
      </div>
    </div>
  );
};

export default KanbanColumnHeader;
