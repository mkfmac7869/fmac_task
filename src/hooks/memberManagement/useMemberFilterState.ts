
import { useState } from 'react';
import { User, UserRole } from '@/types/auth';
import { UseMemberFilterState } from './types';

export const useMemberFilterState = (users: User[]): UseMemberFilterState => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<Record<UserRole, boolean>>({
    admin: false,
    head: false,
    member: false,
  });

  // Handle role filter checkboxes
  const handleRoleToggle = (role: UserRole) => {
    setSelectedRoles(prev => ({
      ...prev,
      [role]: !prev[role]
    }));
  };

  // Filter users based on search query and role filters
  const getFilteredUsers = () => {
    return users.filter(user => {
      // Text search
      const matchesSearch = 
        searchQuery === '' || 
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.department?.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Role filter - if no roles selected, show all
      const noRolesSelected = !Object.values(selectedRoles).some(Boolean);
      
      // Check if user has any of the selected roles
      const userRoles = user.roles || (user.role ? [user.role] : []);
      const matchesRole = noRolesSelected || userRoles.some(role => selectedRoles[role]);
      
      return matchesSearch && matchesRole;
    });
  };

  return {
    searchQuery,
    setSearchQuery,
    selectedRoles,
    handleRoleToggle,
    getFilteredUsers
  };
};
