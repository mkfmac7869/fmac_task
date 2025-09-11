
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { RefreshCw, UserPlus } from 'lucide-react';
import { useState } from 'react';

interface MemberHeaderProps {
  onAddNewUser: () => void;
  onRefresh: () => Promise<void>;
  isRefreshing?: boolean;
}

const MemberHeader = ({ 
  onAddNewUser, 
  onRefresh,
  isRefreshing = false
}: MemberHeaderProps) => {
  const { user } = useAuth();
  const [localRefreshing, setLocalRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (isRefreshing || localRefreshing) return;
    
    setLocalRefreshing(true);
    await onRefresh();
    setLocalRefreshing(false);
  };

  const isRefreshingState = isRefreshing || localRefreshing;

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Member Management</h1>
        <p className="text-gray-600 mt-1">Add, edit, and manage team members</p>
      </div>
      <div className="flex items-center gap-3 self-end sm:self-auto">
        <Button
          variant="outline"
          onClick={handleRefresh}
          disabled={isRefreshingState}
          className="h-9"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshingState ? 'animate-spin' : ''}`} />
          {isRefreshingState ? 'Refreshing...' : 'Refresh'}
        </Button>
        <Button 
          className="bg-fmac-red hover:bg-fmac-red/90 h-9" 
          onClick={onAddNewUser}
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Add New Member
        </Button>
      </div>
    </div>
  );
};

export default MemberHeader;
