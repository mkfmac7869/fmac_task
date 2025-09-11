
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface CommentFormProps {
  user: {
    id?: string;
    name?: string;
    avatar?: string;
  };
  onSubmit: (content: string) => Promise<void>;
  isSubmitting: boolean;
}

const CommentForm = ({ user, onSubmit, isSubmitting }: CommentFormProps) => {
  const [content, setContent] = useState('');

  const handleSubmit = async () => {
    if (!content.trim()) return;
    
    try {
      await onSubmit(content);
      setContent('');
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  return (
    <div className="flex gap-4 pt-4 border-t">
      <Avatar>
        <AvatarImage src={user?.avatar || 'https://ui-avatars.com/api/?name=User&background=ea384c&color=fff'} />
        <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <Textarea
          placeholder="Add a comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="mb-2"
        />
        <Button 
          className="bg-fmac-red hover:bg-fmac-red/90"
          onClick={handleSubmit}
          disabled={!content.trim() || isSubmitting}
        >
          {isSubmitting ? 'Posting...' : 'Post Comment'}
        </Button>
      </div>
    </div>
  );
};

export default CommentForm;
