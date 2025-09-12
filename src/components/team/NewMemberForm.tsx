
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebaseClient';
import { collection, addDoc } from 'firebase/firestore';
import { toast } from '@/hooks/use-toast';
import { useMemberAuth } from '@/hooks/useMemberAuth';

interface NewMemberFormProps {
  departments: string[];
  onMemberAdded: (member: any) => void;
  onCancel: () => void;
}

const NewMemberForm = ({ departments, onMemberAdded, onCancel }: NewMemberFormProps) => {
  const { user } = useAuth();
  const { createUserAccount, createDepartmentHead, isSubmitting } = useMemberAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: user?.roles?.includes('head') ? 'member' : '',
    department: user?.roles?.includes('head') ? user.department || '' : ''
  });
  
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.role || !formData.department) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Use the member auth hook for creating users
      let success = false;
      
      if (formData.role === 'head') {
        // Create department head
        success = await createDepartmentHead(
          formData.email,
          '123456', // Default password
          formData.name,
          formData.department
        );
      } else {
        // Create regular user
        const userData = {
          name: formData.name,
          role: formData.role,
          department: formData.department
        };
        
        success = await createUserAccount(
          formData.email,
          '123456', // Default password
          userData
        );
      }
      
      if (success) {
        onMemberAdded({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
          department: formData.department
        });
      }
    } catch (error: any) {
      console.error('Error creating new team member:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create team member",
        variant: "destructive"
      });
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-2">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input 
          id="name"
          placeholder="John Doe"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email"
          type="email"
          placeholder="john@example.com"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Phone (optional)</Label>
        <Input 
          id="phone"
          placeholder="+1 (234) 567-8901"
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Select 
          value={formData.role} 
          onValueChange={(value) => handleChange('role', value)}
          disabled={user?.roles?.includes('head')}
        >
          <SelectTrigger id="role">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            {user?.roles?.includes('admin') && (
              <>
                <SelectItem value="head">Department Head</SelectItem>
                <SelectItem value="member">Team Member</SelectItem>
              </>
            )}
            {user?.roles?.includes('head') && (
              <SelectItem value="member">Team Member</SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
      
      {user?.roles?.includes('admin') && (
        <div className="space-y-2">
          <Label htmlFor="department">Department</Label>
          <Select 
            value={formData.department} 
            onValueChange={(value) => handleChange('department', value)}
          >
            <SelectTrigger id="department">
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-fmac-red hover:bg-fmac-red/90"
        >
          {isSubmitting ? "Creating..." : "Add Member"}
        </Button>
      </div>
    </form>
  );
};

export default NewMemberForm;
