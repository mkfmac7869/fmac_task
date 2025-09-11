
import React from 'react';
import { TaskStatus } from '@/types/task';

interface EmptyColumnPlaceholderProps {
  status: TaskStatus;
}

const EmptyColumnPlaceholder: React.FC<EmptyColumnPlaceholderProps> = ({ status }) => {
  return (
    <div className="flex items-center justify-center h-full border-2 border-dashed rounded-lg border-gray-200 p-4">
      <p className="text-gray-500 text-sm text-center">
        {status === TaskStatus.TODO && 'No to-do tasks'}
        {status === TaskStatus.IN_PROGRESS && 'No in-progress tasks'}
        {status === TaskStatus.COMPLETED && 'No completed tasks'}
        {status === TaskStatus.BACKLOG && 'No backlog tasks'}
        {status === TaskStatus.IN_REVIEW && 'No tasks in review'}
        {status === TaskStatus.DONE && 'No done tasks'}
        {status === TaskStatus.BLOCKED && 'No blocked tasks'}
      </p>
    </div>
  );
};

export default EmptyColumnPlaceholder;
