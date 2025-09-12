
import { NavLink } from 'react-router-dom';
import { 
  CalendarDays, 
  Users, 
  ClipboardList, 
  FolderKanban, 
  Settings,
  PieChart,
  Home
} from 'lucide-react';
import SidebarItem from './SidebarItem';
import { User } from '@/types/auth';
import { useIsMobile } from '@/hooks/use-mobile';

interface SidebarNavigationProps {
  user: User | null;
  bottomNav?: boolean;
}

const SidebarNavigation = ({ user, bottomNav = false }: SidebarNavigationProps) => {
  const isMobile = useIsMobile();
  
  // Define navigation items based on user role
  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: Home },
    { to: '/tasks', label: 'Tasks', icon: ClipboardList },
    { to: '/calendar', label: 'Calendar', icon: CalendarDays },
    { to: '/projects', label: 'Projects', icon: FolderKanban },
    { to: '/team', label: 'Team', icon: Users }
  ];
  
  // Only add admin routes if user has the right role
  if (user?.roles?.includes('admin')) {
    navItems.push(
      { to: '/reports', label: 'Reports', icon: PieChart },
      { to: '/member-management', label: 'Members', icon: Users },
      { to: '/department-management', label: 'Departments', icon: Users }
    );
  }
  
  // Always add settings at the end
  navItems.push({ to: '/settings', label: 'Settings', icon: Settings });
  
  // For mobile bottom nav, just show a limited set
  const mobileNavItems = [
    { to: '/dashboard', label: 'Dashboard', icon: Home },
    { to: '/tasks', label: 'Tasks', icon: ClipboardList },
    { to: '/projects', label: 'Projects', icon: FolderKanban },
    { to: '/team', label: 'Team', icon: Users },
    { to: '/settings', label: 'Settings', icon: Settings }
  ];
  
  const displayItems = bottomNav ? mobileNavItems : navItems;
  
  if (bottomNav) {
    return (
      <>
        {displayItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `
              flex flex-col items-center justify-center py-1 px-2 
              ${isActive ? 'text-fmac-red' : 'text-gray-600'}
            `}
          >
            {/* The fix: Use a component type instead of an element by directly using the icon component */}
            <item.icon className="h-5 w-5" />
            <span className="text-xs mt-0.5">{item.label}</span>
          </NavLink>
        ))}
      </>
    );
  }
  
  return (
    <nav className="my-4">
      <h2 className="px-3 text-xs font-semibold text-gray-500 uppercase mb-2">Navigation</h2>
      <ul className="space-y-1">
        {displayItems.map((item) => (
          <SidebarItem
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={item.label}
          />
        ))}
      </ul>
    </nav>
  );
};

export default SidebarNavigation;
