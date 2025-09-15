import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { format } from 'date-fns';
import { FirebaseService } from '@/lib/firebaseService';
import { useFetchMembers } from '@/hooks/memberManagement/useFetchMembers';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectItem 
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { 
  Popover, 
  PopoverTrigger, 
  PopoverContent 
} from '@/components/ui/popover';
import { toast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Project, TaskStatus, TaskPriority } from '@/types/task';
import {
  CalendarIcon,
  Flag,
  Circle,
  Clock,
  AlertCircle,
  CheckCircle2,
  User,
  Folder,
  Tag,
  X,
  Plus,
  ChevronDown
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface EnhancedTaskFormProps {
  onSubmit: (data: any) => void;
  projects: Project[];
  defaultAssignee?: {
    id: string;
    name: string;
    avatar: string;
    email?: string;
  } | null;
  isSubmitting?: boolean;
  user: any;
}

const statusOptions = [
  { value: TaskStatus.TODO, label: 'To Do', icon: Circle, color: 'text-gray-400' },
  { value: TaskStatus.IN_PROGRESS, label: 'In Progress', icon: Clock, color: 'text-blue-600' },
  { value: TaskStatus.IN_REVIEW, label: 'In Review', icon: AlertCircle, color: 'text-yellow-600' },
  { value: TaskStatus.COMPLETED, label: 'Completed', icon: CheckCircle2, color: 'text-green-600' },
];

const priorityOptions = [
  { 
    value: TaskPriority.URGENT, 
    label: 'Urgent', 
    color: 'text-red-700', 
    bgColor: 'bg-red-100', 
    borderColor: 'border-red-300',
    fill: true 
  },
  { 
    value: TaskPriority.HIGH, 
    label: 'High', 
    color: 'text-yellow-600', 
    bgColor: 'bg-yellow-100',
    borderColor: 'border-yellow-300', 
    fill: true 
  },
  { 
    value: TaskPriority.MEDIUM, 
    label: 'Medium', 
    color: 'text-blue-600', 
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-300', 
    fill: false 
  },
  { 
    value: TaskPriority.LOW, 
    label: 'Low', 
    color: 'text-gray-500', 
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-300', 
    fill: false 
  },
];

const EnhancedTaskForm = ({ 
  onSubmit, 
  projects, 
  defaultAssignee, 
  isSubmitting = false,
  user
}: EnhancedTaskFormProps) => {
  const { control, register, handleSubmit, formState: { errors }, watch, setValue } = useForm({
    defaultValues: {
      title: '',
      description: '',
      projectId: projects.length > 0 ? projects[0].id : '',
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
      assignee: defaultAssignee || null,
      tags: []
    }
  });

  const { users, isLoading: isLoadingMembers } = useFetchMembers();
  const [isAssigneeDropdownOpen, setIsAssigneeDropdownOpen] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);

  const selectedStatus = watch('status');
  const selectedPriority = watch('priority');
  const selectedProject = watch('projectId');
  const selectedAssignee = watch('assignee');
  const selectedDate = watch('dueDate');

  const handleFormSubmit = (data: any) => {
    onSubmit({
      ...data,
      tags: tags,
      dueDate: data.dueDate ? data.dueDate.toISOString() : new Date().toISOString(),
    });
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
      setShowTagInput(false);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const isAdmin = user?.roles?.includes('admin');

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Title Field */}
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-medium text-gray-700">
          Task Title <span className="text-red-500">*</span>
        </Label>
        <Input 
          id="title" 
          placeholder="Enter task title..." 
          className="h-10 text-base"
          {...register("title", { required: "Task title is required" })} 
        />
        {errors.title && (
          <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
        )}
      </div>

      {/* Description Field */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-medium text-gray-700">
          Description
        </Label>
        <Textarea 
          id="description" 
          placeholder="Add task description..." 
          className="min-h-[100px] resize-none" 
          {...register("description")} 
        />
      </div>

      {/* Row 1: Project and Assignee */}
      <div className="grid grid-cols-2 gap-4">
        {/* Project Field */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            <Folder className="inline h-3.5 w-3.5 mr-1 text-gray-500" />
            Project
          </Label>
          <Controller
            name="projectId"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select project">
                    {selectedProject && projects.find(p => p.id === selectedProject) && (
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded" 
                          style={{ 
                            backgroundColor: projects.find(p => p.id === selectedProject)?.color 
                          }}
                        />
                        <span>{projects.find(p => p.id === selectedProject)?.name}</span>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No project</SelectItem>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded" 
                          style={{ backgroundColor: project.color }}
                        />
                        <span>{project.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Assignee Field */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            <User className="inline h-3.5 w-3.5 mr-1 text-gray-500" />
            Assignee
          </Label>
          {isAdmin ? (
            <DropdownMenu open={isAssigneeDropdownOpen} onOpenChange={setIsAssigneeDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button 
                  type="button"
                  variant="outline" 
                  className="w-full h-10 justify-start font-normal"
                >
                  {selectedAssignee ? (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={selectedAssignee.avatar} />
                        <AvatarFallback>{selectedAssignee.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="truncate">{selectedAssignee.name}</span>
                    </div>
                  ) : (
                    <span className="text-gray-500">Select assignee</span>
                  )}
                  <ChevronDown className="h-4 w-4 ml-auto opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 max-h-80 overflow-auto">
                <DropdownMenuItem
                  onClick={() => {
                    setValue('assignee', null);
                    setIsAssigneeDropdownOpen(false);
                  }}
                >
                  <span className="text-gray-400">Unassigned</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {isLoadingMembers ? (
                  <div className="flex justify-center p-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                  </div>
                ) : (
                  users.map(member => (
                    <DropdownMenuItem
                      key={member.id}
                      onClick={() => {
                        setValue('assignee', {
                          id: member.id,
                          name: member.name,
                          avatar: member.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}`,
                          email: member.email
                        });
                        setIsAssigneeDropdownOpen(false);
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{member.name}</span>
                      </div>
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="h-10 px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-500 flex items-center">
              Only admins can assign tasks
            </div>
          )}
        </div>
      </div>

      {/* Row 2: Status and Priority */}
      <div className="grid grid-cols-2 gap-4">
        {/* Status Field */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            Status <span className="text-red-500">*</span>
          </Label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="h-10">
                  <SelectValue>
                    {(() => {
                      const status = statusOptions.find(s => s.value === selectedStatus);
                      if (status) {
                        const Icon = status.icon;
                        return (
                          <div className="flex items-center gap-2">
                            <Icon className={cn("h-4 w-4", status.color)} />
                            <span>{status.label}</span>
                          </div>
                        );
                      }
                      return null;
                    })()}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <Icon className={cn("h-4 w-4", option.color)} />
                          <span>{option.label}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Priority Field */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            <Flag className="inline h-3.5 w-3.5 mr-1 text-gray-500" />
            Priority <span className="text-red-500">*</span>
          </Label>
          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="h-10">
                  <SelectValue>
                    {(() => {
                      const priority = priorityOptions.find(p => p.value === selectedPriority);
                      if (priority) {
                        return (
                          <div className="flex items-center gap-2">
                            <div className={cn("rounded px-1.5 py-0.5", priority.bgColor)}>
                              <Flag className={cn(
                                "h-3.5 w-3.5", 
                                priority.color,
                                priority.fill && "fill-current"
                              )} />
                            </div>
                            <span>{priority.label}</span>
                          </div>
                        );
                      }
                      return null;
                    })()}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <div className={cn("rounded px-1.5 py-0.5", option.bgColor)}>
                          <Flag className={cn(
                            "h-3.5 w-3.5", 
                            option.color,
                            option.fill && "fill-current"
                          )} />
                        </div>
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      {/* Row 3: Due Date and Tags */}
      <div className="grid grid-cols-2 gap-4">
        {/* Due Date Field */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            <CalendarIcon className="inline h-3.5 w-3.5 mr-1 text-gray-500" />
            Due Date
          </Label>
          <Controller
            name="dueDate"
            control={control}
            render={({ field }) => (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      "w-full h-10 justify-start text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            )}
          />
        </div>

        {/* Tags Field */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            <Tag className="inline h-3.5 w-3.5 mr-1 text-gray-500" />
            Tags
          </Label>
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border border-gray-200 rounded-md bg-white">
              {tags.map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="bg-gray-100 hover:bg-gray-200 cursor-pointer"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {showTagInput ? (
                <Input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    } else if (e.key === 'Escape') {
                      setShowTagInput(false);
                      setNewTag('');
                    }
                  }}
                  onBlur={handleAddTag}
                  placeholder="Type tag name..."
                  className="h-6 w-32 text-sm"
                  autoFocus
                />
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowTagInput(true)}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add tag
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
        <Button 
          type="button" 
          variant="outline"
          disabled={isSubmitting}
          onClick={() => window.history.back()}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-red-600 hover:bg-red-700 text-white min-w-[120px]"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Creating...
            </div>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-1.5" />
              Create Task
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default EnhancedTaskForm;
