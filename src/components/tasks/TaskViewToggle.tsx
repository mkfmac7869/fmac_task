
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TaskViewToggleProps {
  viewMode: 'kanban' | 'list';
  onViewModeChange: (value: 'kanban' | 'list') => void;
}

const TaskViewToggle = ({ viewMode, onViewModeChange }: TaskViewToggleProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold">Task Board</h2>
      <Tabs value={viewMode} onValueChange={(value) => onViewModeChange(value as 'kanban' | 'list')} className="w-auto">
        <TabsList className="bg-gray-100">
          <TabsTrigger value="kanban" className="data-[state=active]:bg-white">Kanban</TabsTrigger>
          <TabsTrigger value="list" className="data-[state=active]:bg-white">List</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default TaskViewToggle;
