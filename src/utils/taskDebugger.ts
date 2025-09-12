// Utility function to debug task-related issues
export const debugTaskIssue = (taskId: string, tasks: any[], user: any) => {
  console.log('=== TASK DEBUG INFO ===');
  console.log('Requested Task ID:', taskId);
  console.log('User ID:', user?.id);
  console.log('User Role:', user?.roles?.[0]);
  console.log('Total Tasks Available:', tasks.length);
  console.log('Available Task IDs:', tasks.map(t => t.id));
  
  const foundTask = tasks.find(t => t.id === taskId);
  console.log('Task Found:', !!foundTask);
  
  if (foundTask) {
    console.log('Task Details:', {
      id: foundTask.id,
      title: foundTask.title,
      assigned_to: foundTask.assignee?.id,
      created_by: foundTask.creator?.id,
      status: foundTask.status
    });
    
    // Check permissions
    const canView = user?.roles?.includes('admin') || 
                   foundTask.assignee?.id === user?.id || 
                   foundTask.creator?.id === user?.id;
    console.log('User can view this task:', canView);
  } else {
    console.log('Task not found in available tasks');
  }
  console.log('=== END DEBUG INFO ===');
};
