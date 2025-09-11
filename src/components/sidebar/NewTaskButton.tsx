
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const NewTaskButton = () => {
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);

  // Reset navigation state when component mounts
  useEffect(() => {
    setIsNavigating(false);
  }, []);

  const handleClick = () => {
    if (isNavigating) return;
    
    setIsNavigating(true);
    navigate('/tasks');
    
    // We'll use a small timeout to ensure the page has loaded before trying to open the dialog
    setTimeout(() => {
      try {
        const addTaskButton = document.querySelector<HTMLButtonElement>('button:has(.lucide-plus-circle)');
        if (addTaskButton) {
          addTaskButton.click();
        }
      } catch (error) {
        console.error("Error opening task dialog:", error);
      } finally {
        setIsNavigating(false);
      }
    }, 500); // Increased timeout for better reliability
  };

  return (
    <Button 
      size="sm" 
      className="w-full text-white mb-6 bg-neutral-950 hover:bg-neutral-800"
      onClick={handleClick}
      disabled={isNavigating}
    >
      <PlusCircle className="mr-2 h-4 w-4" />
      New Task
    </Button>
  );
};

export default NewTaskButton;
