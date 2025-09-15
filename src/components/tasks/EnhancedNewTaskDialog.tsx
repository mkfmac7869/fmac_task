import React, { useState } from 'react';
import { useTask } from '@/context/TaskContext';
import { Dialog, DialogContent, DialogTitle, DialogHeader } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import EnhancedTaskForm from './EnhancedTaskForm';
import { useAuth } from '@/context/AuthContext';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EnhancedNewTaskDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  defaultAssignee?: {
    id: string;
    name: string;
    avatar: string;
    email?: string;
  };
}

const EnhancedNewTaskDialog = ({ isOpen, onOpenChange, defaultAssignee }: EnhancedNewTaskDialogProps) => {
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
        projectId: data.projectId || null,
        status: data.status,
        priority: data.priority,
        dueDate: data.dueDate,
        progress: 0,
        assignee: data.assignee || null,
        tags: data.tags || [],
        comments: [],
        attachments: [],
        subtasks: [],
        checklists: []
      };
      
      console.log("Creating new task with data:", newTask);
      
      // Add task to database/state
      await addTask(newTask);
      
      // Show success message
      toast({
        title: "Task Created",
        description: "Your task has been created successfully.",
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
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Create New Task</h2>
              <p className="text-sm text-gray-500 mt-1">Fill in the details to create a new task</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-gray-200"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Form Content */}
        <div className="px-6 py-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          <EnhancedTaskForm 
            onSubmit={handleSubmit} 
            projects={projects} 
            defaultAssignee={defaultAssignee}
            isSubmitting={isSubmitting}
            user={user}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedNewTaskDialog;
