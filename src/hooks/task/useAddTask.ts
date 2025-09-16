
import { Task } from '@/types/task';
import { FirebaseService, TaskService } from '@/lib/firebaseService';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

export const useAddTask = (setTasks: React.Dispatch<React.SetStateAction<Task[]>>) => {
  const auth = useAuth();
  const user = auth?.user;

  const addTask = async (newTask: Omit<Task, 'id' | 'createdAt'>) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to add a task.",
        variant: "destructive",
      });
      return Promise.reject("Authentication required");
    }
    
    try {
      // Create task object with all required fields
      const taskData = {
        title: newTask.title,
        description: newTask.description || '',
        status: newTask.status,
        priority: newTask.priority,
        due_date: newTask.dueDate,
        project_id: newTask.projectId || null, // Ensure null is used when projectId is not provided
        assigned_to: newTask.assignee?.id || null,
        created_by: user.id,
        tags: newTask.tags || [],
        // We don't include progress in database insert
      };

      console.log("Inserting task with data:", taskData);
      
      const result = await FirebaseService.addDocument('tasks', taskData);
      
      // Record task creation activity
      await TaskService.addActivity(result.id, user.id, 'created', { title: newTask.title });
      
      const createdTask: Task = {
        ...newTask,
        id: result.id,
        createdAt: result.createdAt || new Date(),
        progress: newTask.status === 'completed' ? 100 : newTask.status === 'in_progress' ? 50 : 0
      };

      setTasks(prevTasks => [...prevTasks, createdTask]);
      
      toast({
        title: 'Task added',
        description: 'Task has been added successfully.',
      });
      
      return createdTask;
    } catch (error: any) {
      console.error("Unexpected error adding task:", error);
      toast({
        title: 'Error adding task',
        description: error.message || "Something went wrong",
        variant: 'destructive'
      });
      return Promise.reject(error);
    }
  };
  
  return { addTask };
};
