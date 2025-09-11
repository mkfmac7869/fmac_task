
import React, { useState, useEffect } from 'react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { db } from '@/lib/firebaseClient';
import { collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

interface Activity {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  action: string;
  target: string;
  value?: string;
  timestamp: string;
}

interface TaskActivityProps {
  taskId: string;
}

const TaskActivity = ({ taskId }: TaskActivityProps) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('task_activities')
          .select(`
            id,
            action,
            target,
            value,
            created_at,
            user_id,
            profiles:user_id (id, name, avatar)
          `)
          .eq('task_id', taskId)
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error('Error fetching activity logs:', error);
          return;
        }
        
        if (data) {
          const formattedActivities = data.map((activity: any) => {
            // Ensure we have a valid profile object
            const profile = activity.profiles || {};
            
            return {
              id: activity.id,
              user: {
                id: profile.id || 'unknown',
                name: profile.name || 'Unknown User',
                avatar: profile.avatar || `https://ui-avatars.com/api/?name=Unknown&background=ea384c&color=fff`,
              },
              action: activity.action,
              target: activity.target,
              value: activity.value,
              timestamp: activity.created_at,
            };
          });
          
          setActivities(formattedActivities);
        }
      } catch (err) {
        console.error('Error in activity fetch process:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (taskId) {
      fetchActivities();
    }
  }, [taskId]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {activities.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              No activity logs yet for this task.
            </div>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="flex gap-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={activity.user.avatar} />
                  <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="text-sm">
                    <span className="font-medium">{activity.user.name}</span>{' '}
                    {activity.action} {activity.target}
                    {activity.value && <span> to <span className="font-medium">{activity.value}</span></span>}
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(parseISO(activity.timestamp), { addSuffix: true })}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskActivity;
