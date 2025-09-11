
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useTask } from '@/context/TaskContext';
import { toast } from '@/hooks/use-toast';
import KanbanColumn from '@/components/tasks/KanbanColumn';
import NewTaskDialog from '@/components/tasks/NewTaskDialog';
import TaskHeader from '@/components/tasks/TaskHeader';
import TaskSummaryCards from '@/components/tasks/TaskSummaryCards';
import TaskViewToggle from '@/components/tasks/TaskViewToggle';
import TaskListView from '@/components/tasks/TaskListView';
import { TaskStatus } from '@/types/task';
import { useIsMobile } from '@/hooks/use-mobile';

type ViewMode = 'kanban' | 'list';

const Tasks = () => {
  const navigate = useNavigate();
  const { tasks, updateTask, getTasksByStatus, isLoading } = useTask();
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const isMobile = useIsMobile();
  
  // Always use list view on mobile
  const effectiveViewMode = isMobile ? 'list' : viewMode;
  
  // Get tasks by status
  const todoTasks = getTasksByStatus(TaskStatus.TODO);
  const inProgressTasks = getTasksByStatus(TaskStatus.IN_PROGRESS);
  const completedTasks = getTasksByStatus(TaskStatus.COMPLETED);
  
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };
  
  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    
    const taskId = e.dataTransfer.getData('taskId');
    
    if (!taskId) {
      console.error("No task ID found in drag data");
      return;
    }
    
    // Find the task that's being moved
    const task = tasks.find(t => t.id === taskId);
    if (!task) {
      console.error("Task not found with ID:", taskId);
      return;
    }
    
    if (task.status === status) {
      return;
    }
    
    // Create updatedFields object with correct typing
    const updatedFields: { status: TaskStatus; progress?: number } = {
      status: status
    };
    
    // Add progress update when moving to completed
    if (status === TaskStatus.COMPLETED) {
      updatedFields.progress = 100;
    }
    
    updateTask(taskId, updatedFields);
    
    toast({
      title: "Task Updated",
      description: `Task moved to ${status.replace('_', ' ')}`,
    });
  };
  
  const handleViewTask = (taskId: string) => {
    navigate(`/tasks/${taskId}`);
  };

  return (
    <Layout>
      <div className={`p-3 sm:p-4 md:p-6 max-w-[1600px] mx-auto ${isMobile ? 'pb-20' : ''}`}>
        {/* Header */}
        <TaskHeader onAddTaskClick={() => setIsNewTaskDialogOpen(true)} />
        <NewTaskDialog 
          isOpen={isNewTaskDialogOpen}
          onOpenChange={setIsNewTaskDialogOpen}
        />
        
        {/* Task Summary Cards */}
        <TaskSummaryCards 
          todoTasks={todoTasks}
          inProgressTasks={inProgressTasks}
          completedTasks={completedTasks}
        />
        
        {/* View toggle (only shown on desktop) */}
        {!isMobile && (
          <TaskViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
        )}
        
        {/* Loading state */}
        {isLoading ? (
          <div className="flex justify-center items-center p-8 sm:p-12">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-fmac-red"></div>
          </div>
        ) : (
          <>
            {/* Kanban Board (desktop only) */}
            {effectiveViewMode === 'kanban' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <KanbanColumn 
                  title="To Do" 
                  tasks={todoTasks} 
                  status={TaskStatus.TODO}
                  onTaskClick={task => navigate(`/tasks/${task.id}`)}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  columnColor="bg-blue-50"
                />
                <KanbanColumn 
                  title="In Progress" 
                  tasks={inProgressTasks} 
                  status={TaskStatus.IN_PROGRESS}
                  onTaskClick={task => navigate(`/tasks/${task.id}`)}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  columnColor="bg-amber-50"
                />
                <KanbanColumn 
                  title="Completed" 
                  tasks={completedTasks} 
                  status={TaskStatus.COMPLETED}
                  onTaskClick={task => navigate(`/tasks/${task.id}`)}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  columnColor="bg-green-50"
                />
              </div>
            )}
            
            {/* List View (default for mobile) */}
            {effectiveViewMode === 'list' && (
              <TaskListView 
                todoTasks={todoTasks} 
                inProgressTasks={inProgressTasks} 
                completedTasks={completedTasks} 
                onViewTask={handleViewTask} 
              />
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Tasks;
