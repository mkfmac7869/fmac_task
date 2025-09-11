
import { Task } from '@/types/task';

export const useTaskQueries = (tasks: Task[]) => {
  const getTaskById = (id: string) => {
    return tasks.find(task => task.id === id);
  };

  const getTasksByStatus = (status: Task['status']) => {
    return tasks.filter(task => task.status === status);
  };

  const getTasksByProject = (projectId: string) => {
    return tasks.filter(task => task.projectId === projectId);
  };

  const getTasksByPriority = (priority: Task['priority']) => {
    return tasks.filter(task => task.priority === priority);
  };

  return {
    getTaskById,
    getTasksByStatus,
    getTasksByProject,
    getTasksByPriority
  };
};
