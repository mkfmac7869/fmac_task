
import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

interface ProjectDescriptionProps {
  description: string;
  colorClass: string;
}

const ProjectDescription: React.FC<ProjectDescriptionProps> = ({ description, colorClass }) => {
  return (
    <Card className="col-span-2">
      <div className={`h-2 ${colorClass} rounded-t-lg`}></div>
      <CardHeader>
        <h2 className="text-xl font-semibold">Description</h2>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700">{description}</p>
      </CardContent>
    </Card>
  );
};

export default ProjectDescription;
