// Database cleanup utility
import { FirebaseService } from '@/lib/firebaseService';
import { collection, getDocs, deleteDoc, doc, writeBatch } from 'firebase/firestore';
import { db } from '@/lib/firebaseClient';

export const cleanupDatabase = async () => {
  try {
    console.log('🧹 Starting database cleanup...');
    
    // Use direct Firebase operations to bypass any service layer issues
    const batch = writeBatch(db);
    
    // 1. Delete all tasks
    console.log('Deleting all tasks...');
    const tasksSnapshot = await getDocs(collection(db, 'tasks'));
    console.log(`Found ${tasksSnapshot.size} tasks to delete`);
    
    tasksSnapshot.forEach((taskDoc) => {
      batch.delete(taskDoc.ref);
    });
    
    // 2. Delete all projects
    console.log('Deleting all projects...');
    const projectsSnapshot = await getDocs(collection(db, 'projects'));
    console.log(`Found ${projectsSnapshot.size} projects to delete`);
    
    projectsSnapshot.forEach((projectDoc) => {
      batch.delete(projectDoc.ref);
    });
    
    // 3. Delete all departments
    console.log('Deleting all departments...');
    const departmentsSnapshot = await getDocs(collection(db, 'departments'));
    console.log(`Found ${departmentsSnapshot.size} departments to delete`);
    
    departmentsSnapshot.forEach((deptDoc) => {
      batch.delete(deptDoc.ref);
    });
    
    // 4. Delete all comments
    console.log('Deleting all comments...');
    const commentsSnapshot = await getDocs(collection(db, 'task_comments'));
    console.log(`Found ${commentsSnapshot.size} comments to delete`);
    
    commentsSnapshot.forEach((commentDoc) => {
      batch.delete(commentDoc.ref);
    });
    
    // 5. Delete all task activities
    console.log('Deleting all task activities...');
    const activitiesSnapshot = await getDocs(collection(db, 'task_activities'));
    console.log(`Found ${activitiesSnapshot.size} activities to delete`);
    
    activitiesSnapshot.forEach((activityDoc) => {
      batch.delete(activityDoc.ref);
    });
    
    // Commit the batch
    console.log('Committing batch deletion...');
    await batch.commit();
    console.log('✅ Batch deletion committed');
    
    // Wait a moment for Firebase to process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 6. Create a basic Management department for the admin
    console.log('Creating basic Management department...');
    const managementDept = {
      id: 'dept-management',
      name: 'Management',
      description: 'Management department',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    await FirebaseService.upsertDocument('departments', managementDept.id, managementDept);
    console.log('✅ Management department created');
    
    // Final verification
    console.log('🔍 Final verification...');
    const finalTasks = await FirebaseService.getDocuments('tasks');
    const finalProjects = await FirebaseService.getDocuments('projects');
    const finalDepartments = await FirebaseService.getDocuments('departments');
    const finalComments = await FirebaseService.getDocuments('task_comments');
    const finalActivities = await FirebaseService.getDocuments('task_activities');
    
    console.log('🎉 Database cleanup completed!');
    console.log('📊 Final state:');
    console.log(`- Admin profile: Preserved`);
    console.log(`- Departments: ${finalDepartments.length} (should be 1 - Management)`);
    console.log(`- Projects: ${finalProjects.length} (should be 0)`);
    console.log(`- Tasks: ${finalTasks.length} (should be 0)`);
    console.log(`- Comments: ${finalComments.length} (should be 0)`);
    console.log(`- Activities: ${finalActivities.length} (should be 0)`);
    
    return true;
    
  } catch (error) {
    console.error('❌ Database cleanup failed:', error);
    return false;
  }
};

// Make it available globally for testing
(window as any).cleanupDatabase = cleanupDatabase;