// Database initialization utility
import { FirebaseService } from '@/lib/firebaseService';

export const initializeDatabase = async () => {
  try {
    console.log('🚀 Initializing Firestore database...');

    // Test Firebase connection first
    console.log('Testing Firebase connection...');
    const testDoc = await FirebaseService.addDocument('test', { test: true });
    console.log('✅ Firebase connection successful');

    // 1. Create admin user profile for mkfmac7@gmail.com
    const adminProfile = {
      name: 'Mohamed Khaled',
      email: 'mkfmac7@gmail.com',
      avatar: 'https://ui-avatars.com/api/?name=MK&background=ea384c&color=fff',
      role: 'admin',
      department: 'Management',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log('Creating admin profile...');
    // Force create/update admin profile
    await FirebaseService.upsertDocument('profiles', '4C041gjoVQhUbZQ9QZtW1vt9Bu92', adminProfile);
    console.log('✅ Admin profile created/updated');

    // 2. Create sample departments
    const departments = [
      {
        id: 'dept-1',
        name: 'Management',
        description: 'Management and Administration',
        head_id: '4C041gjoVQhUbZQ9QZtW1vt9Bu92',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'dept-2',
        name: 'IT',
        description: 'Information Technology',
        head_id: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'dept-3',
        name: 'Marketing',
        description: 'Marketing and Communications',
        head_id: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    for (const dept of departments) {
      await FirebaseService.upsertDocument('departments', dept.id, dept);
    }
    console.log('✅ Departments created');

    // 3. Create sample projects
    const projects = [
      {
        id: 'proj-1',
        name: 'Website Redesign',
        description: 'Complete redesign of the company website',
        status: 'active',
        priority: 'high',
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        created_by: '4C041gjoVQhUbZQ9QZtW1vt9Bu92',
        department: 'Management',
        members: ['4C041gjoVQhUbZQ9QZtW1vt9Bu92'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'proj-2',
        name: 'Mobile App Development',
        description: 'Development of mobile application for task management',
        status: 'planning',
        priority: 'medium',
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
        created_by: '4C041gjoVQhUbZQ9QZtW1vt9Bu92',
        department: 'Management',
        members: ['4C041gjoVQhUbZQ9QZtW1vt9Bu92'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'proj-3',
        name: 'Marketing Campaign',
        description: 'Q4 marketing campaign for new product launch',
        status: 'active',
        priority: 'high',
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
        created_by: '4C041gjoVQhUbZQ9QZtW1vt9Bu92',
        department: 'Management',
        members: ['4C041gjoVQhUbZQ9QZtW1vt9Bu92'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    for (const project of projects) {
      await FirebaseService.upsertDocument('projects', project.id, project);
    }
    console.log('✅ Projects created');

    // 4. Create sample tasks
    const tasks = [
      {
        id: 'task-1',
        title: 'Design Homepage Layout',
        description: 'Create wireframes and mockups for the new homepage',
        status: 'in_progress',
        priority: 'high',
        assigned_to: '4C041gjoVQhUbZQ9QZtW1vt9Bu92',
        created_by: '4C041gjoVQhUbZQ9QZtW1vt9Bu92',
        project_id: 'proj-1',
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'task-2',
        title: 'Setup Development Environment',
        description: 'Configure development tools and environment',
        status: 'todo',
        priority: 'medium',
        assigned_to: '4C041gjoVQhUbZQ9QZtW1vt9Bu92',
        created_by: '4C041gjoVQhUbZQ9QZtW1vt9Bu92',
        project_id: 'proj-2',
        due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'task-3',
        title: 'Create Marketing Materials',
        description: 'Design brochures and flyers for the campaign',
        status: 'completed',
        priority: 'high',
        assigned_to: '4C041gjoVQhUbZQ9QZtW1vt9Bu92',
        created_by: '4C041gjoVQhUbZQ9QZtW1vt9Bu92',
        project_id: 'proj-3',
        due_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'task-4',
        title: 'Implement User Authentication',
        description: 'Add login and registration functionality',
        status: 'in_progress',
        priority: 'high',
        assigned_to: '4C041gjoVQhUbZQ9QZtW1vt9Bu92',
        created_by: '4C041gjoVQhUbZQ9QZtW1vt9Bu92',
        project_id: 'proj-1',
        due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'task-5',
        title: 'Plan Social Media Strategy',
        description: 'Develop content calendar and posting schedule',
        status: 'todo',
        priority: 'medium',
        assigned_to: '4C041gjoVQhUbZQ9QZtW1vt9Bu92',
        created_by: '4C041gjoVQhUbZQ9QZtW1vt9Bu92',
        project_id: 'proj-3',
        due_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    for (const task of tasks) {
      await FirebaseService.upsertDocument('tasks', task.id, task);
    }
    console.log('✅ Tasks created');

    // 5. Create sample comments
    const comments = [
      {
        id: 'comment-1',
        task_id: 'task-1',
        user_id: '4C041gjoVQhUbZQ9QZtW1vt9Bu92',
        content: 'Starting work on the homepage design',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    for (const comment of comments) {
      await FirebaseService.upsertDocument('task_comments', comment.id, comment);
    }
    console.log('✅ Comments created');

    console.log('🎉 Database initialization complete!');
    return true;

  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    return false;
  }
};

// Make it available globally for testing
(window as any).initializeDatabase = initializeDatabase;

// Auto-run when this module is imported (for development)
// DISABLED: Only run manually via AdminUtils to avoid creating dummy data
if (typeof window !== 'undefined') {
  // Only run in browser environment
  // initializeDatabase(); // Commented out to prevent auto-creation of dummy data

  // Make it available globally for manual execution
  (window as any).initializeDatabase = initializeDatabase;
  (window as any).forceCreateAdminProfile = async () => {
    const adminProfile = {
      name: 'Mohamed Khaled',
      email: 'mkfmac7@gmail.com',
      avatar: 'https://ui-avatars.com/api/?name=MK&background=ea384c&color=fff',
      role: 'admin',
      department: 'Management',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    return await FirebaseService.upsertDocument('profiles', '4C041gjoVQhUbZQ9QZtW1vt9Bu92', adminProfile);
  };
}
