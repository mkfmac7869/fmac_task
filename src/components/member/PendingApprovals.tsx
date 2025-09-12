import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, X, Clock, UserCheck } from 'lucide-react';
import { FirebaseService } from '@/lib/firebaseService';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

interface PendingUser {
  id: string;
  name: string;
  email: string;
  department: string;
  createdAt: Date;
  avatar?: string;
}

const PendingApprovals = () => {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      setIsLoading(true);
      const users = await FirebaseService.getDocuments('profiles');
      
      const pending = users
        .filter(u => !u.isApproved)
        .map(u => ({
          id: u.id,
          name: u.name,
          email: u.email,
          department: u.department,
          createdAt: u.createdAt?.toDate() || new Date(),
          avatar: u.avatar
        }))
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      setPendingUsers(pending);
    } catch (error) {
      console.error('Error fetching pending users:', error);
      toast({
        title: 'Error',
        description: 'Failed to load pending users',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (userId: string) => {
    try {
      await FirebaseService.updateDocument('profiles', userId, {
        isApproved: true,
        approvedBy: user?.id,
        approvedAt: new Date()
      });

      setPendingUsers(prev => prev.filter(u => u.id !== userId));
      
      toast({
        title: 'Success',
        description: 'User approved successfully'
      });
    } catch (error) {
      console.error('Error approving user:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve user',
        variant: 'destructive'
      });
    }
  };

  const handleReject = async (userId: string) => {
    try {
      // For now, we'll just remove them from the pending list
      // In a real app, you might want to delete the user or mark them as rejected
      setPendingUsers(prev => prev.filter(u => u.id !== userId));
      
      toast({
        title: 'Success',
        description: 'User rejected'
      });
    } catch (error) {
      console.error('Error rejecting user:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject user',
        variant: 'destructive'
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Pending Approvals
          </CardTitle>
          <CardDescription>Loading pending user approvals...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCheck className="h-5 w-5" />
          Pending Approvals
        </CardTitle>
        <CardDescription>
          {pendingUsers.length} user{pendingUsers.length !== 1 ? 's' : ''} waiting for approval
        </CardDescription>
      </CardHeader>
      <CardContent>
        {pendingUsers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <UserCheck className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No pending approvals</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingUsers.map((pendingUser) => (
              <div key={pendingUser.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={pendingUser.avatar} alt={pendingUser.name} />
                    <AvatarFallback>{pendingUser.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{pendingUser.name}</h4>
                    <p className="text-sm text-gray-500">{pendingUser.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{pendingUser.department}</Badge>
                      <span className="text-xs text-gray-400">
                        {pendingUser.createdAt.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleReject(pendingUser.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleApprove(pendingUser.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PendingApprovals;
