
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';

const TaskNotFound: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Layout>
      <div className="p-6">
        <div className="flex items-center mb-6">
          <h1 className="text-2xl font-bold text-red-600">Task Not Found</h1>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <h3 className="font-semibold text-yellow-800 mb-2">Possible reasons:</h3>
          <ul className="list-disc list-inside text-yellow-700 space-y-1">
            <li>The task may have been deleted</li>
            <li>The task ID in the URL might be incorrect</li>
            <li>You might not have permission to view this task</li>
            <li>The task might not exist in the database</li>
          </ul>
        </div>
        <p className="text-gray-600 mb-4">The requested task could not be found in your accessible tasks.</p>
        <div className="flex gap-3">
          <Button onClick={() => navigate('/tasks')}>
            Back to Tasks
          </Button>
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default TaskNotFound;
