
import { Task } from '@/types/task';
import { FirebaseService } from '@/lib/firebaseService';
import { toast } from '@/hooks/use-toast';

export const useDeleteProject = (
  setProjects: React.Dispatch<React.SetStateAction<any[]>>,
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
) => {
  const deleteProject = async (id: string) => {
    try {
      // Delete from Firebase
      await FirebaseService.deleteDocument('projects', id);
      
      // Update local state
      setProjects(prev => prev.filter(project => project.id !== id));
      
      toast({
        title: 'Project deleted',
        description: 'The project has been deleted successfully.'
      });
      
      // Also delete all tasks associated with this project
      setTasks(prev => {
        return prev.filter(task => task.projectId !== id);
      });
    } catch (err) {
      console.error("Failed to delete project:", err);
      toast({
        title: 'Error deleting project',
        description: 'Could not delete the project. Please try again.',
        variant: 'destructive'
      });
    }
  };
  
  return { deleteProject };
};
