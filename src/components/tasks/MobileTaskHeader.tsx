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
  Check,
  Tag
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
import { TaskPriority } from '@/types/task';
import { useTask } from '@/context/TaskContext';

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
  availableTags?: string[];
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
  activeFilterCount,
  availableTags = []
}: MobileTaskHeaderProps) => {
  const { projects } = useTask();
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
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={filters.priority === TaskPriority.URGENT ? 'default' : 'outline'}
                      size="sm"
                      className="justify-start"
                      onClick={() => updateFilter('priority', filters.priority === TaskPriority.URGENT ? 'all' : TaskPriority.URGENT)}
                    >
                      <Flag className="h-3.5 w-3.5 mr-1.5 text-red-600 fill-current" />
                      Urgent
                    </Button>
                    <Button
                      variant={filters.priority === TaskPriority.HIGH ? 'default' : 'outline'}
                      size="sm"
                      className="justify-start"
                      onClick={() => updateFilter('priority', filters.priority === TaskPriority.HIGH ? 'all' : TaskPriority.HIGH)}
                    >
                      <Flag className="h-3.5 w-3.5 mr-1.5 text-yellow-600 fill-current" />
                      High
                    </Button>
                    <Button
                      variant={filters.priority === TaskPriority.MEDIUM ? 'default' : 'outline'}
                      size="sm"
                      className="justify-start"
                      onClick={() => updateFilter('priority', filters.priority === TaskPriority.MEDIUM ? 'all' : TaskPriority.MEDIUM)}
                    >
                      <Flag className="h-3.5 w-3.5 mr-1.5 text-blue-600" />
                      Medium
                    </Button>
                    <Button
                      variant={filters.priority === TaskPriority.LOW ? 'default' : 'outline'}
                      size="sm"
                      className="justify-start"
                      onClick={() => updateFilter('priority', filters.priority === TaskPriority.LOW ? 'all' : TaskPriority.LOW)}
                    >
                      <Flag className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                      Low
                    </Button>
                  </div>
                </div>

                {/* Project Filter */}
                {projects.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Project</h3>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="w-full justify-between">
                          {filters.project === 'all' ? (
                            <>
                              <span>All projects</span>
                              <Folder className="h-4 w-4 ml-2" />
                            </>
                          ) : (
                            <>
                              <span className="truncate">
                                {projects.find(p => p.id === filters.project)?.name || 'Select project'}
                              </span>
                              <div 
                                className="w-3 h-3 rounded ml-2" 
                                style={{ 
                                  backgroundColor: projects.find(p => p.id === filters.project)?.color || '#ccc' 
                                }}
                              />
                            </>
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56 max-h-60 overflow-auto">
                        <DropdownMenuItem onClick={() => updateFilter('project', 'all')}>
                          All projects
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {projects.map((project) => (
                          <DropdownMenuItem 
                            key={project.id}
                            onClick={() => updateFilter('project', project.id)}
                          >
                            <div className="flex items-center gap-2 w-full">
                              <div 
                                className="w-3 h-3 rounded" 
                                style={{ backgroundColor: project.color }}
                              />
                              <span className="truncate">{project.name}</span>
                            </div>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}

                {/* Tags Filter */}
                {availableTags.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                      {availableTags.map((tag) => (
                        <Button
                          key={tag}
                          variant={filters.tags?.includes(tag) ? 'default' : 'outline'}
                          size="sm"
                          className="h-8 text-xs"
                          onClick={() => {
                            const currentTags = filters.tags || [];
                            const newTags = currentTags.includes(tag)
                              ? currentTags.filter(t => t !== tag)
                              : [...currentTags, tag];
                            updateFilter('tags', newTags);
                          }}
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Button>
                      ))}
                    </div>
                    {filters.tags?.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updateFilter('tags', [])}
                        className="mt-2 h-8 text-xs w-full"
                      >
                        Clear tags
                      </Button>
                    )}
                  </div>
                )}

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
