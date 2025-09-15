
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import MemberHeader from '@/components/member/MemberHeader';
import MemberContent from '@/components/member/MemberContent';
import MemberFormDialog from '@/components/member/MemberFormDialog';
import { useMemberManagement } from '@/hooks/memberManagement';
import { FirebaseService } from '@/lib/firebaseService';
import { useAuth } from '@/context/AuthContext';

const MemberManagement = () => {
  const [hasError, setHasError] = useState(false);
  const { user } = useAuth();

  const {
    isLoading,
    searchQuery,
    setSearchQuery,
    selectedRoles,
    handleRoleToggle,
    getFilteredUsers,
    isDialogOpen,
    setIsDialogOpen,
    isEditMode,
    userToEdit,
    handleAddNewUser,
    handleEditUser,
    handleDeleteUser,
    getRoleBadgeColor,
    getRoleDisplayName,
    onSubmit,
    isCrudSubmitting,
    fetchUsers
  } = useMemberManagement();

  const filteredUsers = getFilteredUsers();
  
  // Effect to fix admin roles on component mount (only run once)
  useEffect(() => {
    const fixAdminUsers = async () => {
      try {
        // Get all profiles from Firebase
        const profiles = await FirebaseService.getDocuments('profiles');
        
        if (profiles && profiles.length > 0) {
          const adminEmails = ['mkfmac7@gmail.com', 'mk7869148e@gmail.com'];
          let hasUpdates = false;
          
          for (const profile of profiles) {
            if (adminEmails.includes(profile.email) && profile.role !== 'admin') {
              // Update the role to admin
              await FirebaseService.updateDocument('profiles', profile.id, {
                role: 'admin',
                department: 'Management'
              });
              
              console.log(`Updated user ${profile.email} to admin role`);
              hasUpdates = true;
            }
          }
          
          // Only refresh if we made updates
          if (hasUpdates) {
            await fetchUsers();
          }
        }
      } catch (error) {
        console.error("Error fixing admin roles:", error);
      }
    };
    
    fixAdminUsers();
  }, []); // Remove fetchUsers from dependency array

  const handleRefresh = async () => {
    try {
      setHasError(false);
      await fetchUsers();
    } catch (error) {
      console.error("Error refreshing users:", error);
      setHasError(true);
    }
  };

  return (
    <Layout>
      <div className="p-4 sm:p-6 space-y-6">
        {/* Header Component */}
        <MemberHeader 
          onAddNewUser={handleAddNewUser} 
          onRefresh={handleRefresh}
          isRefreshing={isLoading}
        />
        
        {/* Content Component */}
        <MemberContent 
          isLoading={isLoading}
          hasError={hasError}
          refreshData={handleRefresh}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedRoles={selectedRoles}
          handleRoleToggle={handleRoleToggle}
          filteredUsers={filteredUsers}
          handleEditUser={handleEditUser}
          handleDeleteUser={handleDeleteUser}
          handleAddNewUser={handleAddNewUser}
          getRoleBadgeColor={getRoleBadgeColor}
          getRoleDisplayName={getRoleDisplayName}
        />
        
        {/* Form Dialog Component */}
        <MemberFormDialog
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          isEditMode={isEditMode}
          userToEdit={userToEdit}
          onSubmit={onSubmit}
          isSubmitting={isCrudSubmitting}
        />
      </div>
    </Layout>
  );
};

export default MemberManagement;
