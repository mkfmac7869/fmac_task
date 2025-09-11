
import React from 'react';
import { Task, TaskStatus } from '@/types/task';
import TaskListItem from './TaskListItem';
import { useIsMobile } from '@/hooks/use-mobile';

interface TaskListViewProps {
  todoTasks: Task[];
  inProgressTasks: Task[];
  completedTasks: Task[];
  onViewTask: (taskId: string) => void;
}

const TaskListView: React.FC<TaskListViewProps> = ({
  todoTasks,
  inProgressTasks,
  completedTasks,
  onViewTask
}) => {
  const isMobile = useIsMobile();
  
  const sectionClass = isMobile 
    ? "mb-4 last:mb-0 px-1" 
    : "mb-10 last:mb-0";
  
  const headingClass = `${isMobile ? 'text-base mb-2' : 'text-lg mb-4'} font-medium flex items-center`;
  
  return (
    <div className={`space-y-1 ${isMobile ? 'pb-16' : ''}`}>
      {/* To Do Tasks */}
      <div className={sectionClass}>
        <h2 className={headingClass}>
          <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
          To Do
          <span className="ml-2 text-sm text-gray-500 font-normal">({todoTasks.length})</span>
        </h2>
        
        {todoTasks.length > 0 ? (
          <div className={`space-y-2 ${isMobile ? 'rounded-lg overflow-hidden border border-gray-100' : ''}`}>
            {todoTasks.map(task => (
              <TaskListItem 
                key={task.id} 
                task={task} 
                onClick={() => onViewTask(task.id)} 
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 py-3 px-4 bg-gray-50 rounded-md">No tasks to do</p>
        )}
      </div>
      
      {/* In Progress Tasks */}
      <div className={sectionClass}>
        <h2 className={headingClass}>
          <span className="w-3 h-3 bg-amber-500 rounded-full mr-2"></span>
          In Progress
          <span className="ml-2 text-sm text-gray-500 font-normal">({inProgressTasks.length})</span>
        </h2>
        
        {inProgressTasks.length > 0 ? (
          <div className={`space-y-2 ${isMobile ? 'rounded-lg overflow-hidden border border-gray-100' : ''}`}>
            {inProgressTasks.map(task => (
              <TaskListItem 
                key={task.id} 
                task={task} 
                onClick={() => onViewTask(task.id)} 
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 py-3 px-4 bg-gray-50 rounded-md">No tasks in progress</p>
        )}
      </div>
      
      {/* Completed Tasks */}
      <div className={sectionClass}>
        <h2 className={headingClass}>
          <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
          Completed
          <span className="ml-2 text-sm text-gray-500 font-normal">({completedTasks.length})</span>
        </h2>
        
        {completedTasks.length > 0 ? (
          <div className={`space-y-2 ${isMobile ? 'rounded-lg overflow-hidden border border-gray-100' : ''}`}>
            {completedTasks.map(task => (
              <TaskListItem 
                key={task.id} 
                task={task} 
                onClick={() => onViewTask(task.id)} 
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 py-3 px-4 bg-gray-50 rounded-md">No completed tasks</p>
        )}
      </div>
    </div>
  );
};

export default TaskListView;
