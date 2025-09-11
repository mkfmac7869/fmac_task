
import React from 'react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface CommentItemProps {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
}

const CommentItem = ({ user, content, timestamp }: CommentItemProps) => {
  return (
    <div className="flex gap-4">
      <Avatar>
        <AvatarImage src={user.avatar} />
        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">{user.name}</h4>
          <span className="text-xs text-gray-500">
            {formatDistanceToNow(parseISO(timestamp), { addSuffix: true })}
          </span>
        </div>
        <p className="text-gray-700 mt-1">{content}</p>
      </div>
    </div>
  );
};

export default CommentItem;
