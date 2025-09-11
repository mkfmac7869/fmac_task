
import React from 'react';
import { Task, TaskStatus } from '@/types/task';
import KanbanColumnHeader from './KanbanColumnHeader';
import TaskCard from './TaskCard';
import EmptyColumnPlaceholder from './EmptyColumnPlaceholder';
import { useAuth } from '@/context/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';

interface KanbanColumnProps {
  title: string;
  tasks: Task[];
  status: TaskStatus;
  onTaskClick: (task: Task) => void;
  onDragStart?: (e: React.DragEvent<Element>, taskId: string) => void;
  onDragOver?: (e: React.DragEvent<Element>) => void;
  onDrop?: (e: React.DragEvent<Element>, status: TaskStatus) => void;
  columnColor?: string;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ 
  title, 
  tasks, 
  status, 
  onTaskClick,
  onDragStart,
  onDragOver,
  onDrop,
  columnColor = 'bg-gray-50'
}) => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (onDragOver) onDragOver(e);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    console.log("Drop detected in column:", status);
    if (onDrop) onDrop(e, status);
  };
  
  return (
    <div 
      className={`kanban-column p-3 sm:p-4 rounded-lg ${columnColor}`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      data-status={status}
    >
      <KanbanColumnHeader title={title} taskCount={tasks.length} status={status} />
      <div className="mt-2 sm:mt-3 overflow-y-auto px-1 py-1 sm:py-2" style={{
        height: isMobile ? '35vh' : 'calc(80vh - 120px)'
      }}>
        {tasks.length > 0 ? (
          <div className="space-y-2 sm:space-y-3">
            {tasks.map((task) => (
              <TaskCard 
                key={task.id}
                task={task}
                onTaskClick={() => onTaskClick(task)}
                isAssignedToUser={task.assignee?.id === user?.id}
                onDragStart={onDragStart}
              />
            ))}
          </div>
        ) : (
          <EmptyColumnPlaceholder status={status} />
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
