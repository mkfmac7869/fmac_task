import { useState, useEffect } from 'react';
import { Task } from '@/types/task';
import { FirebaseService } from '@/lib/firebaseService';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';

export const useTaskState = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const fetchTasks = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        console.log("Fetching tasks with user role:", user.role);
        
        // Build conditions for Firebase query
        let conditions = [];
        
        // Admin can see all tasks, other roles have restrictions
        if (user.role !== 'admin') {
          // Non-admin users can only see tasks assigned to them or created by them
          conditions = [
            { field: 'assigned_to', operator: '==', value: user.id },
            { field: 'created_by', operator: '==', value: user.id }
          ];
        }
        
        console.log("About to execute query");
        const data = await FirebaseService.getDocuments('tasks', conditions);
        console.log("Query executed, data length:", data ? data.length : 0);

        if (data && data.length > 0) {
          console.log("Tasks data fetched:", data);
          const formattedTasks = await Promise.all(data.map(async (task) => {
            // Get assignee info
            let assignee = null;
            if (task.assigned_to) {
              const profileData = await FirebaseService.getDocument('profiles', task.assigned_to);
                
              if (profileData && (profileData as any).name) {
                assignee = {
                  id: profileData.id,
                  name: (profileData as any).name,
                  avatar: (profileData as any).avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent((profileData as any).name)}&background=42d1f5&color=fff`,
                  email: (profileData as any).email || ''
                };
              }
            }
            
            // Get creator info
            let creator = null;
            if (task.created_by) {
              const creatorData = await FirebaseService.getDocument('profiles', task.created_by);
                
              if (creatorData && (creatorData as any).name) {
                creator = {
                  id: creatorData.id,
                  name: (creatorData as any).name,
                  avatar: (creatorData as any).avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent((creatorData as any).name)}&background=42d1f5&color=fff`,
                  email: (creatorData as any).email || ''
                };
              }
            }
            
            // Calculate progress based on status since we don't have a progress column
            const progress = 
              task.status === 'completed' ? 100 : 
              task.status === 'in_progress' ? 50 : 0;
            
            return {
              id: task.id,
              title: task.title,
              description: task.description || '',
              status: task.status,
              priority: task.priority,
              dueDate: task.due_date,
              projectId: task.project_id,
              progress: progress,
              assignee: assignee,
              creator: creator,
              createdAt: task.created_at,
              tags: []
            };
          }));
          
          console.log("Formatted tasks:", formattedTasks);
          setTasks(formattedTasks);
        } else {
          console.log("No tasks found");
          setTasks([]);
        }
      } catch (err) {
        console.error("Unexpected error fetching tasks:", err);
        setTasks([]);
      } finally {
        setIsLoading(false);
      }
    };

  useEffect(() => {
    fetchTasks();
  }, [user]);

  return { tasks, setTasks, isLoading, refreshTasks: fetchTasks };
};
