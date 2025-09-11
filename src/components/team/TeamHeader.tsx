
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Plus } from 'lucide-react';
import AddMemberDialog from './AddMemberDialog';
import { TeamMember } from '@/components/team/TeamMemberCard';
import { User } from '@/types/auth';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/use-mobile';

interface TeamHeaderProps {
  user: User | null;
  departments: string[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onMemberAdded: (member: Omit<TeamMember, 'id' | 'avatar' | 'tasksCompleted' | 'tasksInProgress'>) => void;
  isLoading?: boolean;
}

const TeamHeader = ({ 
  user, 
  departments, 
  searchQuery, 
  setSearchQuery, 
  onMemberAdded,
  isLoading = false
}: TeamHeaderProps) => {
  const isMobile = useIsMobile();
  const [dialogTriggerKey, setDialogTriggerKey] = useState('dialog-trigger');
  
  // Determine if the user can add new members
  const canAddMembers = user?.role === 'admin' || user?.role === 'head';
  
  // Get the correct departments to pass to the dialog
  const departmentsToShow = user?.role === 'head' && user.department 
    ? [user.department] 
    : departments;

  return (
    <div className={`${isMobile ? 'flex-col gap-3' : 'flex justify-between items-center'} mb-4 sm:mb-6`}>
      <div className="mb-3 sm:mb-0">
        <h1 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold`}>Team Members</h1>
        <p className="text-gray-600 text-sm sm:text-base">
          {isLoading ? (
            <Skeleton className="h-4 w-48" />
          ) : (
            user?.role === 'admin' 
              ? 'Manage all departments and team members' 
              : `View ${user?.department} team members`
          )}
        </p>
      </div>
      
      <div className={`${isMobile ? 'flex w-full' : 'flex items-center'} gap-2 sm:gap-3`}>
        <div className={`relative ${isMobile ? 'flex-1' : ''}`}>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            className="pl-10 h-9 sm:h-10 w-full sm:w-64" 
            placeholder={isMobile ? "Search..." : "Search team members..."} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {canAddMembers && !isLoading && (
          isMobile ? (
            <Button 
              variant="default"
              size="icon" 
              className="flex-shrink-0 bg-fmac-red hover:bg-fmac-red/90 h-9"
              onClick={() => document.getElementById(dialogTriggerKey)?.click()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          ) : (
            <AddMemberDialog 
              departments={departmentsToShow}
              onMemberAdded={onMemberAdded} 
            />
          )
        )}
        
        {/* Hidden trigger for mobile */}
        {isMobile && canAddMembers && (
          <div className="hidden">
            <AddMemberDialog 
              departments={departmentsToShow}
              onMemberAdded={onMemberAdded}
              // Fix: Using a data attribute instead of id prop for the dialog trigger
              data-testid={dialogTriggerKey}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamHeader;
