
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Layout from '@/components/Layout';

const ProjectNotFound: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Project not found</h1>
        <p className="text-gray-600 mb-6">
          The project you're looking for doesn't exist or has been deleted.
        </p>
        <Button onClick={() => navigate('/projects')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Button>
      </div>
    </Layout>
  );
};

export default ProjectNotFound;
