
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import CommentList from './comments/CommentList';
import CommentForm from './comments/CommentForm';
import { useComments } from './comments/useComments';

interface Comment {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
}

interface TaskCommentsProps {
  comments: Comment[];
  currentUser: any;
  taskId: string;
  onCommentAdded?: () => void;
}

const TaskComments = ({ currentUser, taskId, onCommentAdded }: TaskCommentsProps) => {
  const { user } = useAuth();
  const { comments, isSubmitting, handleAddComment, handleDeleteComment } = useComments(taskId, user, onCommentAdded);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-6">
          <CommentList 
            comments={comments}
            onDeleteComment={handleDeleteComment}
          />
          <CommentForm 
            user={currentUser} 
            onSubmit={handleAddComment} 
            isSubmitting={isSubmitting} 
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskComments;
