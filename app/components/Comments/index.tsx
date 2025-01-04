"use client"

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BlogComment, NewBlogComment } from 'app/types/comments';
import { fetchComments, postComment } from 'app/server/actions/comments';
import CommentList from './CommentList';
import CommentForm from './CommentForm';
import { useState } from 'react';

interface CommentsProps {
    postId: string;
    slug: string;
}

export function Comments({ postId, slug }: CommentsProps) {
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
            await queryClient.cancelQueries({ queryKey: ['comments', postId] });
            const previousComments = queryClient.getQueryData(['comments', postId]);
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

    const sortedComments = [...comments].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return (
        <div className="relative z-10 mt-8">
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
