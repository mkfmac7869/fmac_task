
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Plus } from 'lucide-react';
import { db } from '@/lib/firebaseClient';
import { collection, addDoc } from 'firebase/firestore';
import { User } from '@/types/auth';
import ExistingMemberTab from './ExistingMemberTab';
import NewMemberForm from './NewMemberForm';

export interface AddMemberFormData {
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
}

interface AddMemberDialogProps {
  departments: string[];
  onMemberAdded: (member: AddMemberFormData) => void;
  'data-testid'?: string; // Add support for data-testid attribute
}

const AddMemberDialog = ({ departments, onMemberAdded, ...props }: AddMemberDialogProps) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [availableMembers, setAvailableMembers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Get available members that aren't already in the team
  useEffect(() => {
    const fetchAvailableMembers = async () => {
      if (user?.role === 'head' && open) {
        setIsLoading(true);
        try {
          // Get all members that don't have a department or are not in this head's department
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .or(`department.is.null,department.neq.${user.department}`);
            
          if (error) {
            throw error;
          }
          
          if (data) {
            console.log("Available members:", data);
            const availableUsers: User[] = data
              // Filter out admin users and managers who shouldn't be added to departments
              .filter(profile => profile.role !== 'admin' && profile.role !== 'manager' && profile.role !== 'head')
              .map(profile => ({
                id: profile.id,
                name: profile.name,
                email: profile.email,
                role: profile.role,
                avatar: profile.avatar,
                department: profile.department
              }));
            
            setAvailableMembers(availableUsers);
          }
        } catch (error) {
          console.error('Error fetching available members:', error);
          toast({
            title: 'Error',
            description: 'Failed to load available members',
            variant: 'destructive'
          });
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchAvailableMembers();
  }, [user, open]);

  const handleMemberAdded = (formData: AddMemberFormData) => {
    onMemberAdded(formData);
    setOpen(false);
    
    toast({
      title: "Success",
      description: `${formData.name} has been added to the team.`,
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button 
        className="bg-fmac-red hover:bg-fmac-red/90" 
        onClick={() => setOpen(true)}
        {...props} // Pass any additional props like data-testid
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Member
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Team Member</DialogTitle>
            <DialogDescription>
              {user?.role === 'head' 
                ? "Add an existing member or create a new one for your department." 
                : "Fill out the form to add a new member to the team."}
            </DialogDescription>
          </DialogHeader>
          
          {user?.role === 'head' ? (
            <Tabs defaultValue="existing" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="existing">Existing Member</TabsTrigger>
                <TabsTrigger value="new">New Member</TabsTrigger>
              </TabsList>
              
              <TabsContent value="existing">
                <ExistingMemberTab 
                  availableMembers={availableMembers} 
                  onMemberAdded={handleMemberAdded} 
                  onCancel={handleClose}
                  isLoading={isLoading}
                />
              </TabsContent>
              
              <TabsContent value="new">
                <NewMemberForm 
                  departments={departments} 
                  onMemberAdded={handleMemberAdded}
                  onCancel={handleClose}
                />
              </TabsContent>
            </Tabs>
          ) : (
            <NewMemberForm 
              departments={departments} 
              onMemberAdded={handleMemberAdded}
              onCancel={handleClose}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddMemberDialog;
