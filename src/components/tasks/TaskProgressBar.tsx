
import { Progress } from '@/components/ui/progress';

interface TaskProgressBarProps {
  progress: number;
}

const TaskProgressBar = ({ progress }: TaskProgressBarProps) => {
  return (
    <div className="flex items-center gap-2 flex-1">
      <Progress
        value={progress}
        className="h-1.5"
      />
      <span className="text-xs text-gray-600">{progress}%</span>
    </div>
  );
};

export default TaskProgressBar;
