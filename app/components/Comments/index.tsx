"use client"
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BlogComment, NewBlogComment } from '../../types/comments';
import { fetchComments, postComment } from '../../server/actions/comments';
import CommentList from './CommentList';
import CommentForm from './CommentForm';
import { useState } from 'react';

export function Comments({ postId, slug }: { postId: string, slug: string }) {
  const queryClient = useQueryClient();
  const [replyTo, setReplyTo] = useState<string | null>(null);
  
  const { data: commentsData, isError: isQueryError } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => fetchComments(postId),
    staleTime: 1000 * 60
  });

  const mutation = useMutation({
    mutationFn: async (newComment: NewBlogComment) => {
      try {
        const response = await postComment(newComment);
        if (!response) {
          throw new Error('Failed to post comment');
        }
        return response;
      } catch (error) {
        throw error;
      }
    },
    onMutate: async (newComment) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['comments', postId] });
      
      // Snapshot the previous value
      const previousComments = queryClient.getQueryData(['comments', postId]);
      
      // Optimistically update to the new value
      queryClient.setQueryData(['comments', postId], (old: any) => {
        const optimisticComment = {
          ...newComment,
          id: 'temp-' + new Date().getTime(),
          createdAt: new Date().toISOString(),
        };
        return {
          ...old,
          data: [...(old?.data || []), optimisticComment]
        };
      });
      
      return { previousComments };
    },
    onError: (err, newComment, context) => {
      queryClient.setQueryData(['comments', postId], context?.previousComments);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      setReplyTo(null);
    }
  });

  const handleSubmit = async (formData: FormData, parentId?: string) => {
    try {
      const newComment: NewBlogComment = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        body: formData.get('comment') as string,
        post: postId,
        ...(parentId && { parentId })
      };

      await mutation.mutateAsync(newComment);
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  if (isQueryError) {
    return <div>Error loading comments</div>;
  }

  const comments = Array.isArray(commentsData) 
    ? commentsData 
    : commentsData?.data || [];

  // Sort comments by creation date
  const sortedComments = [...comments].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="relative z-10">
      <CommentList 
        comments={sortedComments} 
        replyTo={replyTo} 
        setReplyTo={setReplyTo} 
        handleSubmit={handleSubmit}
        isLoading={mutation.isPending}
      />
      {!replyTo && (
        <CommentForm 
          postId={postId} 
          handleSubmit={handleSubmit} 
          isLoading={mutation.isPending}
          isReply={false} 
        />
      )}
    </div>
  );
}