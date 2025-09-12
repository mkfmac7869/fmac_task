
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, UserRole } from '@/types/auth';
import { FormData } from '@/hooks/memberManagement/types';
import { Form } from '@/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import MemberFormFields from './MemberFormFields';
import MemberFormActions from './MemberFormActions';
import { useMemberAuth } from '@/hooks/useMemberAuth';

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }).optional().or(z.literal('')),
  roles: z.array(z.enum(['admin', 'head', 'member'])).min(1, {
    message: "Please select at least one role.",
  }),
  department: z.string().min(2, {
    message: "Department is required."
  })
});

interface MemberFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isEditMode: boolean;
  userToEdit: User | null;
  onSubmit: (data: FormData) => Promise<void>;
  isSubmitting?: boolean;
}

const MemberFormDialog = ({
  isOpen,
  onOpenChange,
  isEditMode,
  userToEdit,
  onSubmit,
  isSubmitting: externalIsSubmitting = false
}: MemberFormDialogProps) => {
  const { isSubmitting: isAuthSubmitting, createUserAccount } = useMemberAuth();
  const isSubmitting = isAuthSubmitting || externalIsSubmitting;
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      roles: ["member"],
      department: ""
    },
  });

  // Reset form when dialog opens/closes or when userToEdit changes
  useEffect(() => {
    if (isOpen) {
      console.log("Dialog opened, resetting form with user data:", userToEdit);
      console.log("User roles:", userToEdit?.roles);
      if (isEditMode && userToEdit) {
        const formData = {
          name: userToEdit?.name || "",
          email: userToEdit?.email || "",
          password: "", // Never pass password back
          roles: userToEdit?.roles || ["member"],
          department: userToEdit?.department || ""
        };
        console.log("Setting form data:", formData);
        form.reset(formData);
      } else {
        form.reset({
          name: "",
          email: "",
          password: "",
          roles: ["member"],
          department: ""
        });
      }
    }
  }, [isOpen, userToEdit, isEditMode, form]);

  const handleSubmit = async (data: FormData) => {
    console.log(`Handling ${isEditMode ? 'edit' : 'create'} submission with data:`, data);
    
    try {
      // For new users, create account in Supabase Auth
      if (!isEditMode) {
        console.log("Creating new user account with data:", {
          name: data.name,
          roles: data.roles,
          department: data.department
        });
        
        const userData = {
          name: data.name,
          roles: data.roles,
          department: data.department
        };
        
        const success = await createUserAccount(data.email, data.password || '123456', userData);
        
        if (!success) {
          console.error("Failed to create user account");
          return;
        }
      }
      
      // Pass the form data to the parent component
      console.log("Submitting data to parent handler:", data);
      await onSubmit(data);
      
    } catch (error: any) {
      console.error("Error in form submission:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Team Member" : "Add New Team Member"}</DialogTitle>
          <DialogDescription>
            {isEditMode 
              ? "Edit user information and permissions."
              : "Create a new user account and assign roles and permissions."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <MemberFormFields form={form} isEditMode={isEditMode} />
            <MemberFormActions 
              isSubmitting={isSubmitting} 
              isEditMode={isEditMode} 
              onCancel={() => onOpenChange(false)} 
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default MemberFormDialog;
