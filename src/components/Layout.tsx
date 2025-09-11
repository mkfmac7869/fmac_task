
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/context/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user } = useAuth();
  const isMobile = useIsMobile();

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className={`flex-1 overflow-auto bg-gray-50 ${isMobile ? 'pt-16 pb-16' : ''}`}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
