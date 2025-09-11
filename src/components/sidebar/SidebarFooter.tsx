
import { useLocation } from 'react-router-dom';
import { Settings, LogOut } from 'lucide-react';
import SidebarItem from './SidebarItem';

interface SidebarFooterProps {
  logout: () => void;
}

const SidebarFooter = ({ logout }: SidebarFooterProps) => {
  const { pathname } = useLocation();
  
  return (
    <div className="mt-auto p-3 border-t border-gray-200">
      <SidebarItem 
        icon={Settings} 
        label="Settings" 
        to="/settings" 
        active={pathname === '/settings'} 
      />
      <div 
        onClick={() => logout()} 
        className="flex items-center p-3 rounded-lg text-gray-700 hover:bg-gray-100 cursor-pointer"
      >
        <LogOut className="h-5 w-5 mr-3 text-gray-500" />
        <span className="font-medium">Logout</span>
      </div>
    </div>
  );
};

export default SidebarFooter;
