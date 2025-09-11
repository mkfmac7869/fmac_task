
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebaseClient';
import { collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { CommentService, TaskService, NotificationService } from '@/lib/firebaseService';
import { toast } from '@/hooks/use-toast';

interface User {
  id: string;
  name: string | null;
  avatar: string | null;
  email?: string;
}

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

interface Profile {
  id: string;
  name: string;
  avatar: string | null;
  email?: string;
}

export const useComments = (taskId: string, currentUser: any, onCommentAdded?: () => void) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (taskId) {
      fetchComments();
    }
  }, [taskId]);
  
  const fetchComments = async () => {
    if (!currentUser) return;
    
    try {
      setIsLoading(true);
      
      const data = await CommentService.getComments(taskId);

      if (!data) {
        console.error('Error fetching comments');
        return;
      }

      if (data) {
        const formattedComments = data.map((comment: any) => {
          // Safely access profile information with proper type checking
          const profile = comment.profiles || {} as Profile;
          
          return {
            id: comment.id,
            user: {
              id: profile.id || 'unknown',
              name: profile.name || 'Unknown User',
              avatar: profile.avatar || `https://ui-avatars.com/api/?name=Unknown&background=ea384c&color=fff`,
            },
            content: comment.content,
            timestamp: comment.created_at,
          };
        });
        
        setComments(formattedComments);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddComment = async (newComment: string) => {
    if (!newComment.trim() || !currentUser) return;
    
    setIsSubmitting(true);
    
    try {
      console.log("Adding comment to task:", taskId);
      
      // Insert the comment
      const data = await CommentService.addComment({
        taskId: taskId,
        userId: currentUser.id,
        content: newComment,
      });

      // Record comment activity
      await TaskService.addActivity(taskId, currentUser.id, 'added', {
        target: 'comment',
      });

      // Format the new comment
      const newCommentObj = {
        id: data.id,
        user: {
          id: currentUser.id,
          name: currentUser.name || 'Unknown User',
          avatar: currentUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name || 'Unknown')}&background=ea384c&color=fff`,
        },
        content: data.content,
        timestamp: data.createdAt || new Date().toISOString(),
      };

      // Update comments list
      setComments(prevComments => [newCommentObj, ...prevComments]);
      
      // Send notification (simplified for Firebase)
      try {
        await NotificationService.sendTaskNotification(taskId, currentUser.id, 'comment');
      } catch (error) {
        console.error("Error sending notification:", error);
      }

      toast({
        title: "Comment Added",
        description: "Your comment has been added successfully."
      });
      
      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (err) {
      console.error('Error in comment process:', err);
      toast({
        title: "Error Adding Comment",
        description: "There was a problem adding your comment.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!currentUser) return;
    
    try {
      // Delete the comment
      await CommentService.deleteComment(commentId);
      
      // Record delete activity
      await TaskService.addActivity(taskId, currentUser.id, 'deleted', {
        target: 'comment',
      });
      
      // Update comments list
      setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
      
      toast({
        title: "Comment Deleted",
        description: "The comment has been deleted successfully."
      });
    } catch (err) {
      console.error('Error deleting comment:', err);
      toast({
        title: "Error Deleting Comment",
        description: "There was a problem deleting the comment.",
        variant: "destructive"
      });
    }
  };

  return {
    comments,
    isLoading,
    isSubmitting,
    handleAddComment,
    handleDeleteComment  // Make sure this function is exported
  };
};
