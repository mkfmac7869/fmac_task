
import { useState, useEffect, useCallback } from 'react';
import { UserService, DepartmentService } from '@/lib/firebaseService';
import { useAuth } from '@/context/AuthContext';
import { useTask } from '@/context/TaskContext';
import { toast } from '@/hooks/use-toast';
import { TeamMember } from '@/components/team/TeamMemberCard';

export const useTeamMembers = () => {
  const [membersList, setMembersList] = useState<TeamMember[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { tasks } = useTask();

  // Calculate task statistics for a member
  const calculateMemberTaskStats = (memberId: string) => {
    const memberTasks = tasks.filter(task => task.assignee && task.assignee.id === memberId);
    const tasksCompleted = memberTasks.filter(task => task.status === 'completed').length;
    const tasksInProgress = memberTasks.filter(task => task.status === 'in_progress').length;
    
    return { tasksCompleted, tasksInProgress };
  };

  const fetchTeamData = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);

    try {
      // Fetch departments first
      const deptData = await DepartmentService.getDepartments();

      console.info("Departments data fetched:", deptData);
      if (deptData && deptData.length > 0) {
        const departmentNames = deptData.map(d => d.name);
        setDepartments(departmentNames);
      } else {
        console.info("No departments found");
        
        // Create default department if none exist
        if (user.role === 'admin') {
          try {
            await DepartmentService.createDepartment({
              name: 'Management',
              description: 'Management department'
            });
            setDepartments(['Management']);
          } catch (insertError) {
            console.error("Error creating default department:", insertError);
            setDepartments([]);
          }
        } else {
          setDepartments([]);
        }
      }

      // Fetch all profiles for admin, only department profiles for others
      let usersData;
      
      console.log("Current user role check:", {
        userRole: user.role,
        userRoles: user.roles,
        isAdmin: user.role === 'admin' || user.roles?.includes('admin'),
        userDepartment: user.department
      });
      
      // Check user role for member access permissions
      const isAdmin = user.role === 'admin' || user.roles?.includes('admin');
      const isDeptHead = user.role === 'head' || user.roles?.includes('head');
      
      if (isAdmin) {
        console.log("Admin user - fetching ALL members");
        usersData = await UserService.getUsers();
      } else if (isDeptHead && user.department) {
        console.log("Department Head - fetching department members only");
        usersData = await UserService.getUsersByDepartment(user.department);
      } else if (user.department) {
        console.log("Regular member - fetching department members only");
        usersData = await UserService.getUsersByDepartment(user.department);
      } else {
        console.log("User with no department - fetching all members");
        usersData = await UserService.getUsers();
      }

      console.info("Team member data fetched:", {
        count: usersData?.length || 0,
        members: usersData?.map(u => ({ id: u.id, name: u.name, department: u.department, role: u.role })) || []
      });
      if (usersData && usersData.length > 0) {
        // Transform data for display
        const formattedMembers = usersData.map((member) => {
          // Calculate real task statistics
          const { tasksCompleted, tasksInProgress } = calculateMemberTaskStats(member.id);

          return {
            id: member.id,
            name: member.name || 'Unknown user',
            email: member.email,
            phone: '', // Add default empty phone property
            avatar: member.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name || 'User')}`,
            role: member.role || 'member',
            department: member.department || 'Unassigned',
            tasksCompleted,
            tasksInProgress
          };
        });

        setMembersList(formattedMembers);
      } else {
        console.info("No team members found");
        setMembersList([]);
      }
    } catch (err) {
      console.error("Unexpected error fetching team data:", err);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [user]); // Remove tasks from dependency array

  useEffect(() => {
    fetchTeamData();
  }, [fetchTeamData]);

  // Update task statistics when tasks change (without refetching team members)
  useEffect(() => {
    if (membersList.length > 0) {
      const updatedMembers = membersList.map(member => {
        const { tasksCompleted, tasksInProgress } = calculateMemberTaskStats(member.id);
        return {
          ...member,
          tasksCompleted,
          tasksInProgress
        };
      });
      setMembersList(updatedMembers);
    }
  }, [tasks]); // Only update when tasks change

  const handleAddMember = async (newMember: Omit<TeamMember, 'id' | 'avatar' | 'tasksCompleted' | 'tasksInProgress'>) => {
    try {
      // Generate avatar
      const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(newMember.name)}&background=42d1f5&color=fff`;
      
      // Insert into profiles collection
      const data = await UserService.upsertProfile(crypto.randomUUID(), {
        email: newMember.email,
        name: newMember.name,
        role: newMember.role,
        department: newMember.department,
        avatar: avatar
      });
      
      // Calculate real task statistics for the new member
      const { tasksCompleted, tasksInProgress } = calculateMemberTaskStats(data.id);
      
      // Add to local state
      setMembersList(prev => [...prev, {
        ...newMember,
        id: data.id,
        avatar,
        tasksCompleted,
        tasksInProgress
      }]);
      
      toast({
        title: 'Success',
        description: 'Team member added successfully',
      });
      
      // Refresh data
      fetchTeamData();
      
    } catch (err) {
      console.error("Unexpected error adding team member:", err);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive'
      });
    }
  };

  return { membersList, departments, isLoading, handleAddMember, fetchTeamData };
};
