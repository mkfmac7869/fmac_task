
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface MemberFormActionsProps {
  isSubmitting: boolean;
  isEditMode: boolean;
  onCancel: () => void;
}

const MemberFormActions = ({ 
  isSubmitting, 
  isEditMode, 
  onCancel 
}: MemberFormActionsProps) => {
  return (
    <div className="flex justify-end gap-2 pt-4">
      <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
        Cancel
      </Button>
      <Button 
        type="submit" 
        className="bg-fmac-red hover:bg-fmac-red/90" 
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            Processing...
          </>
        ) : (
          <>
            <Check className="mr-2 h-4 w-4" />
            {isEditMode ? "Save Changes" : "Create User"}
          </>
        )}
      </Button>
    </div>
  );
};

export default MemberFormActions;
