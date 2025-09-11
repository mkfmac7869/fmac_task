
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface AddProjectCardProps {
  onClick: () => void;
}

const AddProjectCard = ({ onClick }: AddProjectCardProps) => {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center h-64">
        <PlusCircle className="h-10 w-10 text-gray-400 mb-2" />
        <p className="text-gray-500">Create a new project</p>
        <Button 
          variant="outline" 
          className="mt-4 border-fmac-red text-fmac-red hover:bg-fmac-red/10"
          onClick={onClick}
        >
          Add Project
        </Button>
      </CardContent>
    </Card>
  );
};

export default AddProjectCard;
