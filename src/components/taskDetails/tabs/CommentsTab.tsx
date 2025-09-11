
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import TaskComments from '../TaskComments';

interface CommentsTabProps {
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

const CommentsTab: React.FC<CommentsTabProps> = ({ comments, currentUser, taskId }) => {
  return (
    <TabsContent value="comments">
      <TaskComments comments={comments} currentUser={currentUser} taskId={taskId} />
    </TabsContent>
  );
};

export default CommentsTab;
