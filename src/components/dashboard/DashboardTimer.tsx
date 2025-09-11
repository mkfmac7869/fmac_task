
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, Clock, MoreVertical, PlayCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const DashboardTimer = () => {
  const [time, setTime] = useState<string>('00:00:00');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  
  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      toast({
        title: "Timer Started",
        description: "The task timer has been started.",
      });
    } else {
      setIsRunning(false);
      toast({
        title: "Timer Paused",
        description: "The task timer has been paused.",
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Timer</CardTitle>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-center py-2">02:36:19</div>
        <div className="flex justify-center gap-2">
          <Button 
            variant={isRunning ? "outline" : "default"} 
            size="icon" 
            className={isRunning ? "border-fmac-red text-fmac-red" : "bg-fmac-red hover:bg-fmac-red/90"}
            onClick={startTimer}
          >
            {isRunning ? (
              <Clock className="h-5 w-5" />
            ) : (
              <PlayCircle className="h-5 w-5" />
            )}
          </Button>
          <Button variant="outline" size="icon">
            <CalendarDays className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardTimer;
