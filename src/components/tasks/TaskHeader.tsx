
import { Button } from '@/components/ui/button';
import { PlusCircle, Filter } from 'lucide-react';
import TaskSearchBar from './TaskSearchBar';
import { useIsMobile } from '@/hooks/use-mobile';

interface TaskHeaderProps {
  onAddTaskClick: () => void;
}

const TaskHeader = ({ onAddTaskClick }: TaskHeaderProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col space-y-4 mb-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 md:gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1">My Tasks</h1>
          <p className="text-sm md:text-base text-gray-500">Manage and organize your tasks efficiently</p>
        </div>
        
        {!isMobile && (
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <TaskSearchBar />
              <Button 
                variant="outline"
                size="icon"
                className="ml-2"
                aria-label="Filter tasks"
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
            <Button 
              variant="default" 
              className="bg-fmac-red hover:bg-fmac-red/90 px-4" 
              onClick={onAddTaskClick}
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Add Task
            </Button>
          </div>
        )}
      </div>
      
      {/* Mobile actions row */}
      {isMobile && (
        <div className="flex items-center gap-2">
          <TaskSearchBar />
          <Button 
            variant="outline"
            size="icon"
            className="flex-shrink-0"
            aria-label="Filter tasks"
          >
            <Filter className="h-4 w-4" />
          </Button>
          <Button 
            variant="default" 
            className="flex-shrink-0 bg-fmac-red hover:bg-fmac-red/90 ml-auto" 
            size="sm"
            onClick={onAddTaskClick}
          >
            <PlusCircle className="mr-1 h-4 w-4" /> Add
          </Button>
        </div>
      )}
    </div>
  );
};

export default TaskHeader;
