
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useTask } from '@/context/TaskContext';
import ProjectNotFound from '@/components/projects/ProjectNotFound';
import ProjectHeader from '@/components/projects/ProjectHeader';
import ProjectDescription from '@/components/projects/ProjectDescription';
import ProjectStats from '@/components/projects/ProjectStats';
import ProjectTaskList from '@/components/projects/ProjectTaskList';
import { Project } from '@/types/task';

const ProjectDetails = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { projects, getTasksByProject, isLoading } = useTask();
  const [project, setProject] = useState<Project | null>(null);
  
  console.log('ProjectDetails - projectId:', projectId);
  console.log('ProjectDetails - projects:', projects);
  console.log('ProjectDetails - projects length:', projects?.length);
  console.log('ProjectDetails - isLoading:', isLoading);
  
  useEffect(() => {
    if (projectId && projects && projects.length > 0) {
      console.log('Looking for project with ID:', projectId);
      console.log('Available project IDs:', projects.map(p => p.id));
      const foundProject = projects.find(p => p.id === projectId);
      console.log('Found project:', foundProject);
      setProject(foundProject || null);
    }
  }, [projectId, projects]);
  
  // Show loading state while projects are being fetched
  if (isLoading) {
    return (
      <Layout>
        <div className="p-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg">Loading project details...</div>
          </div>
        </div>
      </Layout>
    );
  }
  
  // If project is not found, show error notification and render not found component
  if (!project) {
    console.log('Project not found, showing ProjectNotFound component');
    console.log('Available projects:', projects);
    console.log('Looking for project ID:', projectId);
    
    // Temporary debug component
    return (
      <Layout>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Debug: Project Not Found</h1>
          <div className="bg-gray-100 p-4 rounded-lg mb-4">
            <p><strong>Looking for project ID:</strong> {projectId}</p>
            <p><strong>Available project IDs:</strong> {projects?.map(p => p.id).join(', ')}</p>
            <p><strong>Projects loaded:</strong> {projects?.length || 0}</p>
            <p><strong>Is loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
          </div>
          <button 
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Go Back
          </button>
        </div>
      </Layout>
    );
  }

  const tasks = getTasksByProject(projectId as string);
  
  // Get color based on project.color
  const getBgColor = () => {
    switch (project.color) {
      case 'purple': return 'bg-purple-500';
      case 'blue': return 'bg-blue-500';
      case 'green': return 'bg-green-500';
      case 'orange': return 'bg-orange-400';
      case 'pink': return 'bg-pink-500';
      case 'teal': return 'bg-teal-500';
      case 'red': return 'bg-fmac-red';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Layout>
      <div className="p-6">
        {/* Header */}
        <ProjectHeader project={project} />
        
        {/* Project Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Project Description */}
          <ProjectDescription 
            description={project.description} 
            colorClass={getBgColor()}
          />
          
          {/* Project Stats */}
          <ProjectStats 
            project={project} 
            tasks={tasks}
            colorClass={getBgColor()}
          />
        </div>
        
        {/* Tasks */}
        <h2 className="text-xl font-semibold mb-4">Tasks</h2>
        <ProjectTaskList tasks={tasks} />
      </div>
    </Layout>
  );
};

export default ProjectDetails;
