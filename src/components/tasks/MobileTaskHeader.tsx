import { useState } from 'react';
import { 
  Menu,
  Filter,
  MoreVertical,
  SortAsc,
  Calendar,
  User,
  Flag,
  Folder,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface MobileTaskHeaderProps {
  projectName?: string;
  taskCount?: number;
  onMenuClick?: () => void;
  onFilterChange?: (filters: any) => void;
  onSortChange?: (sort: string) => void;
}

const MobileTaskHeader = ({ 
  projectName = 'All Tasks',
  taskCount = 0,
  onMenuClick,
  onFilterChange,
  onSortChange
}: MobileTaskHeaderProps) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    showCompleted: true,
    assignedToMe: false,
    unassigned: false,
    dueToday: false,
    overdue: false,
    highPriority: false
  });

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  const handleFilterChange = (key: string, value: boolean) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  return (
    <div className="bg-white border-b border-gray-200">
      {/* Main Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="h-9 w-9 p-0"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              {projectName}
            </h1>
            <p className="text-xs text-gray-500">
              {taskCount} task{taskCount !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter Button */}
          <Sheet open={showFilters} onOpenChange={setShowFilters}>
            <SheetTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-9 relative"
              >
                <Filter className="h-4 w-4" />
                {activeFilterCount > 0 && (
                  <Badge 
                    className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-600 text-white"
                  >
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh]">
              <SheetHeader>
                <SheetTitle>Filter Tasks</SheetTitle>
              </SheetHeader>
              
              <div className="mt-6 space-y-6">
                {/* Status Filters */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Status</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="show-completed" className="flex items-center gap-2 cursor-pointer">
                        <Check className="h-4 w-4 text-gray-500" />
                        Show completed tasks
                      </Label>
                      <Switch
                        id="show-completed"
                        checked={filters.showCompleted}
                        onCheckedChange={(checked) => handleFilterChange('showCompleted', checked)}
                      />
                    </div>
                  </div>
                </div>

                {/* Assignment Filters */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Assignment</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="assigned-to-me" className="flex items-center gap-2 cursor-pointer">
                        <User className="h-4 w-4 text-gray-500" />
                        Assigned to me
                      </Label>
                      <Switch
                        id="assigned-to-me"
                        checked={filters.assignedToMe}
                        onCheckedChange={(checked) => handleFilterChange('assignedToMe', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="unassigned" className="flex items-center gap-2 cursor-pointer">
                        <User className="h-4 w-4 text-gray-400" />
                        Unassigned tasks
                      </Label>
                      <Switch
                        id="unassigned"
                        checked={filters.unassigned}
                        onCheckedChange={(checked) => handleFilterChange('unassigned', checked)}
                      />
                    </div>
                  </div>
                </div>

                {/* Due Date Filters */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Due Date</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="due-today" className="flex items-center gap-2 cursor-pointer">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        Due today
                      </Label>
                      <Switch
                        id="due-today"
                        checked={filters.dueToday}
                        onCheckedChange={(checked) => handleFilterChange('dueToday', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="overdue" className="flex items-center gap-2 cursor-pointer">
                        <Calendar className="h-4 w-4 text-red-500" />
                        Overdue tasks
                      </Label>
                      <Switch
                        id="overdue"
                        checked={filters.overdue}
                        onCheckedChange={(checked) => handleFilterChange('overdue', checked)}
                      />
                    </div>
                  </div>
                </div>

                {/* Priority Filters */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Priority</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="high-priority" className="flex items-center gap-2 cursor-pointer">
                        <Flag className="h-4 w-4 text-red-600" />
                        High priority only
                      </Label>
                      <Switch
                        id="high-priority"
                        checked={filters.highPriority}
                        onCheckedChange={(checked) => handleFilterChange('highPriority', checked)}
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setFilters({
                        showCompleted: true,
                        assignedToMe: false,
                        unassigned: false,
                        dueToday: false,
                        overdue: false,
                        highPriority: false
                      });
                      onFilterChange?.({});
                    }}
                  >
                    Clear All
                  </Button>
                  <Button
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => setShowFilters(false)}
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Sort Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <SortAsc className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Sort by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onSortChange?.('dueDate')}>
                <Calendar className="h-4 w-4 mr-2" />
                Due date
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSortChange?.('priority')}>
                <Flag className="h-4 w-4 mr-2" />
                Priority
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSortChange?.('name')}>
                <SortAsc className="h-4 w-4 mr-2" />
                Task name
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSortChange?.('status')}>
                <Check className="h-4 w-4 mr-2" />
                Status
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* More Options */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Export tasks</DropdownMenuItem>
              <DropdownMenuItem>Print list</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default MobileTaskHeader;
