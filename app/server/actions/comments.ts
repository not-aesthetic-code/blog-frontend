"use server"
import { revalidatePath } from "next/cache";
import { NewBlogComment } from '../../types/comments'

export const fetchComments = async (postId: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/comments?post=${postId}`, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
      },
    });
    const data = await response.json();
    return data;
};

export const getCommentCount = async (postId: string) => {
    const comments = await fetchComments(postId);
    return comments.data.length; 
};

export async function postComment(newComment: NewBlogComment) {
    try {
        const commentData = {
            data: {
                ...newComment,
            }
        };

        const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/comments`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
            },
            body: JSON.stringify(commentData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to post comment');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error posting comment:', error);
        throw error;
    }
}