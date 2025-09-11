
import Layout from '@/components/Layout';
import { useTask } from '@/context/TaskContext';
import ProjectCard from '@/components/projects/ProjectCard';
import AddProjectCard from '@/components/projects/AddProjectCard';
import NewProjectDialog from '@/components/projects/NewProjectDialog';

const Projects = () => {
  const { projects, isLoading } = useTask();
  
  console.log('Projects page - projects:', projects);
  console.log('Projects page - isLoading:', isLoading);
  
  // Debug: Check the structure of the first project
  if (projects && projects.length > 0) {
    console.log('First project structure:', projects[0]);
    console.log('First project members:', projects[0].members);
  }
  
  const handleCreateProject = () => {
    document.querySelector<HTMLButtonElement>('[data-dialog-trigger="new-project"]')?.click();
  };
  
  if (isLoading) {
    return (
      <Layout>
        <div className="p-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg">Loading projects...</div>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Projects</h1>
          <NewProjectDialog />
        </div>
        
        {/* Debug Info */}
        <div className="mb-4 p-4 bg-gray-100 rounded-lg">
          <div className="text-sm text-gray-600">
            Debug: {projects ? projects.length : 0} projects loaded
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects && projects.length > 0 ? (
            projects.map((project) => {
              try {
                return <ProjectCard key={project.id} project={project} />;
              } catch (error) {
                console.error('Error rendering project card:', error, project);
                return (
                  <div key={project.id} className="p-4 border border-red-200 rounded-lg bg-red-50">
                    <div className="text-red-600 font-medium">Error rendering project</div>
                    <div className="text-red-500 text-sm">{project.name}</div>
                  </div>
                );
              }
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-500 text-lg mb-4">No projects found</div>
              <div className="text-gray-400">Create your first project to get started</div>
            </div>
          )}
          
          <AddProjectCard onClick={handleCreateProject} />
        </div>
      </div>
    </Layout>
  );
};

export default Projects;
