
import { Project } from '@/types/task';

export const useProjectQueries = (projects: Project[]) => {
  const getProjectById = (id: string | null) => {
    if (!id) return null;
    return projects.find(project => project.id === id) || null;
  };
  
  return { getProjectById };
};
