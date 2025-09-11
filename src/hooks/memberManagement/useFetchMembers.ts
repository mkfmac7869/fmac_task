
import { useState, useEffect } from 'react';
import { User, UserRole } from '@/types/auth';
import { UserService, AuthService } from '@/lib/firebaseService';
import { toast } from '@/hooks/use-toast';

export const useFetchMembers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // Get auth session to ensure we have authentication
      const { data: authData } = await AuthService.getSession();
      console.log("Auth session active:", authData?.session ? "yes" : "no");

      // Get all users from the profiles collection
      const data = await UserService.getUsers();

      if (data && data.length > 0) {
        // Map the data to match our User type
        const formattedUsers: User[] = data.map(profile => ({
          id: profile.id,
          name: profile.name || 'Unknown',
          email: profile.email || '',
          role: (profile.role as UserRole) || 'member',
          avatar: profile.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name || 'User')}&background=ea384c&color=fff`,
          department: profile.department || ''
        }));
        
        console.log("Fetched users:", formattedUsers);
        setUsers(formattedUsers);
      } else {
        // If no users found, check if we need to create a demo user
        const { data: { session } } = await AuthService.getSession();
        
        if (session?.user) {
          console.log("Creating profile for current user if needed");
          
          // Check if profile exists for current user
          const existingProfile = await UserService.getUserById(session.user.id);
            
          if (!existingProfile) {
            // Create profile for current user
            try {
              await UserService.upsertProfile(session.user.id, {
                email: session.user.email || 'admin@example.com',
                name: 'Admin User', 
                avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=ea384c&color=fff',
                role: 'admin',
                department: 'Management'
              });
              
              // Re-fetch users after creating profile
              const updatedData = await UserService.getUsers();
              if (updatedData && updatedData.length > 0) {
                const formattedUsers: User[] = updatedData.map(profile => ({
                  id: profile.id,
                  name: profile.name || 'Unknown',
                  email: profile.email || '',
                  role: (profile.role as UserRole) || 'member',
                  avatar: profile.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name || 'User')}&background=ea384c&color=fff`,
                  department: profile.department || ''
                }));
                setUsers(formattedUsers);
              }
            } catch (profileError) {
              console.error("Error creating admin profile:", profileError);
            }
          }
        }
        
        console.log("No users found in the database");
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error fetching users",
        description: "Failed to load users. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { users, setUsers, isLoading, fetchUsers };
};
