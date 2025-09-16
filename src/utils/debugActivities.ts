import { FirebaseService, TaskService } from '@/lib/firebaseService';

export const debugActivities = async (taskId: string) => {
  console.log('=== DEBUGGING ACTIVITIES ===');
  console.log('Task ID:', taskId);
  
  try {
    // Method 1: Using getDocumentsOrdered
    console.log('\n1. Trying getDocumentsOrdered...');
    const orderedActivities = await FirebaseService.getDocumentsOrdered(
      'activities',
      'timestamp',
      'desc',
      [{ field: 'taskId', operator: '==', value: taskId }]
    );
    console.log('Ordered activities result:', orderedActivities);
    
    // Method 2: Using getDocuments
    console.log('\n2. Trying getDocuments...');
    const activities = await FirebaseService.getDocuments('activities', [
      { field: 'taskId', operator: '==', value: taskId }
    ]);
    console.log('Regular activities result:', activities);
    
    // Method 3: Get all activities to see what's there
    console.log('\n3. Getting ALL activities (no filter)...');
    const allActivities = await FirebaseService.getDocuments('activities', []);
    console.log('All activities in database:', allActivities);
    console.log('Activities for this task:', allActivities.filter((a: any) => a.taskId === taskId));
    
    // Method 4: Check the task itself
    console.log('\n4. Checking task data...');
    const task = await FirebaseService.getDocument('tasks', taskId);
    console.log('Task data:', task);
    
    // If no activities exist, create one
    if (!activities || activities.length === 0) {
      console.log('\n5. No activities found, creating test activity...');
      const testActivity = await TaskService.addActivity(
        taskId,
        task?.created_by || 'system',
        'created this task (debug)',
        {
          type: 'status_change',
          userName: 'System',
          userAvatar: '/placeholder.svg'
        }
      );
      console.log('Created test activity:', testActivity);
      
      // Try to fetch it again
      const newActivities = await FirebaseService.getDocuments('activities', [
        { field: 'taskId', operator: '==', value: taskId }
      ]);
      console.log('Activities after creating test:', newActivities);
    }
    
  } catch (error) {
    console.error('Error debugging activities:', error);
  }
  
  console.log('=== END DEBUG ===');
};

// Function to manually create initial activities for all tasks
export const createMissingActivities = async () => {
  try {
    console.log('Creating missing activities for all tasks...');
    
    // Get all tasks
    const tasks = await FirebaseService.getDocuments('tasks', []);
    console.log(`Found ${tasks.length} tasks`);
    
    for (const task of tasks) {
      // Check if task has activities
      const activities = await FirebaseService.getDocuments('activities', [
        { field: 'taskId', operator: '==', value: task.id }
      ]);
      
      if (!activities || activities.length === 0) {
        console.log(`Creating initial activity for task ${task.id} - ${task.title}`);
        
        // Get creator info
        let creatorName = 'Unknown User';
        let creatorAvatar = '/placeholder.svg';
        
        if (task.created_by) {
          const creator = await FirebaseService.getDocument('profiles', task.created_by);
          if (creator) {
            creatorName = creator.name || 'Unknown User';
            creatorAvatar = creator.avatar || `/placeholder.svg`;
          }
        }
        
        await TaskService.addActivity(
          task.id,
          task.created_by || 'system',
          'created this task',
          {
            type: 'status_change',
            userName: creatorName,
            userAvatar: creatorAvatar,
            timestamp: task.createdAt || new Date()
          }
        );
      }
    }
    
    console.log('Finished creating missing activities');
  } catch (error) {
    console.error('Error creating missing activities:', error);
  }
};
