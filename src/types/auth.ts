
// Define user roles
export type UserRole = 'admin' | 'head' | 'member';

// Define the User interface
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  roles: UserRole[]; // Changed from single role to array of roles
  bio?: string;
  department?: string;
  isApproved: boolean; // New field for approval status
  approvedBy?: string; // ID of the admin/head who approved
  approvedAt?: Date; // When the user was approved
  createdAt: Date; // When the user was created
}

// Define what the context will provide
export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  updateProfile: (userData: Partial<User>) => void;
  loading: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasPermission: (action: string) => boolean;
  canViewDepartment: (department: string) => boolean;
  canManageDepartment: (department: string) => boolean;
}
