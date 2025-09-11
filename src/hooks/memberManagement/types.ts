
import { User, UserRole } from '@/types/auth';

export type FormData = {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  department: string;
};

export interface UseMemberFilterState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedRoles: Record<UserRole, boolean>;
  handleRoleToggle: (role: UserRole) => void;
  getFilteredUsers: () => User[];
}

export interface UseMemberDialogState {
  isDialogOpen: boolean;
  setIsDialogOpen: (isOpen: boolean) => void;
  isEditMode: boolean;
  userToEdit: User | null;
  handleAddNewUser: () => void;
  handleEditUser: (user: User) => void;
}

export interface UseMemberCrudOperations {
  handleDeleteUser: (userId: string) => Promise<void>;
  onSubmit: (data: FormData) => Promise<void>;
  isSubmitting: boolean;
}

export interface UseMemberUI {
  getRoleBadgeColor: (role: UserRole) => string;
}
