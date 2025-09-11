
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface MemberCompletionRateProps {
  completionRate: number;
}

const MemberCompletionRate = ({ completionRate }: MemberCompletionRateProps) => {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-1">
        <CardTitle className="text-lg">Completion Rate</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Progress value={completionRate} className="h-3" />
          </div>
          <div className="font-semibold text-lg">{completionRate.toFixed(0)}%</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MemberCompletionRate;
