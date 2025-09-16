import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { UserService } from '@/lib/firebaseService';

interface AssignableUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  department: string;
}

export const useTaskAssignmentPermissions = () => {
  const { user } = useAuth();
  const [assignableUsers, setAssignableUsers] = useState<AssignableUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Determine user's permission level
  const permissionLevel = useMemo(() => {
    if (!user || !user.roles) return 'none';
    
    if (user.roles.includes('admin')) return 'admin';
    if (user.roles.includes('head')) return 'head';
    if (user.roles.includes('member')) return 'member';
    
    return 'none';
  }, [user]);

  // Check if current user can assign tasks to a specific user
  const canAssignTo = (targetUserId: string): boolean => {
    if (!user) return false;

    const targetUser = assignableUsers.find(u => u.id === targetUserId);
    if (!targetUser) return false;

    switch (permissionLevel) {
      case 'admin':
        // Admin can assign to anyone
        return true;
      
      case 'head':
        // Department head can assign to themselves and members in their department
        return targetUser.id === user.id || targetUser.department === user.department;
      
      case 'member':
        // Regular members can only assign to themselves
        return targetUser.id === user.id;
      
      default:
        return false;
    }
  };

  // Fetch assignable users based on permission level
  const fetchAssignableUsers = useCallback(async () => {
    console.log("fetchAssignableUsers called", { user: user?.name, permissionLevel });
    
    if (!user) {
      console.log("No user found, setting empty assignable users");
      setAssignableUsers([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      let usersData;

      switch (permissionLevel) {
        case 'admin':
          // Admin can see all users
          console.log("Admin - fetching all users for task assignment");
          usersData = await UserService.getUsers();
          break;
        
        case 'head':
          // Department head can see users in their department
          console.log("Department Head - fetching department users for task assignment");
          if (user.department) {
            usersData = await UserService.getUsersByDepartment(user.department);
          } else {
            usersData = []; // No department, can't assign to anyone except self
          }
          break;
        
        case 'member':
          // Regular member can only see themselves
          console.log("Member - can only assign to self");
          usersData = [user]; // Only themselves
          break;
        
        default:
          usersData = [];
      }

      if (usersData && usersData.length > 0) {
        const formattedUsers = usersData.map((userData) => ({
          id: userData.id,
          name: userData.name || 'Unknown user',
          email: userData.email || '',
          avatar: userData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name || 'User')}`,
          role: userData.role || 'member',
          department: userData.department || 'Unassigned'
        }));

        setAssignableUsers(formattedUsers);
        
        console.log("Assignable users fetched:", {
          permissionLevel,
          userDepartment: user.department,
          count: formattedUsers.length,
          users: formattedUsers.map(u => ({ id: u.id, name: u.name, department: u.department }))
        });
      } else {
        setAssignableUsers([]);
      }
    } catch (err) {
      console.error("Error fetching assignable users:", err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setAssignableUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, [user, permissionLevel]);

  useEffect(() => {
    fetchAssignableUsers();
  }, [fetchAssignableUsers]);

  return {
    assignableUsers,
    isLoading,
    permissionLevel,
    canAssignTo,
    refetch: fetchAssignableUsers,
    error
  };
};
