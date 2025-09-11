
import { useNavigate } from 'react-router-dom';
import { useTask } from '@/context/TaskContext';
import { Button } from '@/components/ui/button';
import DashboardTaskItem from './DashboardTaskItem';
import { Skeleton } from '@/components/ui/skeleton';

const RecentTasks = () => {
  const navigate = useNavigate();
  const { tasks, isLoading } = useTask();
  
  // Sort tasks by creation date (newest first) and take the first 4
  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);
  
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Recent Tasks</h2>
        <Button variant="link" className="text-fmac-red" onClick={() => navigate('/tasks')}>
          View all
        </Button>
      </div>
      <div className="space-y-4">
        {isLoading ? (
          // Show skeleton loaders while loading
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="border rounded-lg p-4 space-y-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <div className="flex justify-between items-center pt-2">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-2 w-20" />
              </div>
            </div>
          ))
        ) : recentTasks.length > 0 ? (
          recentTasks.map((task) => (
            <DashboardTaskItem key={task.id} task={task} />
          ))
        ) : (
          <div className="text-center py-6 text-gray-500 border rounded-lg">
            <p>No tasks created yet</p>
            <Button 
              variant="link" 
              className="text-fmac-red mt-2" 
              onClick={() => navigate('/tasks')}
            >
              Create your first task
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentTasks;
