
import { useTaskState } from './task/useTaskState';
import { useAddTask } from './task/useAddTask';
import { useUpdateTask } from './task/useUpdateTask';
import { useDeleteTask } from './task/useDeleteTask';
import { useTaskQueries } from './task/useTaskQueries';

export const useTaskOperations = () => {
  const { tasks, setTasks, isLoading, refreshTasks } = useTaskState();
  const { addTask } = useAddTask(setTasks);
  const { updateTask } = useUpdateTask(tasks, setTasks);
  const { deleteTask } = useDeleteTask(setTasks);
  const { getTaskById, getTasksByStatus, getTasksByProject } = useTaskQueries(tasks);

  return {
    tasks,
    setTasks,
    isLoading,
    refreshTasks,
    addTask,
    updateTask,
    deleteTask,
    getTaskById,
    getTasksByStatus,
    getTasksByProject,
  };
};
