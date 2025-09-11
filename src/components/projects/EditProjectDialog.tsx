import { useState, useEffect } from 'react';
import { useTask } from '@/context/TaskContext';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { FirebaseService } from '@/lib/firebaseService';
import { Project } from '@/types/task';
import { useTeamMembers } from '@/hooks/team/useTeamMembers';
import { X } from 'lucide-react';

interface ProjectFormData {
  name: string;
  description: string;
  color: string;
  departmentId: string | null;
  members: {
    id: string;
    name: string;
    avatar: string;
    email?: string;
  }[];
}

interface Department {
  id: string;
  name: string;
}

const COLORS = [
  { name: 'Red', value: 'red' },
  { name: 'Blue', value: 'blue' },
  { name: 'Green', value: 'green' },
  { name: 'Purple', value: 'purple' },
  { name: 'Orange', value: 'orange' },
  { name: 'Pink', value: 'pink' },
  { name: 'Teal', value: 'teal' },
];

interface EditProjectDialogProps {
  project: Project;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditProjectDialog = ({ project, isOpen, onOpenChange }: EditProjectDialogProps) => {
  const { updateProject } = useTask();
  const { membersList } = useTeamMembers();
  const [formData, setFormData] = useState<ProjectFormData>({
    name: project.name || '',
    description: project.description || '',
    color: project.color || 'blue',
    departmentId: project.departmentId || null,
    members: project.members || [],
  });
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showMemberSelector, setShowMemberSelector] = useState(false);

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
      } catch (err) {
        console.error('Error fetching departments:', err);
        toast({
          title: 'Error',
          description: 'Could not load departments.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (isOpen) {
      fetchDepartments();
    }
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | string,
    field: keyof ProjectFormData
  ) => {
    if (typeof e === 'string') {
      setFormData((prev) => ({ ...prev, [field]: e }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    }
  };

  const handleMemberToggle = (member: any) => {
    setFormData(prev => {
      const isSelected = prev.members.some(m => m.id === member.id);
      if (isSelected) {
        return {
          ...prev,
          members: prev.members.filter(m => m.id !== member.id)
        };
      } else {
        return {
          ...prev,
          members: [...prev.members, {
            id: member.id,
            name: member.name,
            avatar: member.avatar,
            email: member.email
          }]
        };
      }
    });
  };

  const removeMember = (memberId: string) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.filter(m => m.id !== memberId)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: 'Error',
        description: 'Project name is required.',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    
    try {
      await updateProject(project.id, {
        name: formData.name,
        description: formData.description,
        color: formData.color,
        departmentId: formData.departmentId,
        members: formData.members
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>
              Update project details. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">
                Project Name
              </label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange(e, 'name')}
                placeholder="Project name"
                required
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange(e, 'description')}
                placeholder="Project description"
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="department" className="text-sm font-medium">
                Department
              </label>
              <Select
                value={formData.departmentId || undefined}
                onValueChange={(value) => handleChange(value, 'departmentId')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.length > 0 ? (
                    departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none">No departments available</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="color" className="text-sm font-medium">
                Color
              </label>
              <Select
                value={formData.color}
                onValueChange={(value) => handleChange(value, 'color')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select color" />
                </SelectTrigger>
                <SelectContent>
                  {COLORS.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      <div className="flex items-center">
                        <div className={`h-3 w-3 rounded-full bg-${color.value}-500 mr-2`} />
                        <span>{color.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <label className="text-sm font-medium">
                Team Members
              </label>
              
              {/* Selected Members */}
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.members.map((member) => (
                  <Badge key={member.id} variant="secondary" className="flex items-center gap-1">
                    <img 
                      src={member.avatar} 
                      alt={member.name}
                      className="h-4 w-4 rounded-full"
                    />
                    {member.name}
                    <button
                      type="button"
                      onClick={() => removeMember(member.id)}
                      className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              
              {/* Add Members Button */}
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowMemberSelector(!showMemberSelector)}
                className="w-full"
              >
                {showMemberSelector ? 'Hide Members' : 'Add Team Members'}
              </Button>
              
              {/* Member Selection */}
              {showMemberSelector && (
                <div className="border rounded-md p-3 max-h-48 overflow-y-auto">
                  <div className="space-y-2">
                    {membersList.map((member) => {
                      const isSelected = formData.members.some(m => m.id === member.id);
                      return (
                        <div key={member.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`member-${member.id}`}
                            checked={isSelected}
                            onCheckedChange={() => handleMemberToggle(member)}
                          />
                          <label
                            htmlFor={`member-${member.id}`}
                            className="flex items-center space-x-2 cursor-pointer flex-1"
                          >
                            <img 
                              src={member.avatar} 
                              alt={member.name}
                              className="h-6 w-6 rounded-full"
                            />
                            <div>
                              <div className="text-sm font-medium">{member.name}</div>
                              <div className="text-xs text-gray-500">{member.role} • {member.department}</div>
                            </div>
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProjectDialog;
