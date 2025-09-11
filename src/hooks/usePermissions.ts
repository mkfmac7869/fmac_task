
import { User } from '@/types/auth';
import { useAuthUtils } from '@/hooks/useAuthUtils';

export const usePermissions = (user: User | null) => {
  const { hasPermission: checkPermission, canViewDepartment: checkCanViewDepartment, canManageDepartment: checkCanManageDepartment } = useAuthUtils();

  // Wrapper functions using the utility hooks with the current user
  const hasPermission = (action: string): boolean => {
    return checkPermission(user, action);
  };

  const canViewDepartment = (department: string): boolean => {
    return checkCanViewDepartment(user, department);
  };

  const canManageDepartment = (department: string): boolean => {
    return checkCanManageDepartment(user, department);
  };

  return {
    hasPermission,
    canViewDepartment,
    canManageDepartment
  };
};
