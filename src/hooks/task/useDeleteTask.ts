
import { toast } from '@/hooks/use-toast';
import { FirebaseService, TaskService } from '@/lib/firebaseService';
import { useAuth } from '@/context/AuthContext';

export const useDeleteTask = (setTasks: React.Dispatch<React.SetStateAction<any[]>>) => {
  const auth = useAuth();
  const user = auth?.user;

  const deleteTask = async (id: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to delete a task.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Record activity before deleting
      await TaskService.addActivity(id, user.id, 'deleted', {
        target: 'task'
      });
      
      await FirebaseService.deleteDocument('tasks', id);
      
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
      
      toast({
        title: 'Task deleted',
        description: 'Task has been deleted successfully.',
      });
    } catch (error: any) {
      console.error("Unexpected error deleting task:", error);
      toast({
        title: 'Error deleting task',
        description: error.message || "Something went wrong",
        variant: 'destructive'
      });
    }
  };
  
  return { deleteTask };
};
