
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
      // Don't save attachments to task document - they are stored separately in attachments collection
      if (updatedFields.subtasks !== undefined) dbFields.subtasks = JSON.stringify(updatedFields.subtasks);
      if (updatedFields.checklists !== undefined) dbFields.checklists = JSON.stringify(updatedFields.checklists);
      if (updatedFields.tags !== undefined) dbFields.tags = updatedFields.tags;
      
      console.log("Updating task with ID:", id, "Fields:", dbFields);
      
      await FirebaseService.updateDocument('tasks', id, dbFields);
      
      // Track specific changes for activities
      if (updatedFields.title && updatedFields.title !== existingTask.title) {
        await TaskService.addActivity(id, user.id, `changed title from "${existingTask.title}" to "${updatedFields.title}"`, {
          type: 'status_change',
          userName: user.name,
          userAvatar: user.avatar,
          oldValue: existingTask.title,
          newValue: updatedFields.title,
        });
      }
      
      if (updatedFields.description !== undefined && updatedFields.description !== existingTask.description) {
        await TaskService.addActivity(id, user.id, 'updated the description', {
          type: 'status_change',
          userName: user.name,
          userAvatar: user.avatar,
        });
      }
      
      if (updatedFields.dueDate && updatedFields.dueDate !== existingTask.dueDate) {
        const oldDate = existingTask.dueDate ? new Date(existingTask.dueDate).toLocaleDateString() : 'No due date';
        const newDate = new Date(updatedFields.dueDate).toLocaleDateString();
        await TaskService.addActivity(id, user.id, `changed due date from ${oldDate} to ${newDate}`, {
          type: 'status_change',
          userName: user.name,
          userAvatar: user.avatar,
          oldValue: existingTask.dueDate,
          newValue: updatedFields.dueDate,
        });
      }
      
      if (updatedFields.projectId !== undefined && updatedFields.projectId !== existingTask.projectId) {
        await TaskService.addActivity(id, user.id, 'changed the project', {
          type: 'status_change',
          userName: user.name,
          userAvatar: user.avatar,
        });
      }
      
      if (updatedFields.tags && JSON.stringify(updatedFields.tags) !== JSON.stringify(existingTask.tags)) {
        await TaskService.addActivity(id, user.id, 'updated tags', {
          type: 'status_change',
          userName: user.name,
          userAvatar: user.avatar,
        });
      }
      if (updatedFields.status && updatedFields.status !== existingTask.status) {
        await TaskService.addActivity(id, user.id, `changed status from ${existingTask.status} to ${updatedFields.status}`, {
          type: 'status_change',
          userName: user.name,
          userAvatar: user.avatar,
          oldValue: existingTask.status,
          newValue: updatedFields.status,
        });
      }
      
      if (updatedFields.priority && updatedFields.priority !== existingTask.priority) {
        await TaskService.addActivity(id, user.id, `changed priority from ${existingTask.priority} to ${updatedFields.priority}`, {
          type: 'status_change',
          userName: user.name,
          userAvatar: user.avatar,
          oldValue: existingTask.priority,
          newValue: updatedFields.priority,
        });
      }
      
      if (updatedFields.progress !== undefined && updatedFields.progress !== existingTask.progress) {
        await TaskService.addActivity(id, user.id, `updated progress from ${existingTask.progress}% to ${updatedFields.progress}%`, {
          type: 'progress',
          userName: user.name,
          userAvatar: user.avatar,
          oldValue: existingTask.progress.toString(),
          newValue: updatedFields.progress.toString(),
        });
      }
      
      if (updatedFields.assignee && 
          (!existingTask.assignee || updatedFields.assignee.id !== existingTask.assignee.id)) {
        const oldAssignee = existingTask.assignee?.name || 'Unassigned';
        const newAssignee = updatedFields.assignee.name;
        await TaskService.addActivity(id, user.id, `changed assignee from ${oldAssignee} to ${newAssignee}`, {
          type: 'status_change',
          userName: user.name,
          userAvatar: user.avatar,
          oldValue: oldAssignee,
          newValue: newAssignee,
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
