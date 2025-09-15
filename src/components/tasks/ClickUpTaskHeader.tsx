import { 
  Plus, 
  Search, 
  Filter, 
  Users, 
  Calendar,
  MoreHorizontal,
  Settings,
  Download,
  Eye,
  EyeOff,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface ClickUpTaskHeaderProps {
  onNewTask: () => void;
  projectName?: string;
  taskCount?: number;
}

const ClickUpTaskHeader = ({ 
  onNewTask, 
  projectName = 'All Tasks',
  taskCount = 0
}: ClickUpTaskHeaderProps) => {
  return (
    <div className="border-b border-gray-200 bg-white">
      {/* Top toolbar */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          {/* Project selector */}
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-gray-900">{projectName}</h1>
            <ChevronDown className="h-4 w-4 text-gray-500" />
            <Badge variant="secondary" className="bg-gray-100 text-gray-700 text-xs px-2">
              {taskCount}
            </Badge>
          </div>
          
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search tasks..." 
              className="pl-9 pr-4 h-9 w-80 bg-gray-50 border-gray-200 focus:bg-white"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Filter button */}
          <Button variant="outline" size="sm" className="h-9 border-gray-200">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          
          {/* Assignee avatars */}
          <div className="flex -space-x-2 mr-2">
            <Avatar className="h-8 w-8 border-2 border-white">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <Avatar className="h-8 w-8 border-2 border-white">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>AB</AvatarFallback>
            </Avatar>
            <Button 
              variant="outline" 
              size="sm"
              className="h-8 w-8 rounded-full p-0 border-2 border-white bg-gray-100"
            >
              <Users className="h-3.5 w-3.5 text-gray-600" />
            </Button>
          </div>
          
          {/* Calendar button */}
          <Button variant="outline" size="sm" className="h-9 border-gray-200">
            <Calendar className="h-4 w-4" />
          </Button>
          
          {/* Show/Hide button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 border-gray-200">
                <Eye className="h-4 w-4 mr-2" />
                Show
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Eye className="h-4 w-4 mr-2" />
                Show subtasks
              </DropdownMenuItem>
              <DropdownMenuItem>
                <EyeOff className="h-4 w-4 mr-2" />
                Hide closed tasks
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="h-4 w-4 mr-2" />
                View settings
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* More options */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 w-9 p-0 border-gray-200">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Download className="h-4 w-4 mr-2" />
                Export tasks
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="h-4 w-4 mr-2" />
                List settings
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* New task button */}
          <Button 
            onClick={onNewTask}
            className="h-9 bg-red-600 hover:bg-red-700 text-white"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            New Task
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ClickUpTaskHeader;
