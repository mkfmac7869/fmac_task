
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { db } from '@/lib/firebaseClient';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { FirebaseService } from '@/lib/firebaseService';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { toast } from '@/hooks/use-toast';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Project } from '@/types/task';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface TaskFormProps {
  onSubmit: (data: any) => void;
  projects: Project[];
  defaultAssignee?: {
    id: string;
    name: string;
    avatar: string;
    email?: string;
  } | null;
  isSubmitting?: boolean;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

const TaskForm = ({ onSubmit, projects, defaultAssignee, isSubmitting = false }: TaskFormProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [selectedProject, setSelectedProject] = useState<string | null>(
    projects.length > 0 ? projects[0].id : null
  );
  const [selectedPriority, setSelectedPriority] = useState('medium');
  const [selectedStatus, setSelectedStatus] = useState('todo');
  const [dueDate, setDueDate] = useState<Date | undefined>(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)); // Default to 1 week from now
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [selectedAssignee, setSelectedAssignee] = useState<string | undefined>(
    defaultAssignee ? defaultAssignee.id : undefined
  );
  
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const data = await FirebaseService.getDocuments('profiles');
        
        if (data && data.length > 0) {
          const formattedMembers = data.map(profile => ({
            id: profile.id,
            name: (profile as any).name || 'Unknown',
            email: (profile as any).email || '',
            avatar: (profile as any).avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent((profile as any).name || 'U')}&background=42d1f5&color=fff`
          }));
          setTeamMembers(formattedMembers);
        }
      } catch (err) {
        console.error("Failed to fetch team members:", err);
      }
    };
    
    fetchTeamMembers();
  }, []);
  
  const handleFormSubmit = (data: any) => {
    // If there are no projects, show a message and don't submit
    if (!selectedProject && projects.length > 0) {
      toast({
        title: "Error",
        description: "Please select a project.",
        variant: "destructive"
      });
      return;
    }

    // If there are no projects at all, make the projectId null
    // The backend should handle this case appropriately
    const projectId = projects.length > 0 ? selectedProject : null;
      
    const assigneeData = selectedAssignee ? 
      teamMembers.find(member => member.id === selectedAssignee) : 
      defaultAssignee;
      
    onSubmit({
      ...data,
      projectId,
      status: selectedStatus,
      priority: selectedPriority,
      dueDate: dueDate ? dueDate.toISOString() : new Date().toISOString(),
      assignee: assigneeData ? {
        id: assigneeData.id,
        name: assigneeData.name,
        avatar: assigneeData.avatar,
        email: assigneeData.email
      } : null,
    });
  };
  
  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
        <Input id="title" placeholder="Task Title" type="text" {...register("title", { required: true })} />
        {errors.title && <p className="text-red-500 text-sm">Title is required</p>}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" placeholder="Task Description" className="resize-none" {...register("description")} />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="project">Project {projects.length > 0 && <span className="text-red-500">*</span>}</Label>
        {projects.length > 0 ? (
          <Select onValueChange={(value) => setSelectedProject(value)} defaultValue={selectedProject || undefined}>
            <SelectTrigger id="project">
              <SelectValue placeholder="Select a project" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <div className="text-sm text-amber-600 bg-amber-50 p-2 rounded border border-amber-200">
            No projects available. You can still create this task without assigning it to a project.
          </div>
        )}
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="assignee">Assignee</Label>
        <Select 
          onValueChange={(value) => setSelectedAssignee(value)} 
          defaultValue={defaultAssignee ? defaultAssignee.id : undefined}
          disabled={!!defaultAssignee}
        >
          <SelectTrigger id="assignee">
            <SelectValue placeholder="Select team member" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="unassigned">Unassigned</SelectItem>
            {teamMembers.map((member) => (
              <SelectItem key={member.id} value={member.id}>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {member.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="status">Status <span className="text-red-500">*</span></Label>
        <Select onValueChange={(value) => setSelectedStatus(value)} defaultValue={selectedStatus}>
          <SelectTrigger id="status">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todo">To Do</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="priority">Priority <span className="text-red-500">*</span></Label>
        <Select onValueChange={(value) => setSelectedPriority(value)} defaultValue={selectedPriority}>
          <SelectTrigger id="priority">
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid gap-2">
        <Label>Due Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !dueDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
            <Calendar
              mode="single"
              selected={dueDate}
              onSelect={setDueDate}
              initialFocus
              className="p-3"
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <Button type="submit" className="mt-4" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Add Task"}
      </Button>
    </form>
  );
};

export default TaskForm;
