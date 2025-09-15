
import { useState, useEffect } from 'react';
import { Project } from '@/types/task';
import { ProjectService, FirebaseService } from '@/lib/firebaseService';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { getColorForProject } from './utils';

export const useProjectState = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        const isAdmin = user.roles?.includes('admin') || user.role === 'admin';
        console.log("Fetching projects with user roles:", user.roles, "isAdmin:", isAdmin);
        
        // Fetch projects using Firebase service
        const data = await ProjectService.getProjects(user.id, isAdmin ? 'admin' : 'member', user.department);
        
        if (data && data.length > 0) {
          console.log("Projects data fetched:", data);
          
          // Transform data to match Project type
          const formattedProjects = await Promise.all(data.map(async (project) => {
            // Handle members - could be array of IDs (strings) or member objects
            let members = [];
            if (project.members && project.members.length > 0) {
              // Check if members are already objects or just IDs
              if (typeof project.members[0] === 'object') {
                // Members are already objects, use them directly
                members = project.members;
              } else {
                // Members are IDs, fetch profiles
                try {
                  const memberProfiles = await Promise.all(
                    project.members.map(async (memberId: string) => {
                      const profile = await FirebaseService.getDocument('profiles', memberId);
                      return profile ? {
                        id: profile.id,
                        name: profile.name || 'Unknown User',
                        avatar: profile.avatar || `https://ui-avatars.com/api/?name=U&background=ea384c&color=fff`,
                        email: profile.email
                      } : null;
                    })
                  );
                  members = memberProfiles.filter(member => member !== null);
                } catch (error) {
                  console.error('Error fetching member profiles:', error);
                  members = [];
                }
              }
            }

            return {
              id: project.id,
              name: project.name,
              description: project.description || '',
              color: getColorForProject(project.name),
              departmentId: project.department,
              members: members
            };
          }));
          
          console.log("Formatted projects:", formattedProjects);
          setProjects(formattedProjects);
        } else {
          console.log("No projects found");
          setProjects([]);
        }
      } catch (err) {
        console.error("Unexpected error fetching projects:", err);
        toast({
          title: 'Error fetching projects',
          description: 'Could not load your projects. Please try again later.',
          variant: 'destructive'
        });
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchProjects();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  return { projects, setProjects, isLoading };
};
