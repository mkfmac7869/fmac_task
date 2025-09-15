
import React, { createContext, useContext } from 'react';
import { AuthContextType, User, UserRole } from '@/types/auth';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { usePermissions } from '@/hooks/usePermissions';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading, login, logout, register, signup, signInWithGoogle, updateProfile } = useFirebaseAuth();
  const { hasPermission, canViewDepartment, canManageDepartment } = usePermissions(user);

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        logout, 
        register,
        signup,
        signInWithGoogle,
        updateProfile,
        loading, 
        isLoading: loading,
        isAuthenticated: !!user,
        hasPermission,
        canViewDepartment,
        canManageDepartment
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Re-export User and UserRole types from the types file
export type { User, UserRole };
