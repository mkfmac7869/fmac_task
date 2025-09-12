
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Task, TaskStatus } from '@/types/task';
import { TeamMember } from '@/components/team/TeamMemberCard';
import NewTaskDialog from '@/components/tasks/NewTaskDialog';
import { useIsMobile } from '@/hooks/use-mobile';

// Importing our components
import MemberProfileHeader from '@/components/member/MemberProfileHeader';
import MemberStatsCards from '@/components/member/MemberStatsCards';
import MemberCompletionRate from '@/components/member/MemberCompletionRate';
import MemberTasksTable from '@/components/member/MemberTasksTable';

interface MemberProfileViewProps {
  member: TeamMember;
  memberTasks: Task[];
  projects: any[];
}

const MemberProfileView = ({ member, memberTasks, projects }: MemberProfileViewProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false);
  
  // Check if the current user can assign tasks (admin or head)
  const canAssignTasks = user?.roles?.includes('admin') || user?.roles?.includes('head');
  
  const handleBack = () => {
    navigate('/team');
  };
  
  // Calculate task statistics
  const completedTasks = memberTasks.filter(task => task.status === TaskStatus.COMPLETED).length;
  const inProgressTasks = memberTasks.filter(task => task.status === TaskStatus.IN_PROGRESS).length;
  const todoTasks = memberTasks.filter(task => task.status === TaskStatus.TODO).length;
  const totalTasks = memberTasks.length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  
  return (
    <div className={`p-3 sm:p-6 ${isMobile ? 'pb-20' : ''}`}>
      {/* Profile Header Component */}
      <MemberProfileHeader 
        member={member}
        canAssignTasks={canAssignTasks}
        onBack={handleBack}
        onAssignTask={() => setIsNewTaskDialogOpen(true)}
      />
      
      {/* Stats Cards Component */}
      <MemberStatsCards 
        totalTasks={totalTasks}
        completedTasks={completedTasks}
        inProgressTasks={inProgressTasks}
        todoTasks={todoTasks}
      />
      
      {/* Completion Rate Component */}
      <MemberCompletionRate completionRate={completionRate} />
      
      {/* Tasks Table Component */}
      <MemberTasksTable tasks={memberTasks} projects={projects} />
      
      {/* New Task Dialog */}
      {member && (
        <NewTaskDialog 
          isOpen={isNewTaskDialogOpen} 
          onOpenChange={setIsNewTaskDialogOpen} 
          defaultAssignee={{
            id: member.id,
            name: member.name,
            avatar: member.avatar
          }}
        />
      )}
    </div>
  );
};

export default MemberProfileView;
