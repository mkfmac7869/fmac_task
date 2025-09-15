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
  filters: any;
  sortConfig: any;
  updateFilter: (key: string, value: any) => void;
  updateSort: (field: string) => void;
  resetFilters: () => void;
  activeFilterCount: number;
}

const MobileTaskHeader = ({ 
  projectName = 'All Tasks',
  taskCount = 0,
  onMenuClick,
  filters,
  sortConfig,
  updateFilter,
  updateSort,
  resetFilters,
  activeFilterCount
}: MobileTaskHeaderProps) => {
  const [showFilters, setShowFilters] = useState(false);

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
                        onCheckedChange={(checked) => updateFilter('showCompleted', checked)}
                      />
                    </div>
                  </div>
                </div>

                {/* Assignment Filters */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Assignment</h3>
                  <div className="space-y-3">
                    <Button
                      variant={filters.assignee === 'me' ? 'default' : 'outline'}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => updateFilter('assignee', filters.assignee === 'me' ? 'all' : 'me')}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Assigned to me
                    </Button>
                    <Button
                      variant={filters.assignee === 'unassigned' ? 'default' : 'outline'}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => updateFilter('assignee', filters.assignee === 'unassigned' ? 'all' : 'unassigned')}
                    >
                      <User className="h-4 w-4 mr-2 text-gray-400" />
                      Unassigned tasks
                    </Button>
                  </div>
                </div>

                {/* Due Date Filters */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Due Date</h3>
                  <div className="space-y-3">
                    <Button
                      variant={filters.dueDate === 'today' ? 'default' : 'outline'}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => updateFilter('dueDate', filters.dueDate === 'today' ? 'all' : 'today')}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Due today
                    </Button>
                    <Button
                      variant={filters.dueDate === 'overdue' ? 'default' : 'outline'}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => updateFilter('dueDate', filters.dueDate === 'overdue' ? 'all' : 'overdue')}
                    >
                      <Calendar className="h-4 w-4 mr-2 text-red-500" />
                      Overdue tasks
                    </Button>
                    <Button
                      variant={filters.dueDate === 'this_week' ? 'default' : 'outline'}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => updateFilter('dueDate', filters.dueDate === 'this_week' ? 'all' : 'this_week')}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      This week
                    </Button>
                  </div>
                </div>

                {/* Priority Filters */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Priority</h3>
                  <div className="space-y-3">
                    <Button
                      variant={filters.priority === 'urgent' ? 'default' : 'outline'}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => updateFilter('priority', filters.priority === 'urgent' ? 'all' : 'urgent')}
                    >
                      <Flag className="h-4 w-4 mr-2 text-red-600" />
                      Urgent only
                    </Button>
                    <Button
                      variant={filters.priority === 'high' ? 'default' : 'outline'}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => updateFilter('priority', filters.priority === 'high' ? 'all' : 'high')}
                    >
                      <Flag className="h-4 w-4 mr-2 text-yellow-600" />
                      High priority
                    </Button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={resetFilters}
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
              <DropdownMenuItem onClick={() => updateSort('dueDate')}>
                <Calendar className="h-4 w-4 mr-2" />
                Due date
                {sortConfig.field === 'dueDate' && (
                  <span className="ml-auto text-xs text-gray-500">
                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => updateSort('priority')}>
                <Flag className="h-4 w-4 mr-2" />
                Priority
                {sortConfig.field === 'priority' && (
                  <span className="ml-auto text-xs text-gray-500">
                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => updateSort('title')}>
                <SortAsc className="h-4 w-4 mr-2" />
                Task name
                {sortConfig.field === 'title' && (
                  <span className="ml-auto text-xs text-gray-500">
                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => updateSort('status')}>
                <Check className="h-4 w-4 mr-2" />
                Status
                {sortConfig.field === 'status' && (
                  <span className="ml-auto text-xs text-gray-500">
                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                  </span>
                )}
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
