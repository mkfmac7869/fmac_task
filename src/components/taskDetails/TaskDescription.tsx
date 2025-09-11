
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface TaskDescriptionProps {
  description: string;
  isEditing: boolean;
  editedTask: {
    description: string;
  };
  progressValue: number;
  setProgressValue: (value: number) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleProgressUpdate: () => void;
}

const TaskDescription = ({
  description,
  isEditing,
  editedTask,
  progressValue,
  setProgressValue,
  handleInputChange,
  handleProgressUpdate
}: TaskDescriptionProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-2">Description</h3>
            {isEditing ? (
              <Textarea
                className="min-h-[100px]"
                name="description"
                value={editedTask.description}
                onChange={handleInputChange}
              />
            ) : (
              <p className="text-gray-700 whitespace-pre-wrap">{description}</p>
            )}
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium">Progress</h3>
              <span className="text-sm font-medium">{progressValue}%</span>
            </div>
            <div className="flex gap-4 items-center">
              <div className="flex-1">
                <Input 
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={progressValue}
                  onChange={(e) => setProgressValue(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              <Button 
                size="sm" 
                className="bg-fmac-red hover:bg-fmac-red/90"
                onClick={handleProgressUpdate}
              >
                Update
              </Button>
            </div>
            <Progress value={progressValue} className="mt-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskDescription;
