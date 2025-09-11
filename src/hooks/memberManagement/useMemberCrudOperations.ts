
import { useState } from 'react';
import { FormData } from './types';
import { FirebaseService } from '@/lib/firebaseService';
import { toast } from '@/hooks/use-toast';
import { User } from '@/types/auth';

export const useMemberCrudOperations = (
  users: User[],
  setUsers: React.Dispatch<React.SetStateAction<User[]>>,
  isEditMode: boolean,
  userToEdit: User | null,
  setIsDialogOpen: (open: boolean) => void,
  fetchUsers: () => Promise<void>
) => {
  const [isCrudSubmitting, setIsCrudSubmitting] = useState(false);

  const onSubmit = async (data: FormData) => {
    setIsCrudSubmitting(true);
    
    try {
      // Force admin role for special emails
      if (data.email === 'mk7869148e@gmail.com' || data.email === 'mkfmac7@gmail.com') {
        data.role = 'admin';
        data.department = data.department || 'Management';
      }

      if (isEditMode && userToEdit) {
        // Update existing user
        await FirebaseService.updateDocument('profiles', userToEdit.id, {
          name: data.name,
          role: data.role,
          department: data.department
        });

        // Update local state
        setUsers(prev => 
          prev.map(user => 
            user.id === userToEdit.id
              ? { ...user, name: data.name, role: data.role, department: data.department }
              : user
          )
        );

        toast({
          title: 'Success',
          description: 'Member updated successfully'
        });
      } else {
        // Create new user
        const newUserId = crypto.randomUUID();
        
        await FirebaseService.addDocument('profiles', {
          id: newUserId,
          email: data.email,
          name: data.name,
          role: data.role,
          department: data.department,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=42d1f5&color=fff`
        });

        // Add to local state
        const newUser: User = {
          id: newUserId,
          email: data.email,
          name: data.name,
          role: data.role,
          department: data.department,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=42d1f5&color=fff`
        };

        setUsers(prev => [newUser, ...prev]);

        toast({
          title: 'Success',
          description: 'Member added successfully'
        });
      }
      
      // Update any admin users with the correct role
      await fixAdminRoles();
      
      // Close dialog on success
      setIsDialogOpen(false);
      
    } catch (error: any) {
      console.error('Error submitting member form:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save member',
        variant: 'destructive'
      });
    } finally {
      setIsCrudSubmitting(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      // Check if this is a special admin email
      const userToDelete = users.find(u => u.id === userId);
      if (userToDelete?.email === 'mk7869148e@gmail.com' || userToDelete?.email === 'mkfmac7@gmail.com') {
        toast({
          title: 'Cannot Delete',
          description: 'This admin account cannot be deleted',
          variant: 'destructive'
        });
        return;
      }
      
      await FirebaseService.deleteDocument('profiles', userId);

      // Remove from local state
      setUsers(prev => prev.filter(user => user.id !== userId));

      toast({
        title: 'Success',
        description: 'Member removed successfully'
      });
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete member',
        variant: 'destructive'
      });
    }
  };
  
  // Function to fix admin roles for special emails
  const fixAdminRoles = async () => {
    try {
      // Find any users with admin emails but not admin roles
      const adminEmails = ['mk7869148e@gmail.com', 'mkfmac7@gmail.com'];
      
      // Get all profiles and update admin users
      const profiles = await FirebaseService.getDocuments('profiles');
      
      for (const profile of profiles) {
        if (adminEmails.includes(profile.email) && profile.role !== 'admin') {
          await FirebaseService.updateDocument('profiles', profile.id, {
            role: 'admin',
            department: 'Management'
          });
          
          console.log(`Updated admin role for ${profile.email}`);
        }
      }
      
      // Refresh local state
      await fetchUsers();
    } catch (error) {
      console.error('Error fixing admin roles:', error);
    }
  };

  return {
    onSubmit,
    handleDeleteUser,
    isCrudSubmitting,
    fixAdminRoles
  };
};
