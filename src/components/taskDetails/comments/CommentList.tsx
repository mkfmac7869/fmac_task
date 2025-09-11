
import React from 'react';
import CommentItem from './CommentItem';
import { useAuth } from '@/context/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

interface CommentListProps {
  comments: Comment[];
  onDeleteComment?: (commentId: string) => Promise<void>;
}

const CommentList = ({ comments, onDeleteComment }: CommentListProps) => {
  const { user } = useAuth();
  const { hasPermission } = usePermissions(user);
  
  const canDeleteComment = (commentUserId: string) => {
    // Allow delete if:
    // 1. User owns the comment, or
    // 2. User is an admin, or
    // 3. User has delete_comments permission
    return user?.id === commentUserId || 
           user?.role === 'admin' ||
           hasPermission('delete_comments');
  };
  
  if (comments.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        No comments yet. Be the first to comment!
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="relative group">
          <CommentItem 
            id={comment.id}
            user={comment.user}
            content={comment.content}
            timestamp={comment.timestamp}
          />
          
          {onDeleteComment && canDeleteComment(comment.user.id) && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => onDeleteComment(comment.id)}
            >
              <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-500" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};

export default CommentList;
