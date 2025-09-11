
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import TaskActivity from '../TaskActivity';

interface ActivityTabProps {
  taskId: string;
}

const ActivityTab: React.FC<ActivityTabProps> = ({ taskId }) => {
  return (
    <TabsContent value="activity">
      <TaskActivity taskId={taskId} />
    </TabsContent>
  );
};

export default ActivityTab;
