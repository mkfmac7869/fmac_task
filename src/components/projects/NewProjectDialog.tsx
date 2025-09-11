
import { useState, useEffect } from 'react';
import { useTask } from '@/context/TaskContext';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { FirebaseService } from '@/lib/firebaseService';

interface ProjectFormData {
  name: string;
  description: string;
  color: string;
  departmentId: string | null;
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
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    description: '',
    color: 'blue',
    departmentId: null,
  });
  const [isOpen, setIsOpen] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
        members: []
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
