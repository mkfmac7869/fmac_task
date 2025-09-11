
import React, { useState, createContext, useContext } from 'react';
import { Task, TaskStatus, TaskPriority } from '@/types/task';
import { db } from '@/lib/firebaseClient';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { TaskService } from '@/lib/firebaseService';

interface EditedTask {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  progress: number;
}

interface TaskEditingContextProps {
  isEditing: boolean;
  editedTask: EditedTask;
  progressValue: number;
  setProgressValue: React.Dispatch<React.SetStateAction<number>>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleStatusChange: (status: TaskStatus) => void;
  handlePriorityChange: (priority: TaskPriority) => void;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  handleSaveChanges: () => void;
  handleProgressUpdate: () => void;
}

// Create context with default values
const TaskEditingContext = createContext<TaskEditingContextProps | undefined>(undefined);

// Hook to use the context
export const useTaskEditing = () => {
  const context = useContext(TaskEditingContext);
  if (!context) {
    throw new Error('useTaskEditing must be used within a TaskEditingProvider');
  }
  return context;
};

// Provider component
export const TaskEditingProvider: React.FC<{
  children: (props: TaskEditingContextProps) => React.ReactNode;
  task: Task;
  updateTask: (id: string, task: Partial<Task>) => void;
}> = ({ children, task, updateTask }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuth();
  
  const [editedTask, setEditedTask] = useState<EditedTask>({
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    progress: task.progress,
  });
  
  const [progressValue, setProgressValue] = useState(task.progress);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStatusChange = (status: TaskStatus) => {
    setEditedTask((prev) => ({ ...prev, status }));
  };

  const handlePriorityChange = (priority: TaskPriority) => {
    setEditedTask((prev) => ({ ...prev, priority }));
  };

  const recordActivity = async (action: string, target: string, value?: string) => {
    if (!user || !task.id) return;

    try {
      await TaskService.addActivity(task.id, user.id, action, {
        target: target,
        value: value,
      });
    } catch (error) {
      console.error('Error recording task activity:', error);
    }
  };

  const handleSaveChanges = () => {
    console.log('TaskEditingProvider - handleSaveChanges called with task.id:', task.id);
    console.log('TaskEditingProvider - task object:', task);
    
    const updatedTask: Partial<Task> = {
      title: editedTask.title,
      description: editedTask.description,
      status: editedTask.status,
      priority: editedTask.priority,
    };
    
    console.log('TaskEditingProvider - calling updateTask with ID:', task.id, 'updatedTask:', updatedTask);
    
    // Record activities for each changed field
    if (task.title !== editedTask.title) {
      recordActivity('updated', 'title', editedTask.title);
    }
    
    if (task.description !== editedTask.description) {
      recordActivity('updated', 'description');
    }
    
    if (task.status !== editedTask.status) {
      recordActivity('updated', 'status', editedTask.status);
    }
    
    if (task.priority !== editedTask.priority) {
      recordActivity('updated', 'priority', editedTask.priority);
    }
    
    updateTask(task.id, updatedTask);
    setIsEditing(false);
  };

  const handleProgressUpdate = () => {
    console.log('TaskEditingProvider - handleProgressUpdate called with task.id:', task.id);
    console.log('TaskEditingProvider - task object:', task);
    
    if (progressValue !== task.progress) {
      console.log('TaskEditingProvider - calling updateTask with ID:', task.id, 'progress:', progressValue);
      updateTask(task.id, { progress: progressValue });
      recordActivity('updated', 'progress', `${progressValue}%`);
    }
  };

  const contextValue: TaskEditingContextProps = {
    isEditing,
    editedTask,
    progressValue,
    setProgressValue,
    handleInputChange,
    handleStatusChange,
    handlePriorityChange,
    setIsEditing,
    handleSaveChanges,
    handleProgressUpdate,
  };

  return (
    <TaskEditingContext.Provider value={contextValue}>
      {children(contextValue)}
    </TaskEditingContext.Provider>
  );
};
