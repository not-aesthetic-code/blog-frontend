"use client"
import React from 'react';
import { BlogComment } from '../../types/comments';
import CommentItem from './CommentItem';

type CommentListProps = {
  comments: BlogComment[];
  replyTo: string | null;
  setReplyTo: (id: string | null) => void;
  handleSubmit: (formData: FormData, parentId?: string) => Promise<void>;
  isLoading?: boolean;
};

function CommentList({ comments, replyTo, setReplyTo, handleSubmit, isLoading }: CommentListProps) {
    function getCommentVariation(count: number) {
        if (count === 0) {
          return 'BRAK KOMENTARZY';
        } else if (count % 10 === 1 && count % 100 !== 11) {
          return 'KOMENTARZ';
        } else if (2 <= count % 10 && count % 10 <= 4 && !(12 <= count % 100 && count % 100 <= 14)) {
          return 'KOMENTARZE';
        } else {
          return 'KOMENTARZY';
        }
    }

  const topLevelComments = comments.filter(comment => !comment.parentId);

  return (
    <div className="comments-section mb-4">
      <h1 className="text-2xl flex justify-center font-bold mb-4">
        {comments.length} {getCommentVariation(comments.length)}
      </h1>
      <ul className="space-y-6">
        {isLoading ? (
          <div className="text-center">Ładowanie komentarzy...</div>
        ) : (
          topLevelComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              replyTo={replyTo}
              setReplyTo={setReplyTo}
              handleSubmit={handleSubmit}
              allComments={comments}
            />
          ))
        )}
      </ul>
    </div>
  );
}

export default CommentList;