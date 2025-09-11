
import { useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormData } from '@/hooks/memberManagement/types';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { FirebaseService } from '@/lib/firebaseService';

interface MemberFormFieldsProps {
  form: UseFormReturn<FormData>;
  isEditMode: boolean;
}

interface Department {
  id: string;
  name: string;
}

const MemberFormFields = ({ form, isEditMode }: MemberFormFieldsProps) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch departments from Firebase
  useEffect(() => {
    const fetchDepartments = async () => {
      setIsLoading(true);
      try {
        const data = await FirebaseService.getDocuments('departments');
        
        if (data && data.length > 0) {
          const formattedDepartments = data.map(dept => ({
            id: dept.id,
            name: dept.name
          }));
          setDepartments(formattedDepartments);
        }
      } catch (error) {
        console.error("Failed to fetch departments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter full name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input 
                type="email" 
                placeholder="Email address" 
                {...field} 
                disabled={isEditMode} // Email can't be changed for existing users
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {!isEditMode && (
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Set a password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      
      <FormField
        control={form.control}
        name="department"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Department</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              value={field.value}
              disabled={isLoading}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a department" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.name}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="role"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Role</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="head">Department Head</SelectItem>
                <SelectItem value="member">Team Member</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default MemberFormFields;
