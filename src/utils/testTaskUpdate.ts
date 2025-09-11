import { FirebaseService } from '@/lib/firebaseService';

export const testTaskUpdate = async () => {
  try {
    console.log('🧪 Testing task update functionality...');
    
    // First, let's get all tasks to see what IDs we have
    const tasks = await FirebaseService.getDocuments('tasks');
    console.log('Available tasks in database:', tasks.map(t => ({ id: t.id, title: t.title })));
    
    if (tasks.length === 0) {
      console.log('❌ No tasks found to test with');
      return;
    }
    
    // Test updating the first task
    const firstTask = tasks[0];
    console.log('Testing update on task:', firstTask.id);
    console.log('Full task ID length:', firstTask.id.length);
    console.log('Full task ID characters:', firstTask.id.split('').map((char, index) => `${index}:${char}`));
    
    // First, let's try to get the specific task to see if it exists
    console.log('Checking if task exists before update...');
    const existingTask = await FirebaseService.getDocument('tasks', firstTask.id);
    console.log('Existing task from database:', existingTask);
    
    if (!existingTask) {
      console.log('❌ Task does not exist in database, cannot update');
      return;
    }
    
    const updateData = {
      title: firstTask.title + ' (Updated)',
      updated_at: new Date().toISOString()
    };
    
    console.log('Update data:', updateData);
    console.log('About to call FirebaseService.updateDocument with ID:', firstTask.id);
    
    const result = await FirebaseService.updateDocument('tasks', firstTask.id, updateData);
    console.log('✅ Task update successful:', result);
    
    // Verify the update
    const updatedTask = await FirebaseService.getDocument('tasks', firstTask.id);
    console.log('✅ Verified update:', updatedTask);
    
  } catch (error) {
    console.error('❌ Task update test failed:', error);
    console.error('Error details:', error);
  }
};

// Test specific task that's causing issues
export const testSpecificTaskUpdate = async (taskId: string) => {
  try {
    console.log('🧪 Testing specific task update for ID:', taskId);
    console.log('Task ID length:', taskId.length);
    console.log('Task ID characters:', taskId.split('').map((char, index) => `${index}:${char}`));
    
    const updateData = {
      title: 'Test Update - ' + new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    console.log('Update data:', updateData);
    console.log('About to call FirebaseService.updateDocument with ID:', taskId);
    
    const result = await FirebaseService.updateDocument('tasks', taskId, updateData);
    console.log('✅ Specific task update successful:', result);
    
    // Verify the update
    const updatedTask = await FirebaseService.getDocument('tasks', taskId);
    console.log('✅ Verified specific update:', updatedTask);
    
  } catch (error) {
    console.error('❌ Specific task update test failed:', error);
    console.error('Error details:', error);
  }
};

// Check database vs local state mismatch
export const checkTaskMismatch = async () => {
  try {
    console.log('🔍 Checking for task mismatch between database and local state...');
    
    // Get tasks from database
    const dbTasks = await FirebaseService.getDocuments('tasks');
    console.log('Tasks in database:', dbTasks.map(t => ({ id: t.id, title: t.title })));
    
    // Get tasks from local state (this would need to be passed in, but for now let's just log)
    console.log('To check local state, look at the tasks array in the React DevTools or console');
    
    // Check if task-4 specifically exists
    const task4 = await FirebaseService.getDocument('tasks', 'task-4');
    console.log('Task-4 in database:', task4);
    
    if (!task4) {
      console.log('❌ Task-4 does not exist in database!');
      console.log('This explains why updates fail - the document was never created or was deleted');
    } else {
      console.log('✅ Task-4 exists in database');
    }
    
  } catch (error) {
    console.error('❌ Task mismatch check failed:', error);
  }
};

// Recreate tasks in database
export const recreateTasks = async () => {
  try {
    console.log('🔄 Recreating tasks in database...');
    
    // First, let's delete all existing tasks
    console.log('Deleting existing tasks...');
    const existingTasks = await FirebaseService.getDocuments('tasks');
    console.log(`Found ${existingTasks.length} existing tasks to delete`);
    
    for (const task of existingTasks) {
      await FirebaseService.deleteDocument('tasks', task.id);
    }
    console.log('✅ Deleted existing tasks');
    
    // Wait a moment for deletion to complete
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Now recreate the tasks
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
      console.log('Created task:', task.id);
    }
    
    console.log('✅ Tasks recreated successfully');
    
    // Verify all tasks were created correctly
    console.log('🔍 Verifying task creation...');
    const allTasks = await FirebaseService.getDocuments('tasks');
    console.log(`Created ${allTasks.length} tasks in database`);
    
    // Check specific tasks
    const taskIds = ['task-1', 'task-2', 'task-3', 'task-4', 'task-5'];
    for (const taskId of taskIds) {
      const task = await FirebaseService.getDocument('tasks', taskId);
      if (task) {
        console.log(`✅ ${taskId}: ${task.title}`);
      } else {
        console.log(`❌ ${taskId}: NOT FOUND`);
      }
    }
    
    console.log('✅ Task recreation completed successfully');
    
  } catch (error) {
    console.error('❌ Task recreation failed:', error);
  }
};

// Make it available globally for testing
(window as any).testTaskUpdate = testTaskUpdate;
(window as any).testSpecificTaskUpdate = testSpecificTaskUpdate;
(window as any).checkTaskMismatch = checkTaskMismatch;
(window as any).recreateTasks = recreateTasks;
