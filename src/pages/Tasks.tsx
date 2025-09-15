
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useTask } from '@/context/TaskContext';
import { toast } from '@/hooks/use-toast';
import EnhancedNewTaskDialog from '@/components/tasks/EnhancedNewTaskDialog';
import EnhancedTaskHeader from '@/components/tasks/EnhancedTaskHeader';
import ClickUpViewSwitcher, { ViewMode } from '@/components/tasks/ClickUpViewSwitcher';
import ClickUpListView from '@/components/tasks/ClickUpListView';
import ClickUpTableView from '@/components/tasks/ClickUpTableView';
import ClickUpBoardView from '@/components/tasks/ClickUpBoardView';
import ClickUpTaskPanel from '@/components/tasks/ClickUpTaskPanel';
import MobileTaskListView from '@/components/tasks/MobileTaskListView';
import MobileTaskHeader from '@/components/tasks/MobileTaskHeader';
import EnhancedMobileTaskPanel from '@/components/tasks/EnhancedMobileTaskPanel';
import { TaskStatus, Task } from '@/types/task';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTaskFilters } from '@/hooks/useTaskFilters';

const Tasks = () => {
  const navigate = useNavigate();
  const { tasks, updateTask, deleteTask, getTasksByStatus, isLoading } = useTask();
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const isMobile = useIsMobile();
  
  // Use task filters hook
  const {
    filters,
    sortConfig,
    filteredTasks,
    updateFilter,
    resetFilters,
    updateSort,
    activeFilterCount
  } = useTaskFilters(tasks);
  
  // Mobile-optimized view
  const effectiveViewMode = isMobile ? 'list' : viewMode;
  
  // Get tasks by status
  const todoTasks = getTasksByStatus(TaskStatus.TODO);
  const inProgressTasks = getTasksByStatus(TaskStatus.IN_PROGRESS);
  const completedTasks = getTasksByStatus(TaskStatus.COMPLETED);
  
  const handleUpdateTask = (taskId: string, updatedFields: Partial<Task>) => {
    updateTask(taskId, updatedFields);
    
    if (updatedFields.status) {
      toast({
        title: "Task Updated",
        description: `Task moved to ${updatedFields.status.replace('_', ' ')}`,
      });
    }
  };
  
  const handleViewTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setSelectedTask(task);
      setIsPanelOpen(true);
    }
  };
  
  const handleClosePanel = () => {
    setIsPanelOpen(false);
    setTimeout(() => setSelectedTask(null), 300);
  };
  
  const handlePanelUpdateTask = (taskId: string, updates: Partial<Task>) => {
    handleUpdateTask(taskId, updates);
    // Update the selected task if it's the one being updated
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask({ ...selectedTask, ...updates });
    }
  };
  
  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
    handleClosePanel();
    toast({
      title: "Task Deleted",
      description: "The task has been deleted successfully.",
    });
  };

  if (isMobile) {
    return (
      <Layout>
        <div className="h-full flex flex-col bg-gray-50">
          {/* Mobile Header */}
          <MobileTaskHeader 
            taskCount={filteredTasks.length}
            onMenuClick={() => {
              // Handle menu click if needed
            }}
            filters={filters}
            sortConfig={sortConfig}
            updateFilter={updateFilter}
            updateSort={updateSort}
            resetFilters={resetFilters}
            activeFilterCount={activeFilterCount}
          />
          
          {/* Mobile Task List */}
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
          ) : (
            <MobileTaskListView 
              tasks={tasks}
              onTaskClick={handleViewTask}
              onUpdateTask={handleUpdateTask}
              onNewTask={() => setIsNewTaskDialogOpen(true)}
            />
          )}
          
          {/* New Task Dialog */}
          <EnhancedNewTaskDialog 
            isOpen={isNewTaskDialogOpen}
            onOpenChange={setIsNewTaskDialogOpen}
          />
          
          {/* Task Details Panel */}
          <EnhancedMobileTaskPanel
            task={selectedTask}
            isOpen={isPanelOpen}
            onClose={handleClosePanel}
            onUpdateTask={handlePanelUpdateTask}
            onDeleteTask={handleDeleteTask}
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="h-full flex flex-col bg-gray-50">
        {/* Desktop Header */}
        <EnhancedTaskHeader 
          onNewTask={() => setIsNewTaskDialogOpen(true)}
          taskCount={filteredTasks.length}
          filters={filters}
          sortConfig={sortConfig}
          updateFilter={updateFilter}
          updateSort={updateSort}
          resetFilters={resetFilters}
          activeFilterCount={activeFilterCount}
        />
        <EnhancedNewTaskDialog 
          isOpen={isNewTaskDialogOpen}
          onOpenChange={setIsNewTaskDialogOpen}
        />
        
        {/* View Switcher */}
        <div className="bg-white border-b border-gray-200 px-4 py-2">
          <ClickUpViewSwitcher 
            currentView={viewMode}
            onViewChange={setViewMode}
            availableViews={['list', 'board', 'table']}
          />
        </div>
        
        {/* Main content area */}
        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
          ) : (
            <div className="p-4">
              {/* List View */}
              {viewMode === 'list' && (
                <ClickUpListView 
                  tasks={filteredTasks}
                  onTaskClick={handleViewTask}
                  onUpdateTask={handleUpdateTask}
                />
              )}
              
              {/* Table View */}
              {viewMode === 'table' && (
                <ClickUpTableView 
                  tasks={filteredTasks}
                  onTaskClick={handleViewTask}
                  onUpdateTask={handleUpdateTask}
                />
              )}
              
              {/* Board View */}
              {viewMode === 'board' && (
                <ClickUpBoardView 
                  tasks={filteredTasks}
                  onTaskClick={handleViewTask}
                  onUpdateTask={handleUpdateTask}
                />
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Task Details Panel */}
      <ClickUpTaskPanel
        task={selectedTask}
        isOpen={isPanelOpen}
        onClose={handleClosePanel}
        onUpdateTask={handlePanelUpdateTask}
        onDeleteTask={handleDeleteTask}
      />
    </Layout>
  );
};

export default Tasks;
