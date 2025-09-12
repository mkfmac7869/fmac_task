
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
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { FirebaseService } from '@/lib/firebaseService';
import { UserRole } from '@/types/auth';

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

  // Helper functions for role display
  const getRoleDisplayName = (role: UserRole): string => {
    switch (role) {
      case 'admin':
        return 'Admin';
      case 'head':
        return 'Department Head';
      case 'member':
        return 'Team Member';
      default:
        return role;
    }
  };

  const getRoleDescription = (role: UserRole): string => {
    switch (role) {
      case 'admin':
        return 'Full system access';
      case 'head':
        return 'Manage department and assign tasks';
      case 'member':
        return 'Basic team member access';
      default:
        return '';
    }
  };

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
        name="roles"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Roles</FormLabel>
            <div className="space-y-3">
              {/* Selected Roles Display */}
              {field.value && field.value.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {field.value.map((role) => (
                    <Badge key={role} variant="secondary" className="flex items-center gap-2 px-3 py-1">
                      <span className="text-sm">{getRoleDisplayName(role)}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => {
                          const newRoles = field.value.filter(r => r !== role);
                          field.onChange(newRoles);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
              
              {/* Role Selection Checkboxes */}
              <div className="space-y-2">
                {(['admin', 'head', 'member'] as UserRole[]).map((role) => (
                  <div key={role} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                    <Checkbox
                      id={`role-${role}`}
                      checked={field.value?.includes(role) || false}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          const newRoles = [...(field.value || []), role];
                          field.onChange(newRoles);
                        } else {
                          const newRoles = field.value?.filter(r => r !== role) || [];
                          field.onChange(newRoles);
                        }
                      }}
                    />
                    <label htmlFor={`role-${role}`} className="text-sm font-medium cursor-pointer">
                      {getRoleDisplayName(role)}
                    </label>
                    <span className="text-xs text-gray-500">
                      {getRoleDescription(role)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default MemberFormFields;
