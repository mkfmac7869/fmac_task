// Check current database state
import { FirebaseService } from '@/lib/firebaseService';

export const checkDatabaseState = async () => {
  try {
    console.log('🔍 Checking current database state...');
    
    // Check departments
    const departments = await FirebaseService.getDocuments('departments');
    console.log('📁 Departments:', departments.length);
    departments.forEach(dept => {
      console.log(`  - ${dept.id}: ${dept.name}`);
    });
    
    // Check profiles
    const profiles = await FirebaseService.getDocuments('profiles');
    console.log('👥 Profiles:', profiles.length);
    profiles.forEach(profile => {
      console.log(`  - ${profile.id}: ${profile.name} (${profile.role})`);
    });
    
    // Check tasks
    const tasks = await FirebaseService.getDocuments('tasks');
    console.log('📋 Tasks:', tasks.length);
    
    // Check projects
    const projects = await FirebaseService.getDocuments('projects');
    console.log('📂 Projects:', projects.length);
    
    return {
      departments: departments.length,
      profiles: profiles.length,
      tasks: tasks.length,
      projects: projects.length
    };
    
  } catch (error) {
    console.error('❌ Error checking database state:', error);
    return null;
  }
};

// Make it available globally
(window as any).checkDatabaseState = checkDatabaseState;
