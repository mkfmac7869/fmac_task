
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays } from 'lucide-react';

const DashboardCalendar = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Calendar</CardTitle>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <CalendarDays className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="text-center">
          <div className="text-sm font-medium mb-1">September 2023</div>
          <div className="grid grid-cols-7 gap-1 text-xs mb-2">
            <div className="text-gray-500">Sun</div>
            <div className="text-gray-500">Mon</div>
            <div className="text-gray-500">Tue</div>
            <div className="text-gray-500">Wed</div>
            <div className="text-gray-500">Thu</div>
            <div className="text-gray-500">Fri</div>
            <div className="text-gray-500">Sat</div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-sm">
            {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
              <div 
                key={day} 
                className={`p-2 rounded-full ${day === 8 ? 'bg-fmac-red text-white' : 'hover:bg-gray-100'} cursor-pointer`}
              >
                {day}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardCalendar;
