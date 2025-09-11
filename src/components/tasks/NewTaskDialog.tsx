
import React, { useState } from 'react';
import { useTask } from '@/context/TaskContext';
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogDescription } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import TaskForm from './TaskForm';
import { useAuth } from '@/context/AuthContext';

interface NewTaskDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  defaultAssignee?: {
    id: string;
    name: string;
    avatar: string;
    email?: string;
  };
}

const NewTaskDialog = ({ isOpen, onOpenChange, defaultAssignee }: NewTaskDialogProps) => {
  const { projects, addTask } = useTask();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (data: any) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const newTask = {
        title: data.title,
        description: data.description || '',
        projectId: data.projectId || null, // Allow null for projectId
        status: data.status,
        priority: data.priority,
        dueDate: data.dueDate,
        progress: 0,
        assignee: defaultAssignee || data.assignee || null,
        tags: [],
      };
      
      console.log("Creating new task with data:", newTask);
      
      // Add task to database/state
      await addTask(newTask);
      
      // Show success message
      toast({
        title: "Success",
        description: "Task added successfully.",
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating task:", error);
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
          <DialogDescription>
            Create a new task and assign it to a team member.
          </DialogDescription>
        </DialogHeader>
        <TaskForm 
          onSubmit={handleSubmit} 
          projects={projects} 
          defaultAssignee={defaultAssignee}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};

export default NewTaskDialog;
