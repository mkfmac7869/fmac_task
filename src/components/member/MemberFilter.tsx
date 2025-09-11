
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { UserRole } from '@/types/auth';

interface MemberFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedRoles: Record<UserRole, boolean>;
  handleRoleToggle: (role: UserRole) => void;
}

const MemberFilter = ({
  searchQuery,
  setSearchQuery,
  selectedRoles,
  handleRoleToggle
}: MemberFilterProps) => {
  return (
    <Card className="mb-6 shadow-md">
      <CardContent className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              className="pl-10" 
              placeholder="Search by name, email, or department..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-700 self-center mr-2">Filter by role:</span>
            {(['admin', 'manager', 'head', 'member'] as UserRole[]).map((role) => (
              <div key={role} className="flex items-center space-x-2">
                <Checkbox 
                  id={`role-${role}`}
                  checked={selectedRoles[role]} 
                  onCheckedChange={() => handleRoleToggle(role)}
                />
                <label
                  htmlFor={`role-${role}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize"
                >
                  {role}
                </label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MemberFilter;
