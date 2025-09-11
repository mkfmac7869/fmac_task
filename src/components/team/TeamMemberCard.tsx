
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone } from 'lucide-react';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  avatar: string;
  department: string;
  tasksCompleted: number;
  tasksInProgress: number;
}

interface TeamMemberCardProps {
  member: TeamMember;
  canInvite?: boolean;
}

const TeamMemberCard = ({ member, canInvite = true }: TeamMemberCardProps) => {
  const navigate = useNavigate();
  
  const handleViewProfile = () => {
    navigate(`/member-profile/${member.id}`);
  };
  
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <Avatar className="h-14 w-14">
            <AvatarImage src={member.avatar} alt={member.name} />
            <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{member.name}</h3>
                <p className="text-sm text-gray-500">{member.role}</p>
              </div>
              <Badge variant="outline" className="bg-gray-100">
                {member.department}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-3">
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="h-4 w-4 mr-2 text-gray-400" />
                <span className="truncate">{member.email}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="h-4 w-4 mr-2 text-gray-400" />
                <span>{member.phone}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm">
                <span className="font-medium text-green-600">{member.tasksCompleted}</span> completed,{' '}
                <span className="font-medium text-amber-600">{member.tasksInProgress}</span> in progress
              </div>
              <div className="flex gap-2">
                {canInvite && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-white border-fmac-red text-fmac-red hover:bg-fmac-red hover:text-white"
                    onClick={handleViewProfile}
                  >
                    View Profile
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamMemberCard;
