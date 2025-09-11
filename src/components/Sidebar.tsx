
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import UserProfile from './sidebar/UserProfile';
import NewTaskButton from './sidebar/NewTaskButton';
import SidebarNavigation from './sidebar/SidebarNavigation';
import SidebarFooter from './sidebar/SidebarFooter';
import { Menu, X, ChevronUp } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLocation } from 'react-router-dom';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const location = useLocation();

  // Close sidebar when route changes
  useEffect(() => {
    if (isMobile && isOpen) {
      setIsOpen(false);
    }
  }, [location.pathname, isMobile]);

  // Handle scroll to show/hide scroll-to-top button
  useEffect(() => {
    if (!isMobile) return;

    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile]);

  const toggleSidebar = () => setIsOpen(!isOpen);
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Mobile sidebar with slide-in animation
  if (isMobile) {
    return (
      <>
        {/* Mobile Menu Button */}
        <button 
          onClick={toggleSidebar}
          className="fixed top-3 left-3 z-50 p-2 bg-white rounded-md shadow-md"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5 text-gray-700" />
        </button>
        
        {/* Scroll to top button */}
        {showScrollToTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-20 right-4 z-40 p-2 bg-white rounded-full shadow-md"
            aria-label="Scroll to top"
          >
            <ChevronUp className="h-5 w-5 text-gray-700" />
          </button>
        )}
        
        {/* Mobile Sidebar Overlay */}
        {isOpen && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
            onClick={() => setIsOpen(false)}
          />
        )}
        
        {/* Mobile Sidebar */}
        <div className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <img 
              src="/lovable-uploads/12200d27-0f39-4e75-89c4-b025409ec072.png" 
              alt="FMAC Logo" 
              className="h-8" 
            />
            <button 
              onClick={toggleSidebar}
              className="p-1 rounded-md hover:bg-gray-100"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>
          
          <div className="p-3 overflow-y-auto max-h-[calc(100vh-64px)]">
            <UserProfile user={user} />
            <NewTaskButton />
            <SidebarNavigation user={user} />
          </div>
          
          <SidebarFooter logout={logout} />
        </div>
        
        {/* Mobile Bottom Navigation Bar */}
        <div className="fixed bottom-0 left-0 right-0 h-14 bg-white border-t border-gray-200 flex justify-around items-center z-40 px-1">
          <SidebarNavigation user={user} bottomNav={true} />
        </div>
      </>
    );
  }
  
  // Desktop sidebar (unchanged)
  return (
    <div className="w-64 h-screen flex flex-col border-r border-gray-200 bg-white">
      <div className="p-4 flex items-center justify-center border-b border-gray-200 bg-white">
        <img 
          src="/lovable-uploads/12200d27-0f39-4e75-89c4-b025409ec072.png" 
          alt="FMAC Logo" 
          className="h-12" 
        />
      </div>
      
      <div className="p-3">
        <UserProfile user={user} />
        <NewTaskButton />
        <SidebarNavigation user={user} />
      </div>
      
      <SidebarFooter logout={logout} />
    </div>
  );
};

export default Sidebar;
