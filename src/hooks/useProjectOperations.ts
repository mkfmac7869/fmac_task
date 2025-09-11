
import { useProjectState } from './project/useProjectState';
import { useAddProject } from './project/useAddProject';
import { useUpdateProject } from './project/useUpdateProject';
import { useDeleteProject } from './project/useDeleteProject';
import { useProjectQueries } from './project/useProjectQueries';
import { Task } from '../types/task';

export const useProjectOperations = (setTasks: React.Dispatch<React.SetStateAction<Task[]>>) => {
  const { projects, setProjects, isLoading } = useProjectState();
  const { addProject } = useAddProject(setProjects);
  const { updateProject } = useUpdateProject(setProjects);
  const { deleteProject } = useDeleteProject(setProjects, setTasks);
  const { getProjectById } = useProjectQueries(projects);

  return {
    projects,
    isLoading,
    addProject,
    updateProject,
    deleteProject,
    getProjectById,
  };
};
