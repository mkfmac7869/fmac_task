import { 
  LayoutList, 
  Table2, 
  LayoutDashboard, 
  Calendar,
  Activity,
  MapPin,
  Users,
  Briefcase,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type ViewMode = 'list' | 'board' | 'table' | 'calendar' | 'timeline' | 'map' | 'team' | 'workload' | 'activity';

interface ClickUpViewSwitcherProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  availableViews?: ViewMode[];
}

const viewConfigs = {
  list: { icon: LayoutList, label: 'List' },
  board: { icon: LayoutDashboard, label: 'Board' },
  table: { icon: Table2, label: 'Table' },
  calendar: { icon: Calendar, label: 'Calendar' },
  timeline: { icon: Activity, label: 'Timeline' },
  map: { icon: MapPin, label: 'Map' },
  team: { icon: Users, label: 'Team' },
  workload: { icon: Briefcase, label: 'Workload' },
  activity: { icon: BarChart3, label: 'Activity' }
};

const ClickUpViewSwitcher = ({ 
  currentView, 
  onViewChange,
  availableViews = ['list', 'board', 'table']
}: ClickUpViewSwitcherProps) => {
  return (
    <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-0.5">
      {availableViews.map((view) => {
        const config = viewConfigs[view];
        const Icon = config.icon;
        const isActive = currentView === view;
        
        return (
          <Button
            key={view}
            variant="ghost"
            size="sm"
            onClick={() => onViewChange(view)}
            className={cn(
              "h-8 px-3 rounded-md transition-all duration-200",
              "hover:bg-white hover:shadow-sm",
              isActive && "bg-white shadow-sm text-red-600",
              !isActive && "text-gray-600"
            )}
          >
            <Icon className="h-4 w-4 mr-1.5" />
            <span className="text-sm font-medium">{config.label}</span>
          </Button>
        );
      })}
    </div>
  );
};

export default ClickUpViewSwitcher;
