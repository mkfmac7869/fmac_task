
import { useMemberFilterState } from './useMemberFilterState';
import { useMemberDialogState } from './useMemberDialogState';
import { useMemberCrudOperations } from './useMemberCrudOperations';
import { useMemberUI } from './useMemberUI';
import { useFetchMembers } from './useFetchMembers';

export const useMemberManagement = () => {
  const { users, setUsers, isLoading, fetchUsers } = useFetchMembers();
  
  const { 
    searchQuery, 
    setSearchQuery, 
    selectedRoles, 
    handleRoleToggle, 
    getFilteredUsers 
  } = useMemberFilterState(users);
  
  const { 
    isDialogOpen, 
    setIsDialogOpen, 
    isEditMode, 
    userToEdit, 
    handleAddNewUser, 
    handleEditUser 
  } = useMemberDialogState();
  
  const { 
    handleDeleteUser, 
    onSubmit, 
    isCrudSubmitting 
  } = useMemberCrudOperations(
    users, 
    setUsers, 
    isEditMode, 
    userToEdit, 
    setIsDialogOpen,
    fetchUsers
  );
  
  const { getRoleBadgeColor, getRoleDisplayName } = useMemberUI();

  return {
    users,
    isLoading,
    searchQuery,
    setSearchQuery,
    selectedRoles,
    handleRoleToggle,
    getFilteredUsers,
    isDialogOpen,
    setIsDialogOpen,
    isEditMode,
    userToEdit,
    handleAddNewUser,
    handleEditUser,
    handleDeleteUser,
    getRoleBadgeColor,
    getRoleDisplayName,
    onSubmit,
    isCrudSubmitting,
    fetchUsers
  };
};

export type { FormData } from './types';
