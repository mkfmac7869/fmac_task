import { FirebaseService } from '@/lib/firebaseService';

export const testActivitiesQuery = async () => {
  console.log('=== TESTING ACTIVITIES QUERIES ===');
  
  try {
    // Get ALL activities first
    console.log('\n1. Getting ALL activities (no filter)...');
    const allActivities = await FirebaseService.getDocuments('activities', []);
    console.log('Total activities in database:', allActivities.length);
    
    if (allActivities.length > 0) {
      console.log('First 3 activities full structure:');
      allActivities.slice(0, 3).forEach((activity, index) => {
        console.log(`Activity ${index + 1}:`, JSON.stringify(activity, null, 2));
      });
      
      console.log('\nAll unique taskIds in activities:', [...new Set(allActivities.map(a => a.taskId))]);
      
      // Group by taskId
      const activitiesByTask = allActivities.reduce((acc: any, activity: any) => {
        const taskId = activity.taskId;
        if (!acc[taskId]) acc[taskId] = [];
        acc[taskId].push(activity);
        return acc;
      }, {});
      
      console.log('\nActivities grouped by taskId:');
      Object.entries(activitiesByTask).forEach(([taskId, activities]: [string, any]) => {
        console.log(`Task "${taskId}": ${activities.length} activities`);
      });
    }
    
    // Test specific task query
    const testTaskId = 'XVwGpGNXeWqtwNGFQaRS'; // The task ID from the screenshot
    console.log(`\n2. Testing query for specific task: ${testTaskId}`);
    
    const specificActivities = await FirebaseService.getDocuments('activities', [
      { field: 'taskId', operator: '==', value: testTaskId }
    ]);
    console.log('Activities for this task:', specificActivities.length);
    
    if (specificActivities.length > 0) {
      console.log('Activities found:', specificActivities);
    }
    
    // Test with getDocumentsOrdered
    console.log('\n3. Testing getDocumentsOrdered...');
    const orderedActivities = await FirebaseService.getDocumentsOrdered(
      'activities',
      'timestamp',
      'desc',
      [{ field: 'taskId', operator: '==', value: testTaskId }]
    );
    console.log('Ordered activities result:', orderedActivities?.length || 0);
    
  } catch (error) {
    console.error('Error testing activities:', error);
  }
  
  console.log('=== END TEST ===');
};
