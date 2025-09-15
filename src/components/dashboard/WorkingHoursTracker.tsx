import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Clock, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { FirebaseService } from '@/lib/firebaseService';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

interface TimeLog {
  id: string;
  userId: string;
  taskId?: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  description?: string;
}

export const WorkingHoursTracker = () => {
  const { user } = useAuth();
  const [isTracking, setIsTracking] = useState(false);
  const [currentSession, setCurrentSession] = useState<TimeLog | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [todayHours, setTodayHours] = useState(0);
  const [weekHours, setWeekHours] = useState(0);

  // Load today's working hours
  useEffect(() => {
    const loadWorkingHours = async () => {
      if (!user) return;

      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const logs = await FirebaseService.getDocuments('timeLogs', [
          { field: 'userId', operator: '==', value: user.id },
          { field: 'startTime', operator: '>=', value: today }
        ]);

        let totalToday = 0;
        logs.forEach((log: any) => {
          if (log.duration) {
            totalToday += log.duration;
          }
        });

        setTodayHours(totalToday);

        // Calculate week hours
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        weekStart.setHours(0, 0, 0, 0);

        const weekLogs = await FirebaseService.getDocuments('timeLogs', [
          { field: 'userId', operator: '==', value: user.id },
          { field: 'startTime', operator: '>=', value: weekStart }
        ]);

        let totalWeek = 0;
        weekLogs.forEach((log: any) => {
          if (log.duration) {
            totalWeek += log.duration;
          }
        });

        setWeekHours(totalWeek);

        // Check for active session
        const activeSessions = logs.filter((log: any) => !log.endTime);
        if (activeSessions.length > 0) {
          const session = activeSessions[0];
          setCurrentSession({
            ...session,
            startTime: session.startTime.toDate()
          });
          setIsTracking(true);
        }
      } catch (error) {
        console.error('Error loading working hours:', error);
      }
    };

    loadWorkingHours();
  }, [user]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isTracking && currentSession) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - currentSession.startTime.getTime()) / 1000);
        setElapsedTime(elapsed);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isTracking, currentSession]);

  const startTracking = async () => {
    if (!user) return;

    try {
      const session: Partial<TimeLog> = {
        userId: user.id,
        startTime: new Date(),
        description: 'Work session'
      };

      const docRef = await FirebaseService.addDocument('timeLogs', session);
      
      setCurrentSession({
        id: docRef.id,
        ...session
      } as TimeLog);
      
      setIsTracking(true);
      setElapsedTime(0);
    } catch (error) {
      console.error('Error starting time tracking:', error);
    }
  };

  const stopTracking = async () => {
    if (!currentSession) return;

    try {
      const endTime = new Date();
      const duration = Math.floor((endTime.getTime() - currentSession.startTime.getTime()) / 1000);

      await FirebaseService.updateDocument('timeLogs', currentSession.id, {
        endTime,
        duration
      });

      setTodayHours(prev => prev + duration);
      setWeekHours(prev => prev + duration);
      setIsTracking(false);
      setCurrentSession(null);
      setElapsedTime(0);
    } catch (error) {
      console.error('Error stopping time tracking:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatHours = (seconds: number) => {
    const hours = (seconds / 3600).toFixed(1);
    return `${hours}h`;
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Working Hours Tracker
          </span>
          <Badge variant={isTracking ? "default" : "outline"}>
            {isTracking ? "Tracking" : "Idle"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Timer Display */}
        <div className="text-center space-y-4">
          <div className="text-5xl font-bold font-mono bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {formatTime(elapsedTime)}
          </div>
          
          <Button
            onClick={isTracking ? stopTracking : startTracking}
            size="lg"
            className={cn(
              "w-full transition-all duration-300",
              isTracking 
                ? "bg-red-600 hover:bg-red-700" 
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            )}
          >
            {isTracking ? (
              <>
                <Pause className="h-5 w-5 mr-2" />
                Stop Tracking
              </>
            ) : (
              <>
                <Play className="h-5 w-5 mr-2" />
                Start Tracking
              </>
            )}
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">Today</span>
            </div>
            <p className="text-2xl font-bold">{formatHours(todayHours + elapsedTime)}</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">This Week</span>
            </div>
            <p className="text-2xl font-bold">{formatHours(weekHours + elapsedTime)}</p>
          </div>
        </div>

        {/* Daily Goal Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Daily Goal</span>
            <span className="font-medium">{formatHours(todayHours + elapsedTime)} / 8h</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300"
              style={{ width: `${Math.min(100, ((todayHours + elapsedTime) / 28800) * 100)}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
