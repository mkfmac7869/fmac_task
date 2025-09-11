
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TaskPriority } from '@/types/task';

interface TaskPrioritySectionProps {
  isEditing: boolean;
  priority: TaskPriority;
  handlePriorityChange: (value: TaskPriority) => void;
}

const TaskPrioritySection = ({ isEditing, priority, handlePriorityChange }: TaskPrioritySectionProps) => {
  const getPriorityColor = () => {
    switch(priority) {
      case TaskPriority.HIGH:
        return 'bg-red-100 text-red-800';
      case TaskPriority.MEDIUM:
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div>
      <h3 className="text-sm font-medium mb-2">Priority</h3>
      {isEditing ? (
        <Select value={priority} onValueChange={handlePriorityChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={TaskPriority.LOW}>Low</SelectItem>
            <SelectItem value={TaskPriority.MEDIUM}>Medium</SelectItem>
            <SelectItem value={TaskPriority.HIGH}>High</SelectItem>
          </SelectContent>
        </Select>
      ) : (
        <Badge className={getPriorityColor()}>
          {priority.charAt(0).toUpperCase() + priority.slice(1)}
        </Badge>
      )}
    </div>
  );
};

export default TaskPrioritySection;
