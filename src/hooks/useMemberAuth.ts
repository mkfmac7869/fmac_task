
import { useState } from 'react';
import { AuthService, UserService } from '@/lib/firebaseService';
import { toast } from '@/hooks/use-toast';
import { UserRole } from '@/types/auth';

export const useMemberAuth = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createUserAccount = async (email: string, password: string, userData: Record<string, any>) => {
    setIsSubmitting(true);
    
    try {
      console.log("Creating user with data:", userData);
      
      // Make sure the role is explicitly set
      const role = userData.role || 'member';
      console.log("Setting user role to:", role);
      
      // Create the auth user and profile
      const { error: signUpError, data } = await AuthService.signUp(email, password || '123456', {
        ...userData,
        role: role
      });

      if (signUpError) {
        console.error("Error creating user account:", signUpError);
        toast({
          title: "Error creating user account",
          description: signUpError.message,
          variant: "destructive"
        });
        return false;
      }
      
      // Profile is automatically created in AuthService.signUp
      if (data && data.user) {
        console.log("User account created successfully:", data.user.id);
        console.log("With role:", role);
        console.log("And department:", userData.department);
      }
      
      toast({
        title: "User account created",
        description: "An email has been sent to the user with a verification link.",
      });
      return true;
    } catch (error: any) {
      console.error("Error in user creation:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create user account",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const createDepartmentHead = async (email: string, password: string, name: string, department: string) => {
    try {
      // Create user account with explicit head role
      const userData = {
        name,
        role: 'head', // Explicitly set as 'head'
        department
      };
      
      console.log("Creating department head with data:", userData);
      const result = await createUserAccount(email, password, userData);
      return result;
    } catch (error: any) {
      console.error("Error creating department head:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create department head",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    isSubmitting,
    createUserAccount,
    createDepartmentHead
  };
};
