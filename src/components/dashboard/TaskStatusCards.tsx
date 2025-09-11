
import { useTask } from '@/context/TaskContext';
import { Card, CardContent } from '@/components/ui/card';
import { CheckSquare, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TaskStatus } from '@/types/task';

interface TaskCardProps {
  status: string;
  count: number;
  className?: string;
}

const TaskCard = ({ status, count, className }: TaskCardProps) => {
  return (
    <Card className={`task-card ${className} w-full`}>
      <CardContent className="flex flex-col p-6">
        <div className="flex items-center justify-between">
          <div className="rounded-full bg-white/20 p-1.5">
            <CheckSquare className="h-6 w-6" />
          </div>
          <Button variant="ghost" size="icon" className="text-white/80 hover:text-white hover:bg-white/10">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex-1 mt-4">
          <div className="text-3xl font-bold">{count}</div>
          <div className="text-lg">{status}</div>
        </div>
      </CardContent>
    </Card>
  );
};

const TaskStatusCards = () => {
  const { getTasksByStatus } = useTask();
  
  const todoTasks = getTasksByStatus(TaskStatus.TODO);
  const inProgressTasks = getTasksByStatus(TaskStatus.IN_PROGRESS);
  const completedTasks = getTasksByStatus(TaskStatus.COMPLETED);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <TaskCard status="Completed" count={completedTasks.length} className="task-card-purple" />
      <TaskCard status="In Progress" count={inProgressTasks.length} className="task-card-orange" />
      <TaskCard status="Working Hours" count={124} className="task-card-blue" />
    </div>
  );
};

export default TaskStatusCards;
