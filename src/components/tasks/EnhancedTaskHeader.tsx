import { useState } from 'react';
import { 
  Plus,
  Filter,
  Search,
  X,
  Calendar,
  User,
  Flag,
  Folder,
  Check,
  SortAsc,
  Tag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { TaskFilters, SortConfig } from '@/hooks/useTaskFilters';
import { useFetchMembers } from '@/hooks/memberManagement/useFetchMembers';
import { TaskPriority } from '@/types/task';
import { useTask } from '@/context/TaskContext';

interface EnhancedTaskHeaderProps {
  onNewTask: () => void;
  taskCount: number;
  filters: TaskFilters;
  sortConfig: SortConfig;
  updateFilter: <K extends keyof TaskFilters>(key: K, value: TaskFilters[K]) => void;
  updateSort: (field: SortConfig['field']) => void;
  resetFilters: () => void;
  activeFilterCount: number;
  availableTags: string[];
}

const EnhancedTaskHeader = ({ 
  onNewTask,
  taskCount,
  filters,
  sortConfig,
  updateFilter,
  updateSort,
  resetFilters,
  activeFilterCount,
  availableTags
}: EnhancedTaskHeaderProps) => {
  const { projects } = useTask();
  const { users } = useFetchMembers();
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">All Tasks</h1>
            <p className="text-sm text-gray-500 mt-1">
              {taskCount} task{taskCount !== 1 ? 's' : ''} found
            </p>
          </div>
          
          <Button 
            onClick={onNewTask}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </div>

        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search tasks..." 
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="pl-9 pr-9 h-9"
            />
            {filters.search && (
              <button
                onClick={() => updateFilter('search', '')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            )}
          </div>

          {/* Filter Button */}
          <Popover open={showFilters} onOpenChange={setShowFilters}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="h-9 relative"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge 
                    className="ml-2 h-5 px-1.5 bg-red-600 text-white"
                  >
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="end">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Filters</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetFilters}
                    className="h-8 px-2"
                  >
                    Clear all
                  </Button>
                </div>

                {/* Status Filter */}
                <div>
                  <Label className="text-sm font-medium mb-2">Status</Label>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm">Show completed tasks</span>
                    <Switch
                      checked={filters.showCompleted}
                      onCheckedChange={(checked) => updateFilter('showCompleted', checked)}
                    />
                  </div>
                </div>

                {/* Assignment Filter */}
                <div>
                  <Label className="text-sm font-medium mb-2">Assignment</Label>
                  <div className="space-y-2 mt-2">
                    <Button
                      variant={filters.assignee === 'all' ? 'default' : 'outline'}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => updateFilter('assignee', 'all')}
                    >
                      <User className="h-4 w-4 mr-2" />
                      All members
                    </Button>
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
                      Unassigned
                    </Button>
                    
                    {/* Specific Members */}
                    {users && users.length > 0 && (
                      <div className="border-t pt-2 mt-2">
                        <Label className="text-xs text-gray-500 mb-1 block">Filter by member:</Label>
                        <div className="space-y-1 max-h-32 overflow-y-auto">
                          {users.map((user) => (
                            <Button
                              key={user.id}
                              variant={filters.assignee === user.id ? 'default' : 'outline'}
                              size="sm"
                              className="w-full justify-start text-xs h-7"
                              onClick={() => updateFilter('assignee', filters.assignee === user.id ? 'all' : user.id)}
                            >
                              <img 
                                src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`}
                                alt={user.name}
                                className="h-3 w-3 rounded-full mr-2"
                              />
                              {user.name}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Due Date Filter */}
                <div>
                  <Label className="text-sm font-medium mb-2">Due Date</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Button
                      variant={filters.dueDate === 'today' ? 'default' : 'outline'}
                      size="sm"
                      className="justify-start"
                      onClick={() => updateFilter('dueDate', filters.dueDate === 'today' ? 'all' : 'today')}
                    >
                      Today
                    </Button>
                    <Button
                      variant={filters.dueDate === 'tomorrow' ? 'default' : 'outline'}
                      size="sm"
                      className="justify-start"
                      onClick={() => updateFilter('dueDate', filters.dueDate === 'tomorrow' ? 'all' : 'tomorrow')}
                    >
                      Tomorrow
                    </Button>
                    <Button
                      variant={filters.dueDate === 'this_week' ? 'default' : 'outline'}
                      size="sm"
                      className="justify-start"
                      onClick={() => updateFilter('dueDate', filters.dueDate === 'this_week' ? 'all' : 'this_week')}
                    >
                      This week
                    </Button>
                    <Button
                      variant={filters.dueDate === 'overdue' ? 'default' : 'outline'}
                      size="sm"
                      className="justify-start"
                      onClick={() => updateFilter('dueDate', filters.dueDate === 'overdue' ? 'all' : 'overdue')}
                    >
                      Overdue
                    </Button>
                  </div>
                </div>

                {/* Priority Filter */}
                <div>
                  <Label className="text-sm font-medium mb-2">Priority</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Button
                      variant={filters.priority === TaskPriority.URGENT ? 'default' : 'outline'}
                      size="sm"
                      className="justify-start"
                      onClick={() => updateFilter('priority', filters.priority === TaskPriority.URGENT ? 'all' : TaskPriority.URGENT)}
                    >
                      <Flag className="h-3.5 w-3.5 mr-1.5 text-red-600" />
                      Urgent
                    </Button>
                    <Button
                      variant={filters.priority === TaskPriority.HIGH ? 'default' : 'outline'}
                      size="sm"
                      className="justify-start"
                      onClick={() => updateFilter('priority', filters.priority === TaskPriority.HIGH ? 'all' : TaskPriority.HIGH)}
                    >
                      <Flag className="h-3.5 w-3.5 mr-1.5 text-yellow-600" />
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
                    <Label className="text-sm font-medium mb-2">Project</Label>
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
                      <DropdownMenuContent className="w-56">
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
                <div>
                  <Label className="text-sm font-medium mb-2">Tags</Label>
                  <div className="space-y-2 mt-2">
                    <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
                      {availableTags.length > 0 ? (
                        availableTags.map((tag) => (
                          <Button
                            key={tag}
                            variant={filters.tags.includes(tag) ? 'default' : 'outline'}
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => {
                              const newTags = filters.tags.includes(tag)
                                ? filters.tags.filter(t => t !== tag)
                                : [...filters.tags, tag];
                              updateFilter('tags', newTags);
                            }}
                          >
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Button>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">No tags available</p>
                      )}
                    </div>
                    {filters.tags.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updateFilter('tags', [])}
                        className="h-7 text-xs"
                      >
                        Clear tags
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-9">
                <SortAsc className="h-4 w-4 mr-2" />
                Sort
                <span className="ml-2 text-xs text-gray-500">
                  {sortConfig.direction === 'asc' ? '↑' : '↓'}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Sort by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => updateSort('createdAt')}>
                <Calendar className="h-4 w-4 mr-2" />
                Date created
                {sortConfig.field === 'createdAt' && (
                  <Check className="h-3.5 w-3.5 ml-auto" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => updateSort('dueDate')}>
                <Calendar className="h-4 w-4 mr-2" />
                Due date
                {sortConfig.field === 'dueDate' && (
                  <Check className="h-3.5 w-3.5 ml-auto" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => updateSort('title')}>
                <SortAsc className="h-4 w-4 mr-2" />
                Task name
                {sortConfig.field === 'title' && (
                  <Check className="h-3.5 w-3.5 ml-auto" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => updateSort('priority')}>
                <Flag className="h-4 w-4 mr-2" />
                Priority
                {sortConfig.field === 'priority' && (
                  <Check className="h-3.5 w-3.5 ml-auto" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => updateSort('status')}>
                <Check className="h-4 w-4 mr-2" />
                Status
                {sortConfig.field === 'status' && (
                  <Check className="h-3.5 w-3.5 ml-auto" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => updateSort('assignee')}>
                <User className="h-4 w-4 mr-2" />
                Assignee
                {sortConfig.field === 'assignee' && (
                  <Check className="h-3.5 w-3.5 ml-auto" />
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default EnhancedTaskHeader;
