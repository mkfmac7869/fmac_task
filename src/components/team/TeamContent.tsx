
import { useState } from 'react';
import { User } from '@/types/auth';
import { TeamMember } from '@/components/team/TeamMemberCard';
import TeamMemberCard from './TeamMemberCard';
import TeamStats from './TeamStats';
import DepartmentFilter from './DepartmentFilter';
import TeamSkeletons from './TeamSkeletons';

interface TeamContentProps {
  user: User | null;
  membersList: TeamMember[];
  departments: string[];
  isLoading: boolean;
  searchQuery: string;
}

const TeamContent = ({ 
  user, 
  membersList, 
  departments,
  isLoading,
  searchQuery 
}: TeamContentProps) => {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  
  // Filter team members based on user role and search/department filters
  const filteredMembers = membersList.filter(member => {
    // Filter by user role
    if (user?.role === 'member') {
      // Regular members can only see their department
      if (member.department !== user.department) {
        return false;
      }
    } else if (user?.role === 'head') {
      // Department heads can see all members in their department
      if (member.department !== user.department) {
        return false;
      }
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !member.name.toLowerCase().includes(query) &&
        !member.email.toLowerCase().includes(query) &&
        !member.department.toLowerCase().includes(query) &&
        !member.role.toLowerCase().includes(query)
      ) {
        return false;
      }
    }
    
    // Apply department filter (admin only)
    if (user?.role === 'admin' && selectedDepartment !== 'all') {
      if (member.department !== selectedDepartment) {
        return false;
      }
    }
    
    return true;
  });
  
  // Calculate stats based on visible members
  const totalMembers = filteredMembers.length;
  const totalTasksCompleted = filteredMembers.reduce((sum, member) => sum + member.tasksCompleted, 0);
  const totalTasksInProgress = filteredMembers.reduce((sum, member) => sum + member.tasksInProgress, 0);
  
  // Determine if the user can invite/assign tasks
  const canInvite = user?.role === 'admin' || user?.role === 'head';

  return (
    <>
      {/* Team stats */}
      <TeamStats 
        totalMembers={totalMembers} 
        totalTasksCompleted={totalTasksCompleted} 
        totalTasksInProgress={totalTasksInProgress} 
        isLoading={isLoading}
      />
      
      {/* Department filter - Only for admins */}
      {user?.role === 'admin' && (
        <DepartmentFilter 
          selectedDepartment={selectedDepartment}
          setSelectedDepartment={setSelectedDepartment}
          departments={departments}
        />
      )}
      
      {/* Team members grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isLoading ? (
          <TeamSkeletons count={4} />
        ) : filteredMembers.length > 0 ? (
          filteredMembers.map((member) => (
            <TeamMemberCard 
              key={member.id} 
              member={member} 
              canInvite={canInvite}
            />
          ))
        ) : (
          <div className="col-span-2 text-center p-8">
            <p className="text-gray-500">No team members found</p>
          </div>
        )}
      </div>
    </>
  );
};

export default TeamContent;
