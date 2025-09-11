
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { User } from '@/types/auth';
import { Department } from '@/pages/DepartmentManagement';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebaseClient';
import { collection, addDoc } from 'firebase/firestore';
import { AuthService, DepartmentService } from '@/lib/firebaseService';

interface AddDepartmentDialogProps {
  onDepartmentAdded: (department: Omit<Department, 'id' | 'memberCount'>) => void;
  getAvailableHeads: () => Promise<User[]>;
}

const AddDepartmentDialog = ({ onDepartmentAdded, getAvailableHeads }: AddDepartmentDialogProps) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedHeadId, setSelectedHeadId] = useState<string | undefined>();
  const [availableHeads, setAvailableHeads] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch available heads when dialog opens
  useEffect(() => {
    if (open) {
      const fetchHeads = async () => {
        setIsLoading(true);
        try {
          const heads = await getAvailableHeads();
          setAvailableHeads(heads);
        } catch (error) {
          console.error('Error fetching available heads:', error);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchHeads();
    }
  }, [open, getAvailableHeads]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name) {
      toast({
        title: "Error",
        description: "Department name is required",
        variant: "destructive"
      });
      return;
    }
    
    // Make sure we have admin privileges to add a department
    if (!user || user.role !== 'admin') {
      toast({
        title: "Permission Denied",
        description: "Only administrators can add departments",
        variant: "destructive"
      });
      return;
    }
    
    // Verify we have an active session
    const { data: { session } } = await AuthService.getSession();
    if (!session) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to create departments",
        variant: "destructive"
      });
      return;
    }
    
    const selectedHead = selectedHeadId 
      ? availableHeads.find(head => head.id === selectedHeadId)
      : undefined;

    onDepartmentAdded({
      name,
      description,
      head: selectedHead,
    });

    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setSelectedHeadId(undefined);
  };

  return (
    <>
      <Button 
        className="bg-fmac-red hover:bg-fmac-red/90"
        onClick={() => setOpen(true)}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Department
      </Button>
      
      <Dialog open={open} onOpenChange={(value) => {
        setOpen(value);
        if (!value) resetForm();
      }}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Department</DialogTitle>
            <DialogDescription>
              Create a new department and optionally assign a head
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Department name"
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Department description"
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="head" className="text-right">
                  Department Head
                </Label>
                <div className="col-span-3">
                  <Select value={selectedHeadId} onValueChange={setSelectedHeadId} disabled={isLoading}>
                    <SelectTrigger>
                      <SelectValue placeholder={
                        isLoading 
                          ? "Loading available heads..." 
                          : "Select a department head (optional)"
                      } />
                    </SelectTrigger>
                    <SelectContent>
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
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>Save Department</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddDepartmentDialog;
