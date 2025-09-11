
import { Task } from '@/types/task';
import { Badge } from '@/components/ui/badge';
import { ListChecks, Calendar, CheckSquare } from 'lucide-react';

interface TaskSummaryCardsProps {
  todoTasks: Task[];
  inProgressTasks: Task[];
  completedTasks: Task[];
}

const TaskSummaryCards = ({ todoTasks, inProgressTasks, completedTasks }: TaskSummaryCardsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
      <div className="bg-white border rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-md bg-blue-100">
              <ListChecks className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="font-semibold">To Do</h3>
          </div>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {todoTasks.length}
          </Badge>
        </div>
        <p className="text-gray-500 text-sm">Tasks waiting to be started</p>
      </div>
      
      <div className="bg-white border rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-md bg-amber-100">
              <Calendar className="h-5 w-5 text-amber-600" />
            </div>
            <h3 className="font-semibold">In Progress</h3>
          </div>
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            {inProgressTasks.length}
          </Badge>
        </div>
        <p className="text-gray-500 text-sm">Tasks currently being worked on</p>
      </div>
      
      <div className="bg-white border rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-md bg-green-100">
              <CheckSquare className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="font-semibold">Completed</h3>
          </div>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            {completedTasks.length}
          </Badge>
        </div>
        <p className="text-gray-500 text-sm">Tasks that have been completed</p>
      </div>
    </div>
  );
};

export default TaskSummaryCards;
