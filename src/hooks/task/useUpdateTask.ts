
import { Task } from '@/types/task';
import { FirebaseService, TaskService } from '@/lib/firebaseService';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

export const useUpdateTask = (tasks: Task[], setTasks: React.Dispatch<React.SetStateAction<Task[]>>) => {
  const { user } = useAuth();

  const updateTask = async (id: string, updatedFields: Partial<Task>) => {
    console.log("updateTask called with ID:", id, "Fields:", updatedFields);
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to update a task.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const existingTask = tasks.find(task => task.id === id);
      
      if (!existingTask) {
        console.log("Task not found in local state. Available task IDs:", tasks.map(t => t.id));
        toast({
          title: 'Task not found',
          description: 'The task you are trying to update does not exist.',
          variant: 'destructive'
        });
        return;
      }
      
      console.log("Found existing task:", existingTask);
      
      // Transform updatedFields to match database column names
      const dbFields: any = {};
      
      if (updatedFields.title !== undefined) dbFields.title = updatedFields.title;
      if (updatedFields.description !== undefined) dbFields.description = updatedFields.description;
      if (updatedFields.status !== undefined) dbFields.status = updatedFields.status;
      if (updatedFields.priority !== undefined) dbFields.priority = updatedFields.priority;
      if (updatedFields.dueDate !== undefined) dbFields.due_date = updatedFields.dueDate;
      if (updatedFields.projectId !== undefined) dbFields.project_id = updatedFields.projectId;
      if (updatedFields.assignee !== undefined) dbFields.assigned_to = updatedFields.assignee?.id || null;
      if (updatedFields.progress !== undefined) dbFields.progress = updatedFields.progress;
      if (updatedFields.comments !== undefined) dbFields.comments = JSON.stringify(updatedFields.comments);
      if (updatedFields.attachments !== undefined) dbFields.attachments = JSON.stringify(updatedFields.attachments);
      if (updatedFields.subtasks !== undefined) dbFields.subtasks = JSON.stringify(updatedFields.subtasks);
      if (updatedFields.checklists !== undefined) dbFields.checklists = JSON.stringify(updatedFields.checklists);
      if (updatedFields.tags !== undefined) dbFields.tags = updatedFields.tags;
      
      console.log("Updating task with ID:", id, "Fields:", dbFields);
      
      await FirebaseService.updateDocument('tasks', id, dbFields);
      
      // Track specific changes for activities
      if (updatedFields.status && updatedFields.status !== existingTask.status) {
        await TaskService.addActivity(id, user.id, 'updated', {
          target: 'status',
          value: updatedFields.status,
        });
      }
      
      if (updatedFields.priority && updatedFields.priority !== existingTask.priority) {
        await TaskService.addActivity(id, user.id, 'updated', {
          target: 'priority',
          value: updatedFields.priority,
        });
      }
      
      if (updatedFields.progress !== undefined && updatedFields.progress !== existingTask.progress) {
        await TaskService.addActivity(id, user.id, 'updated', {
          target: 'progress',
          value: `${updatedFields.progress}%`,
        });
      }
      
      if (updatedFields.assignee && 
          (!existingTask.assignee || updatedFields.assignee.id !== existingTask.assignee.id)) {
        await TaskService.addActivity(id, user.id, 'assigned', {
          target: 'task',
          value: updatedFields.assignee.name,
        });
      }
      
      // Update state
      setTasks(tasks.map(task => 
        task.id === id 
          ? { ...task, ...updatedFields } 
          : task
      ));
      
      toast({
        title: 'Task updated',
        description: 'Task has been updated successfully.',
      });
    } catch (error: any) {
      console.error("Unexpected error updating task:", error);
      toast({
        title: 'Error updating task',
        description: error.message || "Something went wrong",
        variant: 'destructive'
      });
    }
  };
  
  return { updateTask };
};
