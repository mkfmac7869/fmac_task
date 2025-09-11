
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/Layout';
import DepartmentList from '@/components/departments/DepartmentList';
import AddDepartmentDialog from '@/components/departments/AddDepartmentDialog';
import { User, UserRole } from '@/types/auth';
import { db } from '@/lib/firebaseClient';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { DepartmentService, UserService, AuthService } from '@/lib/firebaseService';
import { toast } from '@/hooks/use-toast';

export type Department = {
  id: string;
  name: string;
  head?: User;
  description?: string;
  memberCount: number;
};

const DepartmentManagement = () => {
  const auth = useAuth();
  const user = auth?.user;
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch departments from Supabase
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setIsLoading(true);
        console.log("Fetching departments with user:", user);
        
        // Only proceed if user is authenticated
        if (!user) {
          console.log("No user found, skipping department fetch");
          setIsLoading(false);
          return;
        }

        // Ensure user has permission to view departments
        if (user.role !== 'admin' && user.role !== 'head') {
          console.log("User doesn't have permission to view departments");
          setIsLoading(false);
          return;
        }

        // Get the JWT token to ensure authentication header is sent
        const { data: authData } = await AuthService.getSession();
        console.log("Auth session data:", authData?.session ? "Session exists" : "No session");

        // Get departments
        const departmentsData = await DepartmentService.getDepartments();

        // No error handling needed for Firebase service

        console.log("Departments data fetched:", departmentsData);

        if (!departmentsData || departmentsData.length === 0) {
          console.log("No departments found");
          setDepartments([]);
          setIsLoading(false);
          return;
        }

        // Now we need to fetch the department heads for each department
        const departmentsWithHeads = await Promise.all(
          departmentsData.map(async (dept) => {
            let head = undefined;
            let memberCount = 0;
            
            if (dept.head_id) {
              // Fetch the head user's profile
              const headData = await UserService.getUserById(dept.head_id);
              
              if (headData) {
                head = {
                  id: headData.id,
                  name: headData.name || 'Unknown',
                  email: headData.email || '',
                  role: (headData.role as UserRole) || 'member',
                  department: headData.department || '',
                  avatar: headData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(headData.name || 'User')}&background=ea384c&color=fff`
                };
              }
            }
            
            // Count members in this department
            const members = await UserService.getUsersByDepartment(dept.name);
            memberCount = members.length;
            
            return {
              id: dept.id,
              name: dept.name,
              head: head,
              description: dept.description || `${dept.name} department`,
              memberCount
            };
          })
        );
        
        console.log("Departments with heads:", departmentsWithHeads);
        setDepartments(departmentsWithHeads);
      } catch (error) {
        console.error('Error fetching departments:', error);
        toast({
          title: "Error",
          description: "Failed to fetch departments",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDepartments();
  }, [user]);

  const handleAddDepartment = async (department: Omit<Department, 'id' | 'memberCount'>) => {
    try {
      console.log("Creating new department:", department);
      
      // Make sure the user has admin privileges
      if (!user || user.role !== 'admin') {
        toast({
          title: "Permission Denied",
          description: "Only administrators can add departments",
          variant: "destructive"
        });
        return;
      }
      
      // Verify authentication before proceeding
      const { data: authData } = await AuthService.getSession();
      if (!authData?.session) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to create departments",
          variant: "destructive"
        });
        return;
      }
      
      console.log("Auth session data on create:", authData?.session ? "Session exists" : "No session");
      
      // Prepare data for insert
      const insertData = {
        name: department.name,
        description: department.description || null,
        head_id: department.head?.id || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      console.log("Inserting department data:", insertData);
      
      // Create the department
      const data = await DepartmentService.createDepartment(insertData);
      
      console.log("Department created:", data);
      
      // Add the new department to state
      const newDepartment: Department = {
        id: data.id,
        name: data.name,
        head: department.head,
        description: data.description || `${data.name} department`,
        memberCount: 0
      };
      
      setDepartments([...departments, newDepartment]);
      
      toast({
        title: "Department created",
        description: `${department.name} department has been created.`
      });
    } catch (error: any) {
      console.error('Error creating department:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create department",
        variant: "destructive"
      });
    }
  };

  const handleUpdateDepartment = async (updatedDepartment: Department) => {
    try {
      await DepartmentService.updateDepartment(updatedDepartment.id, {
        name: updatedDepartment.name,
        description: updatedDepartment.description,
        head_id: updatedDepartment.head?.id
      });
      
      // Update the department in state
      setDepartments(departments.map(dept => 
        dept.id === updatedDepartment.id ? updatedDepartment : dept
      ));
      
      toast({
        title: "Department updated",
        description: `${updatedDepartment.name} department has been updated.`
      });
    } catch (error: any) {
      console.error('Error updating department:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update department",
        variant: "destructive"
      });
    }
  };

  const handleDeleteDepartment = async (departmentId: string) => {
    try {
      await DepartmentService.deleteDepartment(departmentId);
      
      // Remove the department from state
      setDepartments(departments.filter(dept => dept.id !== departmentId));
      
      toast({
        title: "Department deleted",
        description: "The department has been removed."
      });
    } catch (error: any) {
      console.error('Error deleting department:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete department",
        variant: "destructive"
      });
    }
  };

  // Get available users who could be department heads
  const getAvailableHeads = async (): Promise<User[]> => {
    try {
      console.log("Fetching available heads");
      
      // First check if we have a session
      const { data: { session } } = await AuthService.getSession();
      if (!session) {
        console.error("No active session found");
        return [];
      }
      
      // Fetch all users with role 'member' or 'head'
      const data = await UserService.getUsers();
      
      // Filter users with role 'member' or 'head'
      const filteredUsers = data.filter(user => user.role === 'member' || user.role === 'head');
      
      if (!filteredUsers || filteredUsers.length === 0) {
        console.log("No users found");
        return [];
      }
      
      console.log("Available users:", filteredUsers);
      
      // Filter out users who are already department heads
      const currentHeadIds = departments
        .filter(dept => dept.head)
        .map(dept => dept.head?.id);
      
      const availableHeads = filteredUsers
        .filter(user => user.role === 'member' || !currentHeadIds.includes(user.id))
        .map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role as UserRole,
          department: user.department,
          avatar: user.avatar
        }));
      
      console.log("Available heads:", availableHeads);
      return availableHeads;
    } catch (error) {
      console.error('Error fetching available heads:', error);
      return [];
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Department Management</h1>
          {user && user.role === 'admin' && (
            <AddDepartmentDialog 
              onDepartmentAdded={handleAddDepartment}
              getAvailableHeads={getAvailableHeads}
            />
          )}
        </div>

        <DepartmentList 
          departments={departments} 
          onUpdateDepartment={handleUpdateDepartment}
          onDeleteDepartment={handleDeleteDepartment}
          getAvailableHeads={getAvailableHeads}
          isLoading={isLoading}
        />
      </div>
    </Layout>
  );
};

export default DepartmentManagement;
