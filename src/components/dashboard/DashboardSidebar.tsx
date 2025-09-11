
import DashboardTimer from './DashboardTimer';
import TeamMembersSummary from './TeamMembersSummary';
import DashboardCalendar from './DashboardCalendar';

const DashboardSidebar = () => {
  return (
    <div className="space-y-6">
      <DashboardTimer />
      <TeamMembersSummary />
      <DashboardCalendar />
    </div>
  );
};

export default DashboardSidebar;
