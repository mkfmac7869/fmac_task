import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Layout from '@/components/Layout';
import { useTask } from '@/context/TaskContext';
import { useAuth } from '@/context/AuthContext';
import { Task } from '@/types/task';
import { Button } from '@/components/ui/button';

const SimpleTaskDetails = () => {
  console.log("SimpleTaskDetails component rendering");
  
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { tasks, getTaskById, isLoading } = useTask();
  
  console.log("SimpleTaskDetails state:", {
    taskId,
    user: user?.name,
    tasksCount: tasks?.length,
    isLoading
  });
  
  const [task, setTask] = useState<Task | undefined>(undefined);
  
  // Load task data
  useEffect(() => {
    console.log("Task loading effect triggered:", { taskId, isLoading, tasksLength: tasks?.length });
    
    if (taskId && !isLoading && tasks && tasks.length > 0) {
      const foundTask = getTaskById(taskId);
      console.log("Found task:", foundTask ? { id: foundTask.id, title: foundTask.title } : "null");
      
      if (foundTask) {
        setTask(foundTask);
        console.log("Task set successfully:", foundTask.title);
      }
    }
  }, [taskId, isLoading, tasks, getTaskById]);

  console.log("Loading checks:", { isLoading, task: task?.title });

  if (isLoading) {
    console.log("Showing loading spinner");
    return (
      <Layout>
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      </Layout>
    );
  }

  if (!task) {
    console.log("No task found, showing not found message");
    return (
      <Layout>
        <div className="flex justify-center items-center h-full">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900">Task not found</h2>
            <p className="text-gray-600 mt-2">The task you're looking for doesn't exist.</p>
            <p className="text-sm text-gray-500 mt-1">Task ID: {taskId}</p>
            <p className="text-sm text-gray-500">Available tasks: {tasks?.length || 0}</p>
            <Button 
              onClick={() => navigate('/tasks')}
              className="mt-4"
            >
              Back to Tasks
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  console.log("Rendering simple task details for:", task.title);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/tasks')}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Tasks
                </Button>
                <h1 className="text-xl font-semibold text-gray-900">Task Details</h1>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="space-y-6">
              {/* Title */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{task.title}</h2>
                <p className="text-sm text-gray-500 mt-1">ID: {task.id}</p>
              </div>

              {/* Description */}
              {task.description && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{task.description}</p>
                </div>
              )}

              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Status:</span>
                  <p className="text-gray-900">{task.status}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Priority:</span>
                  <p className="text-gray-900">{task.priority}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Progress:</span>
                  <p className="text-gray-900">{task.progress}%</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Due Date:</span>
                  <p className="text-gray-900">
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Not set'}
                  </p>
                </div>
              </div>

              {/* Assignee */}
              {task.assignee && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Assigned to:</span>
                  <p className="text-gray-900">{task.assignee.name}</p>
                </div>
              )}

              {/* Multiple Assignees */}
              {task.assignees && task.assignees.length > 0 && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Assignees:</span>
                  <div className="mt-1">
                    {task.assignees.map((assignee, index) => (
                      <span key={assignee.id} className="text-gray-900">
                        {assignee.name}{index < task.assignees!.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Debug Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Debug Information</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Task ID: {task.id}</p>
                  <p>Created: {task.createdAt ? new Date(task.createdAt).toLocaleString() : 'Unknown'}</p>
                  <p>Updated: {task.updatedAt ? new Date(task.updatedAt).toLocaleString() : 'Unknown'}</p>
                  <p>Project ID: {task.projectId || 'None'}</p>
                  <p>Tags: {task.tags?.join(', ') || 'None'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SimpleTaskDetails;
