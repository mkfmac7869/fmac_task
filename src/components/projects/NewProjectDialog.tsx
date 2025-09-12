
import { useState, useEffect } from 'react';
import { useTask } from '@/context/TaskContext';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlusCircle, X, Users } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { FirebaseService } from '@/lib/firebaseService';
import { useTeamMembers } from '@/hooks/team/useTeamMembers';

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

const NewProjectDialog = () => {
  const { addProject } = useTask();
  const { membersList } = useTeamMembers();
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    description: '',
    color: 'blue',
    departmentId: null,
    members: [],
  });
  const [isOpen, setIsOpen] = useState(false);
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
    
    if (!formData.name || !formData.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await addProject({
        name: formData.name,
        description: formData.description,
        color: formData.color,
        departmentId: formData.departmentId,
        members: formData.members
      });
      
      toast({
        title: "Success",
        description: "Project created successfully!",
      });
      
      setFormData({
        name: '',
        description: '',
        color: 'blue',
        departmentId: null,
        members: [],
      });
      setIsOpen(false);
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-fmac-red hover:bg-fmac-red/90">
          <PlusCircle className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Add a new project to manage tasks. Click save when you're done.
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
                required
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
            
            {/* Team Members Selection */}
            <div className="grid gap-2">
              <label className="text-sm font-medium">Team Members</label>
              
              {/* Selected Members Display */}
              {formData.members.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.members.map((member) => (
                    <Badge key={member.id} variant="secondary" className="flex items-center gap-2 px-3 py-1">
                      <Avatar className="h-4 w-4">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback className="text-xs">{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{member.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => removeMember(member.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
              
              {/* Add Members Button */}
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowMemberSelector(!showMemberSelector)}
                className="flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                {formData.members.length > 0 ? 'Add More Members' : 'Add Team Members'}
              </Button>
              
              {/* Member Selection Dropdown */}
              {showMemberSelector && (
                <div className="border rounded-lg p-3 max-h-48 overflow-y-auto">
                  <div className="space-y-2">
                    {membersList.length > 0 ? (
                      membersList.map((member) => {
                        const isSelected = formData.members.some(m => m.id === member.id);
                        return (
                          <div key={member.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                            <Checkbox
                              id={`member-${member.id}`}
                              checked={isSelected}
                              onCheckedChange={() => handleMemberToggle(member)}
                            />
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={member.avatar} alt={member.name} />
                              <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900">{member.name}</p>
                              <p className="text-sm text-gray-500">{member.email}</p>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-sm text-gray-500 text-center py-4">No team members available</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" className="bg-fmac-red hover:bg-fmac-red/90" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Project'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewProjectDialog;
