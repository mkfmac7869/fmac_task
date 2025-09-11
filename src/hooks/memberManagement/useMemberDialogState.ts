
import { useState } from 'react';
import { User } from '@/types/auth';
import { UseMemberDialogState } from './types';

export const useMemberDialogState = (): UseMemberDialogState => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);

  const handleAddNewUser = () => {
    setUserToEdit(null);
    setIsEditMode(false);
    setIsDialogOpen(true);
  };

  const handleEditUser = (user: User) => {
    setUserToEdit(user);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  return {
    isDialogOpen,
    setIsDialogOpen,
    isEditMode,
    userToEdit,
    handleAddNewUser,
    handleEditUser
  };
};
