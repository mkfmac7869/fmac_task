import { useState, useEffect } from 'react';
import { Task } from '@/types/task';
import { FirebaseService } from '@/lib/firebaseService';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';

export const useTaskState = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const fetchTasks = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        console.log("Fetching tasks with user roles:", user.roles);
        
        // Build conditions for Firebase query
        let data = [];
        
        // Admin can see all tasks, other roles have restrictions
        console.log("User roles check:", { 
          roles: user.roles, 
          isAdmin: user.roles?.includes('admin'),
          userId: user.id,
          userName: user.name,
          userEmail: user.email,
          fullUser: user
        });
        
        if (!user.roles?.includes('admin')) {
          // Non-admin users can only see tasks assigned to them or created by them
          console.log("Non-admin user - fetching tasks assigned to or created by user");
          
          // Get all tasks first, then filter client-side for assignees array
          const allTasks = await FirebaseService.getDocuments('tasks');
          
          // Filter tasks where user is assigned (either in assignees array or old assigned_to field) or created by user
          const userTasks = allTasks.filter(task => {
            // Check if user created the task
            const isCreator = task.created_by === user.id;
            
            // Check if user is in old assigned_to field
            const isAssignedTo = task.assigned_to === user.id;
            
            // Check if user is in new assignees array
            let isInAssignees = false;
            let assigneesData = null;
            if (task.assignees) {
              try {
                assigneesData = JSON.parse(task.assignees);
                isInAssignees = Array.isArray(assigneesData) && assigneesData.some(assignee => assignee.id === user.id);
              } catch (e) {
                console.error("Error parsing assignees:", e);
              }
            }
            
            // Debug logging for each task
            const shouldInclude = isCreator || isAssignedTo || isInAssignees;
            if (task.title && (task.title.includes('dscds') || task.title.includes('Fujairah') || shouldInclude)) {
              console.log(`Task "${task.title}" check:`, {
                taskId: task.id,
                userId: user.id,
                userName: user.name,
                isCreator,
                isAssignedTo,
                isInAssignees,
                shouldInclude,
                taskCreatedBy: task.created_by,
                taskAssignedTo: task.assigned_to,
                taskAssignees: assigneesData,
                rawAssignees: task.assignees
              });
            }
            
            return shouldInclude;
          });
          
          console.log("Filtered tasks for user:", {
            userId: user.id,
            totalTasks: allTasks.length,
            userTasks: userTasks.length,
            userTaskIds: userTasks.map(t => t.id)
          });
          
          data = userTasks;
        } else {
          console.log("Admin user - fetching all tasks");
          console.log("Admin user - fetching ALL tasks");
          data = await FirebaseService.getDocuments('tasks');
          console.log("Admin tasks fetched, count:", data?.length || 0);
        }
        
        console.log("About to execute query");
        console.log("Query executed, data length:", data ? data.length : 0);

        if (data && data.length > 0) {
          console.log("Tasks data fetched:", data);
          const formattedTasks = await Promise.all(data.map(async (task) => {
            // Get assignee info
            let assignee = null;
            if (task.assigned_to) {
              const profileData = await FirebaseService.getDocument('profiles', task.assigned_to);
                
              if (profileData && (profileData as any).name) {
                assignee = {
                  id: profileData.id,
                  name: (profileData as any).name,
                  avatar: (profileData as any).avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent((profileData as any).name)}&background=42d1f5&color=fff`,
                  email: (profileData as any).email || ''
                };
              }
            }
            
            // Get creator info
            let creator = null;
            if (task.created_by) {
              const creatorData = await FirebaseService.getDocument('profiles', task.created_by);
                
              if (creatorData && (creatorData as any).name) {
                creator = {
                  id: creatorData.id,
                  name: (creatorData as any).name,
                  avatar: (creatorData as any).avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent((creatorData as any).name)}&background=42d1f5&color=fff`,
                  email: (creatorData as any).email || ''
                };
              }
            }
            
            // Parse JSON fields
            const parseJSON = (str: string | undefined) => {
              if (!str) return undefined;
              try {
                return JSON.parse(str);
              } catch {
                return undefined;
              }
            };
            
            return {
              id: task.id,
              title: task.title,
              description: task.description || '',
              status: task.status,
              priority: task.priority,
              dueDate: task.due_date,
              projectId: task.project_id,
              progress: task.progress || 0,
              assignee: assignee,
              assignees: parseJSON(task.assignees) || [],
              creator: creator,
              createdAt: task.created_at,
              tags: task.tags || [],
              comments: parseJSON(task.comments) || [],
              attachments: [], // Attachments are loaded separately from attachments collection
              subtasks: parseJSON(task.subtasks) || [],
              checklists: parseJSON(task.checklists) || [],
              completionEvidence: task.completion_evidence || undefined,
              completionAttachments: parseJSON(task.completion_attachments) || [],
              completedAt: task.completed_at || undefined,
              completedBy: parseJSON(task.completed_by) || undefined
            };
          }));
          
          console.log("Formatted tasks:", formattedTasks);
          setTasks(formattedTasks);
        } else {
          console.log("No tasks found");
          setTasks([]);
        }
      } catch (err) {
        console.error("Unexpected error fetching tasks:", err);
        setTasks([]);
      } finally {
        setIsLoading(false);
      }
    };

  useEffect(() => {
    fetchTasks();
  }, [user]);

  return { tasks, setTasks, isLoading, refreshTasks: fetchTasks };
};
