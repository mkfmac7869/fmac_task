
import MemberFilter from '@/components/member/MemberFilter';
import MembersTable from '@/components/member/MembersTable';
import { User, UserRole } from '@/types/auth';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface MemberContentProps {
  isLoading: boolean;
  hasError?: boolean;
  refreshData: () => Promise<void>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedRoles: Record<UserRole, boolean>;
  handleRoleToggle: (role: UserRole) => void;
  filteredUsers: User[];
  handleEditUser: (user: User) => void;
  handleDeleteUser: (userId: string) => void;
  handleAddNewUser: () => void;
  getRoleBadgeColor: (role: UserRole) => string;
}

const MemberContent = ({
  isLoading,
  hasError = false,
  refreshData,
  searchQuery,
  setSearchQuery,
  selectedRoles,
  handleRoleToggle,
  filteredUsers,
  handleEditUser,
  handleDeleteUser,
  handleAddNewUser,
  getRoleBadgeColor,
}: MemberContentProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    setIsRefreshing(false);
  };

  return (
    <div className="space-y-6">
      {hasError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="flex justify-between items-center">
            <span>There was a problem loading members. Please try again.</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh} 
              disabled={isRefreshing}
              className="ml-4"
            >
              {isRefreshing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" /> Refresh
                </>
              )}
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      {/* Filter Component */}
      <MemberFilter 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedRoles={selectedRoles}
        handleRoleToggle={handleRoleToggle}
      />
      
      {/* Members Table Component */}
      <MembersTable 
        filteredUsers={filteredUsers}
        onEditUser={handleEditUser}
        onDeleteUser={handleDeleteUser}
        onAddUser={handleAddNewUser}
        getRoleBadgeColor={getRoleBadgeColor}
        isLoading={isLoading}
      />
    </div>
  );
};

export default MemberContent;
