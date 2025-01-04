"use client"
import React from 'react';
import { BlogComment } from '../../types/comments';
import { Button } from '@/components/ui/button';
import CommentForm from './CommentForm';

type CommentItemProps = {
  comment: BlogComment;
  replyTo: string | null;
  setReplyTo: (id: string | null) => void;
  handleSubmit: (formData: FormData, parentId?: string) => Promise<void>;
  allComments: BlogComment[];
};

function CommentItem({ comment, replyTo, setReplyTo, handleSubmit, allComments }: CommentItemProps) {
  const replies = allComments.filter(c => c.parentId === comment.id);

  const handleReplySubmit = async (formData: FormData) => {
    await handleSubmit(formData, comment.id);
  };

  return (
    <li className={`flex flex-col ${comment.parentId ? 'mt-4 ml-8' : 'mb-6'}`}>
      <div className="flex items-start w-full">
        <div className="flex-shrink-0 mr-4">
          <div className={`${comment.parentId ? 'w-8 h-8' : 'w-12 h-12'} bg-gray-200 rounded-full flex items-center justify-center text-gray-500`}>
            {comment.name.charAt(0).toUpperCase()}
          </div>
        </div>
        <div className="flex-grow">
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold">{comment.name}</span>
            <Button 
              onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)} 
              className="text-sm bg-blue-100 text-blue-500 px-3 py-1 rounded"
            >
              ODPOWIEDZ
            </Button>
          </div>
          <div className="text-sm text-gray-500 mb-2">
            {new Date(comment.createdAt).toLocaleString('pl-PL', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
          <p className="text-gray-700">{comment.body}</p>
        </div>
      </div>
      {replyTo === comment.id && (
        <div className="ml-16 mt-4">
          <CommentForm 
            handleSubmit={handleReplySubmit}
            isReply={true}
          />
        </div>
      )}
      {replies.length > 0 && (
        <ul className="mt-4 space-y-4 ml-8">
          {replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              replyTo={replyTo}
              setReplyTo={setReplyTo}
              handleSubmit={handleSubmit}
              allComments={allComments}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export default CommentItem;
