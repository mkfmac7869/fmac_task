
import { User, UserRole } from '../types/auth';

export const useAuthUtils = () => {
  // Check if user has permission for a specific action
  const hasPermission = (user: User | null, action: string): boolean => {
    if (!user || !user.roles || user.roles.length === 0) return false;

    // Admin has all permissions
    if (user.roles.includes('admin')) return true;

    // Define permissions based on roles and action
    switch (action) {
      case 'create_task':
        return user.roles.some(role => ['admin', 'head', 'member'].includes(role));
      case 'delete_task':
        return user.roles.some(role => ['admin', 'head'].includes(role));
      case 'delete_comments':
        return user.roles.some(role => ['admin', 'head'].includes(role));
      case 'view_reports':
        return user.roles.some(role => ['admin', 'head'].includes(role));
      case 'manage_users':
        return user.roles.includes('admin');
      case 'assign_tasks_all':
        return user.roles.includes('admin');
      case 'assign_tasks_department':
        return user.roles.some(role => ['admin', 'head'].includes(role));
      case 'assign_tasks_self':
        return user.roles.some(role => ['admin', 'head', 'member'].includes(role));
      case 'add_team_members':
        return user.roles.some(role => ['admin', 'head'].includes(role));
      case 'add_department':
        return user.roles.includes('admin');
      case 'edit_department':
        return user.roles.includes('admin');
      case 'create_project':
        return user.roles.some(role => ['admin', 'head', 'member'].includes(role));
      case 'view_all_projects':
        return user.roles.includes('admin');
      case 'view_department_projects':
        return user.roles.some(role => ['admin', 'head'].includes(role));
      case 'view_assigned_projects':
        return user.roles.some(role => ['admin', 'head', 'member'].includes(role));
      default:
        return false;
    }
  };

  // Check if user can view a specific department
  const canViewDepartment = (user: User | null, department: string): boolean => {
    if (!user || !user.roles || user.roles.length === 0) return false;
    
    // Admin can view all departments
    if (user.roles.includes('admin')) return true;
    
    // Department heads and members can only view their own department
    return user.department === department;
  };

  // Check if user can manage a specific department
  const canManageDepartment = (user: User | null, department: string): boolean => {
    if (!user || !user.roles || user.roles.length === 0) return false;
    
    // Admin can manage all departments
    if (user.roles.includes('admin')) return true;
    
    // Department heads can only manage their own department
    if (user.roles.includes('head') && user.department === department) return true;
    
    // Others cannot manage departments
    return false;
  };

  // Check if user can assign tasks to a specific user
  const canAssignTaskTo = (user: User | null, targetUser: User | null): boolean => {
    if (!user || !targetUser || !user.roles || user.roles.length === 0) return false;
    
    // Admin can assign to anyone
    if (user.roles.includes('admin')) return true;
    
    // Head can assign to members in their department
    if (user.roles.includes('head') && user.department === targetUser.department) return true;
    
    // Members can only assign to themselves
    if (user.roles.includes('member') && user.id === targetUser.id) return true;
    
    return false;
  };

  // Check if user can view a specific project
  const canViewProject = (user: User | null, project: any): boolean => {
    if (!user || !user.roles || user.roles.length === 0) return false;
    
    // Admin can view all projects
    if (user.roles.includes('admin')) return true;
    
    // Head can view projects in their department
    if (user.roles.includes('head') && user.department === project.departmentId) return true;
    
    // Members can view projects they are assigned to
    if (user.roles.includes('member') && project.members?.some((member: any) => member.id === user.id)) return true;
    
    return false;
  };

  return {
    hasPermission,
    canViewDepartment,
    canManageDepartment,
    canAssignTaskTo,
    canViewProject,
  };
};
