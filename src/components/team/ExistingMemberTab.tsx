
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { User } from '@/types/auth';
import { db } from '@/lib/firebaseClient';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { toast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

interface ExistingMemberTabProps {
  availableMembers: User[];
  onMemberAdded: (member: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const ExistingMemberTab = ({ availableMembers, onMemberAdded, onCancel, isLoading = false }: ExistingMemberTabProps) => {
  const { user } = useAuth();
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMemberId) {
      toast({
        title: "Error",
        description: "Please select a member to add",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Find the selected member
      const selectedMember = availableMembers.find(m => m.id === selectedMemberId);
      
      if (!selectedMember) {
        throw new Error("Selected member not found");
      }
      
      // Update the member's department in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({ 
          department: user?.department,
          // If member doesn't have a role assigned yet, make them a regular member
          role: selectedMember.role || 'member'
        })
        .eq('id', selectedMemberId);
        
      if (error) {
        throw error;
      }
      
      // Notify parent component
      onMemberAdded({
        id: selectedMemberId,
        name: selectedMember.name,
        email: selectedMember.email,
        phone: '',
        role: 'member',
        department: user?.department || ''
      });
      
      toast({
        title: "Success",
        description: `${selectedMember.name} has been added to your department.`,
      });
      
    } catch (error: any) {
      console.error('Error adding existing member:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add member",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-2">
      {isLoading ? (
        // Loading state
        Array.from({ length: 3 }).map((_, index) => (
          <div key={`skeleton-${index}`} className="flex items-center space-x-3 py-2 px-4 rounded-md border">
            <Skeleton className="h-5 w-5 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-5 w-32 mb-1" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
        ))
      ) : availableMembers.length > 0 ? (
        <RadioGroup value={selectedMemberId} onValueChange={setSelectedMemberId}>
          {availableMembers.map((member) => (
            <div key={member.id} className="flex items-center space-x-3 py-2 px-4 rounded-md hover:bg-gray-100 cursor-pointer border">
              <RadioGroupItem value={member.id} id={`member-${member.id}`} />
              <Label htmlFor={`member-${member.id}`} className="flex items-center space-x-3 cursor-pointer flex-1">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>{member.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-sm text-gray-500">{member.email}</p>
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      ) : (
        <div className="text-center py-4">
          <p className="text-gray-500">No available members found</p>
        </div>
      )}
      
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting || !selectedMemberId}
          className="bg-fmac-red hover:bg-fmac-red/90"
        >
          {isSubmitting ? "Adding..." : "Add Selected Member"}
        </Button>
      </div>
    </form>
  );
};

export default ExistingMemberTab;
