
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  to: string;
  active?: boolean;
}

const SidebarItem = ({
  icon: Icon,
  label,
  to,
  active
}: SidebarItemProps) => {
  return (
    <div className={cn("flex items-center p-3 mb-1 rounded-lg transition-colors cursor-pointer", active ? "bg-red-600 text-white" : "text-gray-700 hover:bg-gray-100")}>
      <Icon className={cn("h-5 w-5 mr-3", active ? "text-white" : "text-gray-500")} />
      <span className="font-medium">{label}</span>
    </div>
  );
};

export default SidebarItem;
