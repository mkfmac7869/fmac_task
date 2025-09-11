
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowDown, ArrowUp, Users } from 'lucide-react';

interface TeamStatsProps {
  totalMembers: number;
  totalTasksCompleted: number;
  totalTasksInProgress: number;
  isLoading?: boolean;
}

const TeamStats = ({ totalMembers, totalTasksCompleted, totalTasksInProgress, isLoading = false }: TeamStatsProps) => {
  // Calculate dummy growth rates for the demo
  const memberGrowth = "+2 new this month";
  const completedGrowth = "+15% from last month";
  const progressGrowth = "-5% from last month";
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
      <StatCard 
        title="Total Team Members"
        value={totalMembers.toString()}
        growth={memberGrowth}
        isPositive={true}
        icon={<Users className="h-6 w-6" />}
        isLoading={isLoading}
      />
      <StatCard 
        title="Tasks Completed" 
        value={totalTasksCompleted.toString()}
        growth={completedGrowth}
        isPositive={true}
        isLoading={isLoading}
      />
      <StatCard 
        title="Tasks In Progress" 
        value={totalTasksInProgress.toString()}
        growth={progressGrowth}
        isPositive={false}
        isLoading={isLoading}
      />
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  growth: string;
  isPositive: boolean;
  icon?: React.ReactNode;
  isLoading?: boolean;
}

const StatCard = ({ title, value, growth, isPositive, icon, isLoading = false }: StatCardProps) => (
  <Card>
    <CardContent className="pt-6">
      <h3 className="text-sm font-medium text-gray-500 mb-2">{title}</h3>
      
      {isLoading ? (
        <>
          <Skeleton className="h-10 w-20 mb-2" />
          <Skeleton className="h-4 w-32" />
        </>
      ) : (
        <>
          <div className="flex items-center">
            {icon && <span className="mr-2 text-gray-500">{icon}</span>}
            <p className="text-3xl font-bold">{value}</p>
          </div>
          <div className={`flex items-center text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
            <span>{growth}</span>
          </div>
        </>
      )}
    </CardContent>
  </Card>
);

export default TeamStats;
