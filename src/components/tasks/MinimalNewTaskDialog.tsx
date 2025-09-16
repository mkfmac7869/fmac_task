import React, { useState, useEffect, useRef } from 'react';
import { X, Calendar, User, ChevronDown, Check, Tag, Plus } from 'lucide-react';
import { useTask } from '@/context/TaskContext';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { TaskStatus, TaskPriority } from '@/types/task';
import { format } from 'date-fns';
import { useTaskAssignmentPermissions } from '@/hooks/useTaskAssignmentPermissions';
import { Badge } from '@/components/ui/badge';
// import { MultiAssigneeSelector } from './MultiAssigneeSelector';

interface MinimalNewTaskDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

// Custom Dropdown Component
interface CustomDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: Array<{value: string; label: string; icon?: React.ReactNode; color?: string; bgColor?: string}>;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ 
  value, 
  onChange, 
  options, 
  placeholder = "Select...",
  disabled = false,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const selectedOption = options.find(opt => opt.value === value);
  
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full px-3 py-2 text-left border rounded-md flex items-center justify-between transition-all duration-200 ${
          disabled 
            ? 'bg-gray-50 border-gray-200 cursor-not-allowed' 
            : 'bg-white border-gray-300 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500'
        }`}
        disabled={disabled}
      >
        <span className="flex items-center gap-2">
          {selectedOption ? (
            <>
              {selectedOption.icon}
              <span className={selectedOption.color || ''}>{selectedOption.label}</span>
            </>
          ) : (
            <span className="text-gray-500">{placeholder}</span>
          )}
        </span>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-150 ${
                value === option.value ? 'bg-gray-50' : ''
              }`}
            >
              <span className="flex items-center gap-2">
                {option.icon}
                <span className={option.color || ''}>{option.label}</span>
              </span>
              {value === option.value && <Check className="h-4 w-4 text-red-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const MinimalNewTaskDialog: React.FC<MinimalNewTaskDialogProps> = ({ isOpen, onOpenChange }) => {
  const { addTask, projects } = useTask();
  const { user } = useAuth();
  const { assignableUsers, isLoading: isLoadingUsers, permissionLevel, error: assignmentError } = useTaskAssignmentPermissions();
  
  // Log assignment errors but don't crash
  if (assignmentError) {
    console.error("Assignment permissions error in NewTaskDialog:", assignmentError);
  }
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
  const [status, setStatus] = useState<TaskStatus>(TaskStatus.TODO);
  const [projectId, setProjectId] = useState('');
  const [dueDate, setDueDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [assignees, setAssignees] = useState<Array<{id: string; name: string; avatar: string; email?: string}>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const isAdmin = permissionLevel === 'admin';
  const isDeptHead = permissionLevel === 'head';
  const canAssignToOthers = isAdmin || isDeptHead;

  // Reset assignees when dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
      setAssignees([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a task title",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Handle backward compatibility - if no assignees but we need to assign to self for non-admin
      let finalAssignees = assignees;
      if (!canAssignToOthers && assignees.length === 0 && user) {
        finalAssignees = [{
          id: user.id,
          name: user.name,
          avatar: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`,
          email: user.email
        }];
      }

      const newTask = {
        title: title.trim(),
        description: description.trim(),
        projectId: projectId || null,
        status,
        priority,
        dueDate: new Date(dueDate).toISOString(),
        progress: 0,
        assignees: finalAssignees,
        tags,
        comments: [],
        attachments: [],
        subtasks: [],
        checklists: []
      };
      
      await addTask(newTask);
      
      toast({
        title: "Success",
        description: "Task created successfully",
      });
      
      // Reset and close
      resetForm();
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating task:", error);
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority(TaskPriority.MEDIUM);
    setStatus(TaskStatus.TODO);
    setProjectId('');
    setDueDate(format(new Date(), 'yyyy-MM-dd'));
    setAssignees([]);
    setTags([]);
    setTagInput('');
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Priority colors
  const priorityConfig = {
    [TaskPriority.URGENT]: { label: 'Urgent', color: 'bg-red-500', textColor: 'text-red-700', bgLight: 'bg-red-50' },
    [TaskPriority.HIGH]: { label: 'High', color: 'bg-yellow-500', textColor: 'text-yellow-700', bgLight: 'bg-yellow-50' },
    [TaskPriority.MEDIUM]: { label: 'Medium', color: 'bg-blue-500', textColor: 'text-blue-700', bgLight: 'bg-blue-50' },
    [TaskPriority.LOW]: { label: 'Low', color: 'bg-gray-500', textColor: 'text-gray-700', bgLight: 'bg-gray-50' }
  };

  // Status colors
  const statusConfig = {
    [TaskStatus.TODO]: { label: 'To Do', color: 'bg-gray-500', textColor: 'text-gray-700', bgLight: 'bg-gray-50' },
    [TaskStatus.IN_PROGRESS]: { label: 'In Progress', color: 'bg-blue-500', textColor: 'text-blue-700', bgLight: 'bg-blue-50' },
    [TaskStatus.IN_REVIEW]: { label: 'In Review', color: 'bg-yellow-500', textColor: 'text-yellow-700', bgLight: 'bg-yellow-50' },
    [TaskStatus.COMPLETED]: { label: 'Completed', color: 'bg-green-500', textColor: 'text-green-700', bgLight: 'bg-green-50' }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={handleClose}
      />
      
      {/* Dialog */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="bg-white rounded-lg shadow-xl p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Create New Task</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
              type="button"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Task Title */}
            <div>
              <label htmlFor="task-title" className="block text-sm font-medium text-gray-700 mb-1">
                Task Title *
              </label>
              <input
                id="task-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Enter task title"
                autoFocus
                disabled={isSubmitting}
              />
            </div>
            
            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Enter task description"
                rows={3}
                disabled={isSubmitting}
              />
            </div>
            
            {/* Priority and Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <CustomDropdown
                  value={priority}
                  onChange={(value) => setPriority(value as TaskPriority)}
                  disabled={isSubmitting}
                  options={[
                    { 
                      value: TaskPriority.URGENT, 
                      label: priorityConfig[TaskPriority.URGENT].label,
                      icon: <div className={`w-3 h-3 rounded-full ${priorityConfig[TaskPriority.URGENT].color}`} />,
                      color: priorityConfig[TaskPriority.URGENT].textColor
                    },
                    { 
                      value: TaskPriority.HIGH, 
                      label: priorityConfig[TaskPriority.HIGH].label,
                      icon: <div className={`w-3 h-3 rounded-full ${priorityConfig[TaskPriority.HIGH].color}`} />,
                      color: priorityConfig[TaskPriority.HIGH].textColor
                    },
                    { 
                      value: TaskPriority.MEDIUM, 
                      label: priorityConfig[TaskPriority.MEDIUM].label,
                      icon: <div className={`w-3 h-3 rounded-full ${priorityConfig[TaskPriority.MEDIUM].color}`} />,
                      color: priorityConfig[TaskPriority.MEDIUM].textColor
                    },
                    { 
                      value: TaskPriority.LOW, 
                      label: priorityConfig[TaskPriority.LOW].label,
                      icon: <div className={`w-3 h-3 rounded-full ${priorityConfig[TaskPriority.LOW].color}`} />,
                      color: priorityConfig[TaskPriority.LOW].textColor
                    }
                  ]}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <CustomDropdown
                  value={status}
                  onChange={(value) => setStatus(value as TaskStatus)}
                  disabled={isSubmitting}
                  options={[
                    { 
                      value: TaskStatus.TODO, 
                      label: statusConfig[TaskStatus.TODO].label,
                      icon: <div className={`w-3 h-3 rounded-full ${statusConfig[TaskStatus.TODO].color}`} />,
                      color: statusConfig[TaskStatus.TODO].textColor
                    },
                    { 
                      value: TaskStatus.IN_PROGRESS, 
                      label: statusConfig[TaskStatus.IN_PROGRESS].label,
                      icon: <div className={`w-3 h-3 rounded-full ${statusConfig[TaskStatus.IN_PROGRESS].color}`} />,
                      color: statusConfig[TaskStatus.IN_PROGRESS].textColor
                    },
                    { 
                      value: TaskStatus.IN_REVIEW, 
                      label: statusConfig[TaskStatus.IN_REVIEW].label,
                      icon: <div className={`w-3 h-3 rounded-full ${statusConfig[TaskStatus.IN_REVIEW].color}`} />,
                      color: statusConfig[TaskStatus.IN_REVIEW].textColor
                    },
                    { 
                      value: TaskStatus.COMPLETED, 
                      label: statusConfig[TaskStatus.COMPLETED].label,
                      icon: <div className={`w-3 h-3 rounded-full ${statusConfig[TaskStatus.COMPLETED].color}`} />,
                      color: statusConfig[TaskStatus.COMPLETED].textColor
                    }
                  ]}
                />
              </div>
            </div>
            
            {/* Due Date and Project */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="due-date" className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <div className="relative">
                  <input
                    id="due-date"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    disabled={isSubmitting}
                  />
                  <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project
                </label>
                <CustomDropdown
                  value={projectId}
                  onChange={setProjectId}
                  disabled={isSubmitting}
                  placeholder="Select project"
                  options={[
                    { value: '', label: 'No Project' },
                    ...(projects?.map((project) => ({
                      value: project.id,
                      label: project.name,
                      icon: <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: project.color }} />
                    })) || [])
                  ]}
                />
              </div>
            </div>
            
            {/* Assignee (Simplified for deployment) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assignee {isDeptHead && <span className="text-xs text-gray-500">(Department members only)</span>}
              </label>
              {canAssignToOthers ? (
                <select
                  value={assignees.length > 0 ? assignees[0].id : ''}
                  onChange={(e) => {
                    const selectedUser = assignableUsers?.find(u => u.id === e.target.value);
                    if (selectedUser) {
                      setAssignees([{
                        id: selectedUser.id,
                        name: selectedUser.name,
                        avatar: selectedUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser.name)}`,
                        email: selectedUser.email
                      }]);
                    } else {
                      setAssignees([]);
                    }
                  }}
                  disabled={isSubmitting || isLoadingUsers}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">Unassigned</option>
                  {assignableUsers?.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="flex items-center p-2 bg-gray-50 rounded-md">
                  <input
                    id="assign-to-self"
                    type="checkbox"
                    checked={assignees.length > 0 && assignees[0].id === user?.id}
                    onChange={(e) => {
                      if (e.target.checked && user) {
                        setAssignees([{
                          id: user.id,
                          name: user.name,
                          avatar: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`,
                          email: user.email
                        }]);
                      } else {
                        setAssignees([]);
                      }
                    }}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    disabled={isSubmitting}
                  />
                  <label htmlFor="assign-to-self" className="ml-2 text-sm text-gray-700 flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    Assign to me
                  </label>
                </div>
              )}
            </div>
            
            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <div className="space-y-2">
                <div className="relative">
                  <Tag className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Type a tag and press Enter"
                    disabled={isSubmitting}
                  />
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="px-2 py-1 flex items-center gap-1"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:text-red-600"
                          disabled={isSubmitting}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Submit Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Create Task'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default MinimalNewTaskDialog;
