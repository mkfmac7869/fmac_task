import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User } from '@/types/auth';
import { Department } from '@/pages/DepartmentManagement';
import { toast } from '@/hooks/use-toast';

interface EditDepartmentDialogProps {
  department: Department;
  getAvailableHeads: () => Promise<User[]>;
  onDepartmentUpdated: (department: Department) => void;
  onClose: () => void;
}

const EditDepartmentDialog = ({ 
  department, 
  getAvailableHeads, 
  onDepartmentUpdated, 
  onClose 
}: EditDepartmentDialogProps) => {
  const [open, setOpen] = useState(true);
  const [name, setName] = useState(department.name);
  const [description, setDescription] = useState(department.description || '');
  const [selectedHeadId, setSelectedHeadId] = useState<string | undefined>(
    department.head ? department.head.id : undefined
  );
  const [availableHeads, setAvailableHeads] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchHeads = async () => {
      setIsLoading(true);
      try {
        let heads = await getAvailableHeads();
        
        if (department.head && !heads.some(h => h.id === department.head?.id)) {
          heads = [department.head, ...heads];
        }
        
        setAvailableHeads(heads);
      } catch (error) {
        console.error('Error fetching available heads:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchHeads();
  }, [department.head, getAvailableHeads]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name) {
      toast({
        title: "Error",
        description: "Department name is required",
        variant: "destructive"
      });
      return;
    }
    
    const selectedHead = selectedHeadId && selectedHeadId !== "none"
      ? availableHeads.find(head => head.id === selectedHeadId)
      : undefined;

    onDepartmentUpdated({
      ...department,
      name,
      description,
      head: selectedHead,
    });

    handleClose();
  };

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(value) => {
      if (!value) handleClose();
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Department</DialogTitle>
          <DialogDescription>
            Make changes to the department information
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Name
              </Label>
              <Input
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Department name"
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-description" className="text-right">
                Description
              </Label>
              <Textarea
                id="edit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Department description"
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-head" className="text-right">
                Department Head
              </Label>
              <div className="col-span-3">
                <Select 
                  value={selectedHeadId || "none"} 
                  onValueChange={setSelectedHeadId}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={
                      isLoading 
                        ? "Loading available heads..." 
                        : "Select a department head (optional)"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {availableHeads.map((head) => (
                      <SelectItem key={head.id} value={head.id}>
                        {head.name} ({head.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditDepartmentDialog;
