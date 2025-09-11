
import { User, UserRole } from '../types/auth';

export const useAuthUtils = () => {
  // Check if user has permission for a specific action
  const hasPermission = (user: User | null, action: string): boolean => {
    if (!user) return false;

    // Admin has all permissions
    if (user.role === 'admin') return true;

    // Define permissions based on role and action
    switch (action) {
      case 'create_task':
        return ['admin', 'manager', 'head', 'member'].includes(user.role);
      case 'delete_task':
        return ['admin', 'manager', 'head'].includes(user.role);
      case 'delete_comments':
        return ['admin', 'manager', 'head'].includes(user.role);
      case 'view_reports':
        return ['admin', 'manager', 'head'].includes(user.role);
      case 'manage_users':
        return ['admin', 'manager'].includes(user.role);
      case 'assign_tasks_all':
        return ['admin', 'manager'].includes(user.role);
      case 'assign_tasks_department':
        return ['admin', 'manager', 'head'].includes(user.role);
      case 'add_team_members':
        return ['admin', 'head'].includes(user.role);
      case 'add_department':
        return ['admin'].includes(user.role);
      case 'edit_department':
        return ['admin'].includes(user.role);
      default:
        return false;
    }
  };

  // Check if user can view a specific department
  const canViewDepartment = (user: User | null, department: string): boolean => {
    if (!user) return false;
    
    // Admin can view all departments
    if (user.role === 'admin') return true;
    
    // Department heads and members can only view their own department
    return user.department === department;
  };

  // Check if user can manage a specific department
  const canManageDepartment = (user: User | null, department: string): boolean => {
    if (!user) return false;
    
    // Admin can manage all departments
    if (user.role === 'admin') return true;
    
    // Department heads can only manage their own department
    if (user.role === 'head') return user.department === department;
    
    // Others cannot manage departments
    return false;
  };

  return {
    hasPermission,
    canViewDepartment,
    canManageDepartment,
  };
};
