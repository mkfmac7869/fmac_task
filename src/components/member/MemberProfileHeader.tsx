
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, Plus, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { TeamMember } from '@/components/team/TeamMemberCard';

interface MemberProfileHeaderProps {
  member: TeamMember;
  canAssignTasks: boolean;
  onBack: () => void;
  onAssignTask: () => void;
}

const MemberProfileHeader = ({ 
  member, 
  canAssignTasks, 
  onBack, 
  onAssignTask 
}: MemberProfileHeaderProps) => {
  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Member Profile</h1>
      </div>
      
      {/* Profile Card */}
      <Card className="mb-6">
        <CardContent className="p-5">
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={member.avatar} alt={member.name} />
              <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold">{member.name}</h2>
                  <p className="text-gray-500">{member.role}</p>
                  
                  <div className="flex items-center gap-4 mt-2">
                    <Badge className="bg-gray-100 text-gray-700">{member.department}</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6 mt-4">
                    <div className="flex items-center text-gray-600">
                      <Mail className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{member.email}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <Phone className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{member.phone}</span>
                    </div>
                  </div>
                </div>
                
                {canAssignTasks && (
                  <Button 
                    onClick={onAssignTask}
                    className="bg-fmac-red hover:bg-fmac-red/90"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Assign New Task
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default MemberProfileHeader;
