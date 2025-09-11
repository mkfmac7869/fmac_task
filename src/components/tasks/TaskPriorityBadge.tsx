
import { Badge } from '@/components/ui/badge';
import { TaskPriority } from '@/types/task';

interface TaskPriorityBadgeProps {
  priority: TaskPriority;
}

const TaskPriorityBadge = ({ priority }: TaskPriorityBadgeProps) => {
  // Get priority color
  const getPriorityColor = () => {
    switch(priority) {
      case TaskPriority.HIGH:
        return 'bg-red-100 text-red-700 border-red-200';
      case TaskPriority.MEDIUM:
        return 'bg-amber-100 text-amber-700 border-amber-200';
      default:
        return 'bg-green-100 text-green-700 border-green-200';
    }
  };

  return (
    <Badge variant="outline" className={`text-xs ${getPriorityColor()}`}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </Badge>
  );
};

export default TaskPriorityBadge;
