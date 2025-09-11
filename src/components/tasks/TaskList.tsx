
import { Task } from '@/types/task';
import TaskListItem from './TaskListItem';

interface TaskListProps {
  tasks: Task[];
  onViewTask: (id: string) => void;
}

const TaskList = ({ tasks, onViewTask }: TaskListProps) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No tasks in this category
      </div>
    );
  }
  
  return (
    <ul className="divide-y">
      {tasks.map(task => (
        <TaskListItem 
          key={task.id} 
          task={task} 
          onClick={() => onViewTask(task.id)} 
        />
      ))}
    </ul>
  );
};

export default TaskList;
