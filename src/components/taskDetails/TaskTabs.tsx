
import React from 'react';
import { Tabs } from '@/components/ui/tabs';
import TaskTabsList from './tabs/TaskTabsList';
import CommentsTab from './tabs/CommentsTab';
import ActivityTab from './tabs/ActivityTab';

interface TaskTabsProps {
  comments: Array<{
    id: string;
    user: {
      id: string;
      name: string;
      avatar: string;
    };
    content: string;
    timestamp: string;
  }>;
  currentUser: any;
  taskId: string;
}

const TaskTabs: React.FC<TaskTabsProps> = ({ comments, currentUser, taskId }) => {
  return (
    <Tabs defaultValue="comments" className="w-full">
      <TaskTabsList />
      
      <CommentsTab 
        comments={comments} 
        currentUser={currentUser} 
        taskId={taskId} 
      />
      
      <ActivityTab 
        taskId={taskId} 
      />
    </Tabs>
  );
};

export default TaskTabs;
