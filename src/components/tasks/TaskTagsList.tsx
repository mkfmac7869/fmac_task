
import { Badge } from '@/components/ui/badge';

interface TaskTagsListProps {
  tags: string[];
}

const TaskTagsList = ({ tags }: TaskTagsListProps) => {
  if (!tags || tags.length === 0) return null;
  
  return (
    <div className="flex flex-wrap gap-1 mb-3">
      {tags.slice(0, 2).map((tag: string, idx: number) => (
        <Badge 
          key={idx} 
          variant="outline"
          className="text-xs bg-gray-50 text-gray-700"
        >
          {tag}
        </Badge>
      ))}
      {tags.length > 2 && (
        <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700">
          +{tags.length - 2}
        </Badge>
      )}
    </div>
  );
};

export default TaskTagsList;
