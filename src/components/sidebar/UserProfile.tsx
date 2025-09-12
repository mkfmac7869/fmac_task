
import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { User } from '@/types/auth';

interface UserProfileProps {
  user: User | null;
}

const UserProfile = ({ user }: UserProfileProps) => {
  return (
    <div className="flex items-center gap-3 p-2 mb-6 rounded-lg bg-gray-50">
      <div className="h-10 w-10 rounded-full overflow-hidden">
        <img 
          src={user?.avatar || 'https://ui-avatars.com/api/?name=User&background=ea384c&color=fff'} 
          alt="Profile" 
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {user?.name || 'User'}
        </p>
        <p className="text-xs text-gray-500 truncate">
          {user?.roles?.[0] ? user.roles[0].charAt(0).toUpperCase() + user.roles[0].slice(1) : 'Member'}
        </p>
      </div>
      <Link to="/settings">
        <Button size="sm" variant="ghost" className="w-8 h-8 p-0">
          <Settings className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
};

export default UserProfile;
