import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { createMissingActivities } from '@/utils/debugActivities';
import { FirebaseService } from '@/lib/firebaseService';
import { toast } from '@/hooks/use-toast';

const DebugActivities = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [activities, setActivities] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);

  const handleCreateMissingActivities = async () => {
    setIsCreating(true);
    try {
      await createMissingActivities();
      toast({
        title: "Success",
        description: "Missing activities have been created",
      });
      await loadData();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to create activities",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const loadData = async () => {
    try {
      const allActivities = await FirebaseService.getDocuments('activities', []);
      const allTasks = await FirebaseService.getDocuments('tasks', []);
      setActivities(allActivities);
      setTasks(allTasks);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Layout>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Debug Activities</h1>
        
        <div className="mb-6">
          <Button 
            onClick={handleCreateMissingActivities}
            disabled={isCreating}
          >
            {isCreating ? 'Creating...' : 'Create Missing Activities for All Tasks'}
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Tasks ({tasks.length})</h2>
            <div className="space-y-2">
              {tasks.map(task => (
                <div key={task.id} className="p-3 border rounded">
                  <p className="font-medium">{task.title}</p>
                  <p className="text-sm text-gray-500">ID: {task.id}</p>
                  <p className="text-sm text-gray-500">
                    Activities: {activities.filter(a => a.taskId === task.id).length}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Activities ({activities.length})</h2>
            <div className="space-y-2">
              {activities.map(activity => (
                <div key={activity.id} className="p-3 border rounded">
                  <p className="font-medium">{activity.description || activity.action}</p>
                  <p className="text-sm text-gray-500">Task ID: {activity.taskId}</p>
                  <p className="text-sm text-gray-500">User: {activity.userName}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DebugActivities;
