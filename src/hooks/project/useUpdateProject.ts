
import { Project } from '@/types/task';
import { FirebaseService } from '@/lib/firebaseService';
import { toast } from '@/hooks/use-toast';

export const useUpdateProject = (setProjects: React.Dispatch<React.SetStateAction<Project[]>>) => {
  const updateProject = async (id: string, updatedFields: Partial<Project>) => {
    try {
      // Transform fields for Firebase
      const firebaseFields: any = {};
      
      if (updatedFields.name) firebaseFields.name = updatedFields.name;
      if (updatedFields.description) firebaseFields.description = updatedFields.description;
      if (updatedFields.color) firebaseFields.color = updatedFields.color;
      if (updatedFields.departmentId !== undefined) firebaseFields.department = updatedFields.departmentId;
      if (updatedFields.members) firebaseFields.members = updatedFields.members;
      
      // Update in Firebase
      await FirebaseService.updateDocument('projects', id, firebaseFields);
      
      // Update local state
      setProjects(prev => prev.map(project => 
        project.id === id ? { ...project, ...updatedFields } : project
      ));
      
      toast({
        title: 'Project updated',
        description: 'Project details have been updated successfully.'
      });
    } catch (err) {
      console.error("Failed to update project:", err);
      toast({
        title: 'Error updating project',
        description: 'Could not update the project. Please try again.',
        variant: 'destructive'
      });
    }
  };
  
  return { updateProject };
};
