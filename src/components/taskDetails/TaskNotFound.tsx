
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
          <h1 className="text-2xl font-bold">Task Not Found</h1>
        </div>
        <p className="text-gray-600">The requested task could not be found.</p>
        <Button className="mt-4" onClick={() => navigate('/tasks')}>
          Back to Tasks
        </Button>
      </div>
    </Layout>
  );
};

export default TaskNotFound;
