
import Layout from '@/components/Layout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import TaskStatusCards from '@/components/dashboard/TaskStatusCards';
import RecentTasks from '@/components/dashboard/RecentTasks';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';

const Dashboard = () => {
  return (
    <Layout>
      <div className="p-6">
        <DashboardHeader />
        <TaskStatusCards />
        
        {/* Task List and Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentTasks />
          </div>
          <DashboardSidebar />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
