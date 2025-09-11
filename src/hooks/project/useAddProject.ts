
import { Project } from '@/types/task';
import { FirebaseService } from '@/lib/firebaseService';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { getColorForProject } from './utils';

export const useAddProject = (setProjects: React.Dispatch<React.SetStateAction<Project[]>>) => {
  const { user } = useAuth();
  
  const addProject = async (project: Omit<Project, 'id'> & { departmentId?: string | null }) => {
    try {
      const newProject = {
        name: project.name,
        description: project.description,
        status: 'active',
        created_by: user?.id,
        department_id: project.departmentId || null // Use the department ID if provided
      };
      
      // Add to Firebase
      const data = await FirebaseService.addDocument('projects', newProject);
      
      // Format for local state
      const formattedProject = {
        id: data.id,
        name: data.name,
        description: data.description || '',
        color: getColorForProject(data.name),
        members: []
      };
      
      // Update local state
      setProjects(prev => [...prev, formattedProject]);
      
      toast({
        title: 'Project created',
        description: `${formattedProject.name} has been created successfully.`
      });
      
      return formattedProject;
    } catch (err) {
      console.error("Failed to add project:", err);
      toast({
        title: 'Error creating project',
        description: 'Could not create the project. Please try again.',
        variant: 'destructive'
      });
      throw err;
    }
  };
  
  return { addProject };
};
