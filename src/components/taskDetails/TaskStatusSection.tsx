
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TaskStatus } from '@/types/task';

interface TaskStatusSectionProps {
  isEditing: boolean;
  status: TaskStatus;
  handleStatusChange: (value: TaskStatus) => void;
}

const TaskStatusSection = ({ isEditing, status, handleStatusChange }: TaskStatusSectionProps) => {
  // Function to map UI-friendly status names to database values and vice versa
  const getStatusDisplayName = (dbStatus: TaskStatus): string => {
    switch(dbStatus) {
      case TaskStatus.TODO: return 'To Do';
      case TaskStatus.IN_PROGRESS: return 'In Progress';
      case TaskStatus.COMPLETED: return 'Completed';
      case TaskStatus.BACKLOG: return 'Backlog';
      case TaskStatus.IN_REVIEW: return 'In Review';
      case TaskStatus.DONE: return 'Done';
      case TaskStatus.BLOCKED: return 'Blocked';
      default: return 'To Do';
    }
  };
  
  // Function to map display value to database value
  const getStatusDatabaseValue = (displayStatus: string): TaskStatus => {
    switch(displayStatus) {
      case 'To Do': return TaskStatus.TODO;
      case 'In Progress': return TaskStatus.IN_PROGRESS;
      case 'Completed': return TaskStatus.COMPLETED;
      case 'Backlog': return TaskStatus.BACKLOG;
      case 'In Review': return TaskStatus.IN_REVIEW;
      case 'Done': return TaskStatus.DONE;
      case 'Blocked': return TaskStatus.BLOCKED;
      default: return TaskStatus.TODO;
    }
  };
  
  // Function to handle the status change with mapping
  const onStatusChange = (value: string) => {
    const dbValue = getStatusDatabaseValue(value);
    handleStatusChange(dbValue);
  };
  
  return (
    <div>
      <h3 className="text-sm font-medium mb-2">Status</h3>
      {isEditing ? (
        <Select 
          value={getStatusDisplayName(status)} 
          onValueChange={onStatusChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="To Do">To Do</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Backlog">Backlog</SelectItem>
            <SelectItem value="In Review">In Review</SelectItem>
            <SelectItem value="Blocked">Blocked</SelectItem>
          </SelectContent>
        </Select>
      ) : (
        <Badge className={
          status === TaskStatus.COMPLETED || status === TaskStatus.DONE ? 'bg-green-100 text-green-800' : 
          status === TaskStatus.IN_PROGRESS ? 'bg-orange-100 text-orange-800' : 
          status === TaskStatus.IN_REVIEW ? 'bg-purple-100 text-purple-800' :
          status === TaskStatus.BACKLOG ? 'bg-gray-100 text-gray-500' :
          status === TaskStatus.BLOCKED ? 'bg-red-100 text-red-800' :
          'bg-gray-100 text-gray-800'
        }>
          {getStatusDisplayName(status)}
        </Badge>
      )}
    </div>
  );
};

export default TaskStatusSection;
