
import { Button } from '@/components/ui/button';

interface MemberNotFoundProps {
  onBack: () => void;
}

const MemberNotFound = ({ onBack }: MemberNotFoundProps) => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Member not found</h1>
      <Button onClick={onBack}>Back to Team</Button>
    </div>
  );
};

export default MemberNotFound;
