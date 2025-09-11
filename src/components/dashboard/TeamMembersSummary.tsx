
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const TeamMembersSummary = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Team Members</CardTitle>
        <Button variant="ghost" size="sm" className="text-xs text-fmac-red">
          See all
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex -space-x-3 avatar-group">
          <Avatar className="border-2 border-white">
            <AvatarImage src="https://ui-avatars.com/api/?name=Alex+Johnson&background=ea384c&color=fff" />
            <AvatarFallback>AJ</AvatarFallback>
          </Avatar>
          <Avatar className="border-2 border-white">
            <AvatarImage src="https://ui-avatars.com/api/?name=Jamie+Smith&background=4287f5&color=fff" />
            <AvatarFallback>JS</AvatarFallback>
          </Avatar>
          <Avatar className="border-2 border-white">
            <AvatarImage src="https://ui-avatars.com/api/?name=Jordan+Lee&background=42f54b&color=fff" />
            <AvatarFallback>JL</AvatarFallback>
          </Avatar>
          <Avatar className="border-2 border-white">
            <AvatarImage src="https://ui-avatars.com/api/?name=Taylor+Kim&background=f5a442&color=fff" />
            <AvatarFallback>TK</AvatarFallback>
          </Avatar>
          <Avatar className="border-2 border-white">
            <AvatarImage src="https://ui-avatars.com/api/?name=Morgan+Chen&background=42d1f5&color=fff" />
            <AvatarFallback>MC</AvatarFallback>
          </Avatar>
          <Avatar className="border-2 border-white bg-gray-200">
            <AvatarFallback className="text-gray-600">+3</AvatarFallback>
          </Avatar>
        </div>
        
        <div className="mt-6">
          <div className="flex justify-between mb-1 text-sm">
            <span>Working Hours</span>
            <span className="font-medium">65%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-bar-value bg-purple-500" style={{ width: "65%" }}></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamMembersSummary;
