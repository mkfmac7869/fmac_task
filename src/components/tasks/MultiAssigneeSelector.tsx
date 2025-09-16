import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Check, X, Users, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Assignee {
  id: string;
  name: string;
  avatar: string;
  email?: string;
}

interface MultiAssigneeSelectorProps {
  selectedAssignees: Assignee[];
  availableMembers: Assignee[];
  onAssigneesChange: (assignees: Assignee[]) => void;
  isAdmin?: boolean;
  disabled?: boolean;
  className?: string;
}

const MultiAssigneeSelector: React.FC<MultiAssigneeSelectorProps> = ({
  selectedAssignees,
  availableMembers,
  onAssigneesChange,
  isAdmin = false,
  disabled = false,
  className
}) => {
  const [open, setOpen] = useState(false);

  const handleAssigneeToggle = (member: Assignee) => {
    const isSelected = selectedAssignees.some(assignee => assignee.id === member.id);
    
    if (isSelected) {
      // Remove assignee
      onAssigneesChange(selectedAssignees.filter(assignee => assignee.id !== member.id));
    } else {
      // Add assignee
      onAssigneesChange([...selectedAssignees, member]);
    }
  };

  const removeAssignee = (assigneeId: string) => {
    onAssigneesChange(selectedAssignees.filter(assignee => assignee.id !== assigneeId));
  };

  if (!isAdmin && selectedAssignees.length === 0) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Users className="h-4 w-4" />
        <span>No assignees</span>
      </div>
    );
  }

  if (!isAdmin && selectedAssignees.length > 0) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex -space-x-2">
          {selectedAssignees.slice(0, 3).map((assignee) => (
            <Avatar key={assignee.id} className="h-6 w-6 border-2 border-white">
              <AvatarImage src={assignee.avatar} />
              <AvatarFallback className="text-xs">{assignee.name.charAt(0)}</AvatarFallback>
            </Avatar>
          ))}
          {selectedAssignees.length > 3 && (
            <div className="h-6 w-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
              <span className="text-xs font-medium">+{selectedAssignees.length - 3}</span>
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-1">
          {selectedAssignees.map((assignee) => (
            <Badge key={assignee.id} variant="secondary" className="text-xs">
              {assignee.name}
            </Badge>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      {/* Selected Assignees */}
      {selectedAssignees.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedAssignees.map((assignee) => (
            <Badge key={assignee.id} variant="secondary" className="flex items-center gap-1 pr-1">
              <Avatar className="h-4 w-4">
                <AvatarImage src={assignee.avatar} />
                <AvatarFallback className="text-xs">{assignee.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-xs">{assignee.name}</span>
              {!disabled && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => removeAssignee(assignee.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </Badge>
          ))}
        </div>
      )}

      {/* Add Assignee Button */}
      {!disabled && (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 border-dashed"
            >
              <Plus className="h-4 w-4 mr-1" />
              {selectedAssignees.length === 0 ? 'Assign members' : 'Add member'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-0" align="start">
            <Command>
              <CommandInput placeholder="Search members..." />
              <CommandEmpty>No members found.</CommandEmpty>
              <CommandGroup>
                {availableMembers.map((member) => {
                  const isSelected = selectedAssignees.some(assignee => assignee.id === member.id);
                  return (
                    <CommandItem
                      key={member.id}
                      onSelect={() => handleAssigneeToggle(member)}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback className="text-xs">{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{member.name}</p>
                          {member.email && (
                            <p className="text-xs text-gray-500">{member.email}</p>
                          )}
                        </div>
                      </div>
                      {isSelected && (
                        <Check className="h-4 w-4 text-green-600" />
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

export default MultiAssigneeSelector;
