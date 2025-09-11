
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useTask } from '@/context/TaskContext';
import { useAuth } from '@/context/AuthContext';
import { Task } from '@/types/task';
import { useIsMobile } from '@/hooks/use-mobile';
import { debugTaskIssue } from '@/utils/taskDebugger';

// Components
import TaskDetailsHeader from '@/components/taskDetails/TaskDetailsHeader';
import TaskDescription from '@/components/taskDetails/TaskDescription';
import TaskSidebar from '@/components/taskDetails/TaskSidebar';
import TaskNotFound from '@/components/taskDetails/TaskNotFound';
import TaskTabs from '@/components/taskDetails/TaskTabs';
import { TaskEditingProvider } from '@/components/taskDetails/TaskEditingProvider';

const TaskDetails = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const { tasks, getTaskById, updateTask, deleteTask, projects } = useTask();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const [task, setTask] = useState<Task | undefined>(undefined);
  const [project, setProject] = useState<any>(null);

  useEffect(() => {
    console.log('TaskDetails - taskId from URL:', taskId);
    console.log('TaskDetails - available task IDs:', tasks.map(t => t.id));
    console.log('TaskDetails - tasks length:', tasks.length);
    console.log('TaskDetails - isLoading:', isLoading);
    
    if (taskId) {
      // Debug task issue
      debugTaskIssue(taskId, tasks, user);
      
      const foundTask = getTaskById(taskId);
      console.log('TaskDetails - found task:', foundTask);
      
      if (foundTask) {
        setTask(foundTask);
        
        // Find related project
        const relatedProject = projects.find(p => p.id === foundTask.projectId);
        setProject(relatedProject || null);
      } else {
        console.log('TaskDetails - Task not found, setting task to undefined');
        setTask(undefined);
      }
    }
  }, [taskId, tasks, projects, getTaskById, isLoading, user]);

  // Show loading state while tasks are being fetched
  if (isLoading) {
    return (
      <Layout>
        <div className="p-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg">Loading task details...</div>
          </div>
        </div>
      </Layout>
    );
  }

  // If task is not found after loading is complete
  if (!task || !taskId) {
    console.log('TaskDetails - Rendering TaskNotFound component');
    return <TaskNotFound />;
  }
  
  const handleDeleteTask = () => {
    if (taskId) {
      deleteTask(taskId);
      navigate('/tasks');
    }
  };

  return (
    <Layout>
      <div className="p-4 md:p-6">
        <TaskEditingProvider task={task} updateTask={updateTask}>
          {({
            isEditing,
            editedTask,
            progressValue,
            setProgressValue,
            handleInputChange,
            handleStatusChange,
            handlePriorityChange,
            setIsEditing,
            handleSaveChanges,
            handleProgressUpdate
          }) => (
            <>
              <TaskDetailsHeader 
                title={task.title}
                isEditing={isEditing}
                editedTask={editedTask}
                handleInputChange={handleInputChange}
                setIsEditing={setIsEditing}
                handleSaveChanges={handleSaveChanges}
                handleDeleteTask={handleDeleteTask}
              />
              
              <div className={`grid grid-cols-1 ${isMobile ? '' : 'lg:grid-cols-3'} gap-6`}>
                {/* Mobile sidebar placement at top on small screens */}
                {isMobile && (
                  <TaskSidebar 
                    task={task}
                    project={project}
                    isEditing={isEditing}
                    editedTask={editedTask}
                    handleStatusChange={handleStatusChange}
                    handlePriorityChange={handlePriorityChange}
                  />
                )}
                
                <div className={`space-y-6 ${isMobile ? '' : 'lg:col-span-2'}`}>
                  <TaskDescription 
                    description={task.description}
                    isEditing={isEditing}
                    editedTask={editedTask}
                    progressValue={progressValue}
                    setProgressValue={setProgressValue}
                    handleInputChange={handleInputChange}
                    handleProgressUpdate={handleProgressUpdate}
                  />
                  
                  <TaskTabs
                    comments={[]}
                    currentUser={user}
                    taskId={taskId}
                  />
                </div>
                
                {/* Desktop sidebar placement at right */}
                {!isMobile && (
                  <TaskSidebar 
                    task={task}
                    project={project}
                    isEditing={isEditing}
                    editedTask={editedTask}
                    handleStatusChange={handleStatusChange}
                    handlePriorityChange={handlePriorityChange}
                  />
                )}
              </div>
            </>
          )}
        </TaskEditingProvider>
      </div>
    </Layout>
  );
};

export default TaskDetails;

