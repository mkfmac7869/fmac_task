
import { Card, CardContent } from '@/components/ui/card';

interface MemberStatsCardsProps {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  todoTasks: number;
}

const MemberStatsCards = ({
  totalTasks,
  completedTasks,
  inProgressTasks,
  todoTasks
}: MemberStatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-4 flex flex-col items-center justify-center">
          <p className="text-sm text-gray-500 mb-1">Total Tasks</p>
          <p className="text-2xl font-bold">{totalTasks}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 flex flex-col items-center justify-center">
          <p className="text-sm text-gray-500 mb-1">Completed</p>
          <p className="text-2xl font-bold text-green-600">{completedTasks}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 flex flex-col items-center justify-center">
          <p className="text-sm text-gray-500 mb-1">In Progress</p>
          <p className="text-2xl font-bold text-amber-600">{inProgressTasks}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 flex flex-col items-center justify-center">
          <p className="text-sm text-gray-500 mb-1">To Do</p>
          <p className="text-2xl font-bold text-blue-600">{todoTasks}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MemberStatsCards;
