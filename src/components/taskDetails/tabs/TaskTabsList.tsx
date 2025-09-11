
import React from 'react';
import { TabsList } from '@/components/ui/tabs';
import { Clock, MessageSquare } from 'lucide-react';
import TabTriggerWithIcon from './TabTriggerWithIcon';

const TaskTabsList: React.FC = () => {
  return (
    <TabsList className="grid grid-cols-2 mb-4">
      <TabTriggerWithIcon
        value="comments"
        icon={<MessageSquare className="h-4 w-4" />}
        label="Comments"
      />
      <TabTriggerWithIcon
        value="activity"
        icon={<Clock className="h-4 w-4" />}
        label="Activity Log"
      />
    </TabsList>
  );
};

export default TaskTabsList;
