
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTask } from '@/context/TaskContext';
import Layout from '@/components/Layout';
import { FirebaseService } from '@/lib/firebaseService';
import { Task } from '@/types/task';
import { TeamMember } from '@/components/team/TeamMemberCard';
import MemberProfileView from '@/components/member/MemberProfileView';
import MemberNotFound from '@/components/member/MemberNotFound';
import { toast } from '@/hooks/use-toast';

const MemberProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tasks, projects } = useTask();
  const [member, setMember] = useState<TeamMember | null>(null);
  const [memberTasks, setMemberTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchMemberData = async () => {
      setIsLoading(true);
      
      try {
        // Fetch member profile from Firebase
        const profile = await FirebaseService.getDocument('profiles', id!);
        
        if (profile) {
          // Calculate tasks statistics for this member
          const memberTasks = tasks.filter(task => task.assignee && task.assignee.id === id);
          const tasksCompleted = memberTasks.filter(task => task.status === 'completed').length;
          const tasksInProgress = memberTasks.filter(task => task.status === 'in-progress').length;
            
          // Create member object with profile data
          const memberData: TeamMember = {
            id: profile.id,
            name: profile.name,
            email: profile.email,
            phone: '', // Phone not stored in profiles currently
            role: profile.role,
            avatar: profile.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=42d1f5&color=fff`,
            department: profile.department || 'Unassigned',
            tasksCompleted,
            tasksInProgress
          };
          
          setMember(memberData);
          setMemberTasks(memberTasks);
        }
      } catch (error) {
        console.error('Error fetching member profile:', error);
        toast({
          title: 'Error loading profile',
          description: 'Could not load member data',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) {
      fetchMemberData();
    }
  }, [id, tasks]);
  
  const handleBack = () => {
    navigate('/team');
  };
  
  return (
    <Layout>
      {isLoading ? (
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="animate-pulse">
              <div className="h-8 w-40 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-64 bg-gray-200 rounded"></div>
            </div>
            <div className="animate-pulse">
              <div className="h-9 w-24 bg-gray-200 rounded"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={`skeleton-${index}`} className="border rounded-lg p-6 animate-pulse">
                <div className="h-4 w-32 bg-gray-200 rounded mb-3"></div>
                <div className="h-8 w-16 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 w-24 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      ) : member ? (
        <MemberProfileView 
          member={member}
          memberTasks={memberTasks}
          projects={projects}
        />
      ) : (
        <MemberNotFound onBack={handleBack} />
      )}
    </Layout>
  );
};

export default MemberProfile;
