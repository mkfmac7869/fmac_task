
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bell, Search } from 'lucide-react';
import { format } from 'date-fns';

const DashboardHeader = () => {
  const { user } = useAuth();
  const currentDate = new Date();

  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold">Hi, {user?.name.split(' ')[0]}!</h1>
        <p className="text-gray-600">{format(currentDate, 'EEEE, MMMM dd, yyyy')}</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            className="pl-10 w-64" 
            placeholder="Search tasks..." 
          />
        </div>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-fmac-red rounded-full"></span>
        </Button>
        <Avatar>
          <AvatarImage src={user?.avatar} alt={user?.name} />
          <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};

export default DashboardHeader;
