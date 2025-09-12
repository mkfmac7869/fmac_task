// Initialize default departments in Firebase
import { FirebaseService } from '@/lib/firebaseService';

export const initializeDefaultDepartments = async () => {
  try {
    console.log('🚀 Initializing default departments...');

    // Check if departments already exist
    const existingDepartments = await FirebaseService.getDocuments('departments');
    
    if (existingDepartments && existingDepartments.length > 0) {
      console.log('✅ Departments already exist, skipping initialization');
      return existingDepartments;
    }

    // Create default departments
    const defaultDepartments = [
      {
        id: 'dept-management',
        name: 'Management',
        description: 'Management and Administration',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'dept-it',
        name: 'IT',
        description: 'Information Technology',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'dept-marketing',
        name: 'Marketing',
        description: 'Marketing and Communications',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'dept-operations',
        name: 'Operations',
        description: 'Operations and Logistics',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'dept-finance',
        name: 'Finance',
        description: 'Finance and Accounting',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'dept-hr',
        name: 'HR',
        description: 'Human Resources',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    // Add each department to Firebase
    for (const dept of defaultDepartments) {
      await FirebaseService.addDocument('departments', dept);
      console.log(`✅ Created department: ${dept.name}`);
    }

    console.log('✅ All default departments created successfully');
    return defaultDepartments;
  } catch (error) {
    console.error('❌ Error initializing departments:', error);
    throw error;
  }
};
