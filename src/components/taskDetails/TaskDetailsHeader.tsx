
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface TaskDetailsHeaderProps {
  title: string;
  isEditing: boolean;
  editedTask: {
    title: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  setIsEditing: (value: boolean) => void;
  handleSaveChanges: () => void;
  handleDeleteTask: () => void;
}

const TaskDetailsHeader = ({
  title,
  isEditing,
  editedTask,
  handleInputChange,
  setIsEditing,
  handleSaveChanges,
  handleDeleteTask
}: TaskDetailsHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={() => navigate('/tasks')} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        {isEditing ? (
          <Input 
            className="text-2xl font-bold px-0 border-none shadow-none focus-visible:ring-0"
            name="title"
            value={editedTask.title}
            onChange={handleInputChange}
          />
        ) : (
          <h1 className="text-2xl font-bold">{title}</h1>
        )}
      </div>
      <div className="flex items-center gap-3 mt-4 md:mt-0">
        {isEditing ? (
          <>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button className="bg-fmac-red hover:bg-fmac-red/90" onClick={handleSaveChanges}>
              Save Changes
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" size="icon" onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Task</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this task? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button 
                    variant="destructive" 
                    onClick={handleDeleteTask}
                  >
                    Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskDetailsHeader;
