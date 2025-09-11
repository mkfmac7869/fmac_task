
import React from 'react';
import { CheckSquare } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

const RelatedTasks = () => {
  return (
    <div className="space-y-3">
      <div className="flex items-start p-2 border rounded-md">
        <CheckSquare className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">Design Database Schema</p>
          <p className="text-xs text-gray-500">Due tomorrow</p>
        </div>
      </div>
      <div className="flex items-start p-2 border rounded-md">
        <CheckSquare className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">Implement API Endpoints</p>
          <p className="text-xs text-gray-500">Due in 3 days</p>
        </div>
      </div>
      
      <Button variant="ghost" className="w-full text-fmac-red hover:text-fmac-red/90 hover:bg-red-50">
        View All Related Tasks
      </Button>
    </div>
  );
};

export default RelatedTasks;
