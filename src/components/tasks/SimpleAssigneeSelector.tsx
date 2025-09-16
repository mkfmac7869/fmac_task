import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { X, Plus, User } from 'lucide-react';
import { useFetchMembers } from '@/hooks/memberManagement/useFetchMembers';

interface Assignee {
  id: string;
  name: string;
  avatar: string;
  email?: string;
}

interface SimpleAssigneeSelectorProps {
  assignees: Assignee[];
  onAssigneesChange: (assignees: Assignee[]) => void;
  isAdmin?: boolean;
  className?: string;
}

const SimpleAssigneeSelector: React.FC<SimpleAssigneeSelectorProps> = ({
  assignees,
  onAssigneesChange,
  isAdmin = false,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { members, isLoading } = useFetchMembers();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredMembers = members.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !assignees.some(assignee => assignee.id === member.id)
  );

  const handleAddAssignee = (member: any) => {
    const newAssignee: Assignee = {
      id: member.id,
      name: member.name,
      avatar: member.avatar,
      email: member.email
    };
    onAssigneesChange([...assignees, newAssignee]);
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleRemoveAssignee = (assigneeId: string) => {
    onAssigneesChange(assignees.filter(assignee => assignee.id !== assigneeId));
  };

  if (!isAdmin) {
    // Non-admin users can only see assignees, not modify them
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {assignees.length > 0 ? (
          assignees.map((assignee) => (
            <div key={assignee.id} className="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded">
              <Avatar className="h-5 w-5">
                <AvatarImage src={assignee.avatar} />
                <AvatarFallback className="text-xs">{assignee.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-sm">{assignee.name}</span>
            </div>
          ))
        ) : (
          <span className="text-sm text-gray-400">No assignees</span>
        )}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Assignees Display */}
      <div className="flex flex-wrap gap-2 mb-2">
        {assignees.map((assignee) => (
          <div key={assignee.id} className="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded">
            <Avatar className="h-5 w-5">
              <AvatarImage src={assignee.avatar} />
              <AvatarFallback className="text-xs">{assignee.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm">{assignee.name}</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 hover:bg-red-100 hover:text-red-600"
              onClick={() => handleRemoveAssignee(assignee.id)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>

      {/* Add Assignee Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="h-8 px-3 text-xs"
        disabled={isLoading}
      >
        <Plus className="h-3 w-3 mr-1" />
        {isLoading ? 'Loading...' : 'Add Assignee'}
      </Button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-2">
            <input
              type="text"
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>
          
          <div className="max-h-48 overflow-y-auto">
            {isLoading ? (
              <div className="p-3 text-sm text-gray-500 text-center">Loading members...</div>
            ) : filteredMembers.length > 0 ? (
              filteredMembers.map((member) => (
                <button
                  key={member.id}
                  onClick={() => handleAddAssignee(member)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 text-left"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{member.name}</p>
                    <p className="text-xs text-gray-500">{member.email}</p>
                  </div>
                </button>
              ))
            ) : (
              <div className="p-3 text-sm text-gray-500 text-center">
                {searchTerm ? 'No members found' : 'No available members'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleAssigneeSelector;
