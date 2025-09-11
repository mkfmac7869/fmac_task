
import { UserRole } from '@/types/auth';
import { UseMemberUI } from './types';

export const useMemberUI = (): UseMemberUI => {
  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return "bg-fmac-red text-white";
      case 'manager':
        return "bg-blue-500 text-white";
      case 'head':
        return "bg-green-500 text-white";
      case 'member':
        return "bg-yellow-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return {
    getRoleBadgeColor
  };
};
