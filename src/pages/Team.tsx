
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/Layout';
import TeamHeader from '@/components/team/TeamHeader';
import TeamContent from '@/components/team/TeamContent';
import { useTeamMembers } from '@/hooks/team/useTeamMembers';
import { useTeamSearch } from '@/hooks/team/useTeamSearch';
import { useEffect } from 'react';

const Team = () => {
  const { user } = useAuth();
  const { searchQuery, setSearchQuery } = useTeamSearch();
  const { membersList, departments, isLoading, handleAddMember, fetchTeamData } = useTeamMembers();

  // Refresh data when component mounts or user changes
  useEffect(() => {
    fetchTeamData();
  }, [user]);

  return (
    <Layout>
      <div className="p-6">
        {/* Header Component */}
        <TeamHeader 
          user={user}
          departments={departments}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onMemberAdded={handleAddMember}
          isLoading={isLoading}
        />
        
        {/* Team Content Component */}
        <TeamContent 
          user={user}
          membersList={membersList}
          departments={departments}
          isLoading={isLoading}
          searchQuery={searchQuery}
        />
      </div>
    </Layout>
  );
};

export default Team;
