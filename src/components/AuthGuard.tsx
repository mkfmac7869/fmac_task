
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface AuthGuardProps {
  children?: React.ReactNode; // Make children optional with ?
  requireAuth?: boolean;
  requiredRole?: 'admin' | 'manager' | 'head' | 'member' | null;
  requiredDepartment?: string | null;
  requiredPermission?: string | null;
}

const AuthGuard = ({ 
  children, 
  requireAuth = true,
  requiredRole = null,
  requiredDepartment = null,
  requiredPermission = null
}: AuthGuardProps) => {
  const { isAuthenticated, isLoading, user, hasPermission, canViewDepartment } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-fmac-red border-t-transparent"></div>
      </div>
    );
  }

  // Check authentication first
  if (requireAuth && !isAuthenticated) {
    console.log("AuthGuard - Not authenticated, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role if required
  if (requiredRole && isAuthenticated && user?.role !== requiredRole) {
    return <Navigate to="/dashboard" state={{ message: "You don't have permission to access this page" }} replace />;
  }
  
  // Check department if required
  if (requiredDepartment && isAuthenticated && !canViewDepartment(requiredDepartment)) {
    return <Navigate to="/dashboard" state={{ message: "You don't have access to this department" }} replace />;
  }
  
  // Check specific permission if required
  if (requiredPermission && isAuthenticated && !hasPermission(requiredPermission)) {
    return <Navigate to="/dashboard" state={{ message: "You don't have the required permission" }} replace />;
  }

  // Redirect authenticated users from auth pages
  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Return either the children or the Outlet component
  return children || <Outlet />;
};

export default AuthGuard;
