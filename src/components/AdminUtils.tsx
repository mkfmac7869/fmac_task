import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useTask } from '@/context/TaskContext';

const AdminUtils = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { setTasks, refreshTasks } = useTask();

  const handleCleanupDatabase = async () => {
    setIsLoading(true);
    try {
      // @ts-ignore - cleanupDatabase is available globally
      if ((window as any).cleanupDatabase) {
        const success = await (window as any).cleanupDatabase();
        if (success) {
          // Clear the tasks from the UI immediately
          setTasks([]);
          
          // Refresh the tasks data to reflect the cleanup
          setTimeout(async () => {
            await refreshTasks();
          }, 2000);
          
          toast({
            title: "Database Cleanup Complete",
            description: "All dummy data has been removed. Tasks will refresh shortly.",
          });
        } else {
          toast({
            title: "Cleanup Failed",
            description: "Some data may not have been removed. Check console for details.",
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Function Not Available",
          description: "Cleanup function not loaded",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Cleanup error:', error);
      toast({
        title: "Cleanup Failed",
        description: "Could not complete database cleanup",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInitializeDatabase = async () => {
    setIsLoading(true);
    try {
      // @ts-ignore - initializeDatabase is available globally
      if ((window as any).initializeDatabase) {
        const success = await (window as any).initializeDatabase();
        if (success) {
          toast({
            title: "Database Initialized",
            description: "Sample data has been created",
          });
        } else {
          toast({
            title: "Initialization Failed",
            description: "Some errors occurred during initialization",
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Function Not Available",
          description: "Initialize database function not loaded",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Database initialization error:', error);
      toast({
        title: "Database Initialization Failed",
        description: "Could not initialize database",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckDatabaseState = async () => {
    try {
      // @ts-ignore - checkDatabaseState is available globally
      if ((window as any).checkDatabaseState) {
        const state = await (window as any).checkDatabaseState();
        if (state) {
          toast({
            title: "Database State",
            description: `Departments: ${state.departments}, Profiles: ${state.profiles}, Tasks: ${state.tasks}, Projects: ${state.projects}`,
          });
        }
      } else {
        toast({
          title: "Function Not Available",
          description: "Check database state function not loaded",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Check database state error:', error);
      toast({
        title: "Check Failed",
        description: "Could not check database state",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Admin Utilities</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-gray-600">
          <p>Use these utilities to manage your database:</p>
          <ul className="mt-2 space-y-1">
            <li>• <strong>Cleanup Database:</strong> Remove all dummy data, keep only admin account</li>
            <li>• <strong>Initialize Database:</strong> Create sample data for testing</li>
            <li>• <strong>Check Database State:</strong> See current data counts</li>
          </ul>
        </div>
        
        <Button 
          onClick={handleCheckDatabaseState}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          Check Database State
        </Button>
        
        <Button 
          onClick={handleCleanupDatabase}
          disabled={isLoading}
          className="w-full bg-red-600 hover:bg-red-700"
        >
          {isLoading ? "Cleaning..." : "Cleanup Database (Keep Admin Only)"}
        </Button>
        
        <Button 
          onClick={handleInitializeDatabase}
          disabled={isLoading}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          {isLoading ? "Initializing..." : "Initialize Database (Sample Data)"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AdminUtils;