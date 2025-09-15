
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import { Toaster } from './components/ui/toaster';
import AuthGuard from './components/AuthGuard';
import { useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { initializePushNotifications } from './lib/pushNotificationService';
import './styles/clickup-theme.css';

// Pages
import Index from './pages/Index';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import ClickUpTaskDetails from './pages/ClickUpTaskDetails';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import Team from './pages/Team';
import MemberProfile from './pages/MemberProfile';
import Calendar from './pages/Calendar';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import MemberManagement from './pages/MemberManagement';
import DepartmentManagement from './pages/DepartmentManagement';
import NotFound from './pages/NotFound';

// Component to initialize push notifications
function PushNotificationInitializer() {
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      initializePushNotifications(user.id);
    }
  }, [user?.id]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TaskProvider>
          <PushNotificationInitializer />
          <Toaster />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={
              <AuthGuard requireAuth={false}>
                <Login />
              </AuthGuard>
            } />
            <Route path="/signup" element={
              <AuthGuard requireAuth={false}>
                <Signup />
              </AuthGuard>
            } />
            
            <Route element={<AuthGuard />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/tasks/:taskId" element={<ClickUpTaskDetails />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:projectId" element={<ProjectDetails />} />
              <Route path="/team" element={<Team />} />
              <Route path="/member-profile/:id" element={<MemberProfile />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/member-management" element={<MemberManagement />} />
              <Route path="/department-management" element={<DepartmentManagement />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TaskProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
