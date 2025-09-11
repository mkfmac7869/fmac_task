
import React from 'react';
import { TabsTrigger } from '@/components/ui/tabs';
import { LucideIcon } from 'lucide-react';

interface TabTriggerWithIconProps {
  value: string;
  icon: React.ReactNode;
  label: string;
}

const TabTriggerWithIcon: React.FC<TabTriggerWithIconProps> = ({ 
  value, 
  icon, 
  label 
}) => {
  return (
    <TabsTrigger value={value} className="flex items-center gap-2">
      {icon}
      {label}
    </TabsTrigger>
  );
};

export default TabTriggerWithIcon;
