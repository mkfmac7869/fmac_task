
import React, { createContext, useContext } from 'react';
import { TaskContextType } from '../types/task';
import { useTaskOperations } from '../hooks/useTaskOperations';
import { useProjectOperations } from '../hooks/useProjectOperations';

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    tasks, 
    setTasks, 
    isLoading: tasksLoading,
    refreshTasks,
    addTask, 
    updateTask, 
    deleteTask, 
    getTaskById, 
    getTasksByStatus, 
    getTasksByProject 
  } = useTaskOperations();
  
  const { 
    projects, 
    isLoading: projectsLoading,
    addProject, 
    updateProject, 
    deleteProject, 
    getProjectById 
  } = useProjectOperations(setTasks);

  const isLoading = tasksLoading || projectsLoading;

  return (
    <TaskContext.Provider 
      value={{ 
        tasks,
        projects,
        isLoading,
        refreshTasks,
        addTask,
        updateTask,
        deleteTask,
        getTaskById,
        getTasksByStatus,
        getTasksByProject,
        addProject,
        updateProject,
        deleteProject,
        getProjectById
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};
