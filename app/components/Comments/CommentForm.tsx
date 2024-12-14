"use client"
import React from 'react';
import { Button } from '@/components/ui/button';

type CommentFormProps = {
  postId?: string;
  handleSubmit: (formData: FormData, parentId?: string) => Promise<void>;
  isReply: boolean;
  isLoading?: boolean;
};

function CommentForm({ postId, handleSubmit, isReply, isLoading }: CommentFormProps) {
  return (
    <form onSubmit={async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target as HTMLFormElement);
      await handleSubmit(formData);
      (e.target as HTMLFormElement).reset();
    }} className={isReply ? "mt-4 w-full" : ""}>
      {!isReply && (
        <>
          <h1 className="text-2xl font-bold mb-2">Dodaj komentarz</h1>
          <p className="text-sm mb-4">Twój adres e-mail nie zostanie opublikowany. Wymagane pola są oznaczone *</p>
          {postId && <input type="hidden" name="postId" value={postId} />}
        </>
      )}
      <textarea
        name="comment"
        placeholder={isReply ? "Odpowiedz" : "Komentarz"}
        className={`w-full ${isReply ? 'h-20' : 'h-32'} border border-gray-200 rounded-md p-3 mb-2`}
        required
        disabled={isLoading}
      ></textarea>
      <input
        name="name"
        type="text"
        placeholder="Imie *"
        className="w-full border border-gray-200 rounded-md p-3 mb-2"
        required
        disabled={isLoading}
      />
      <input
        name="email"
        type="email"
        placeholder="E-mail *"
        className="w-full border border-gray-200 rounded-md p-3 mb-2"
        required
        disabled={isLoading}
      />
      <Button 
        type="submit" 
        className="bg-blue-500 hover:bg-blue-600 w-full text-white py-2 px-4 rounded-md"
        disabled={isLoading}
      >
        {isLoading 
          ? "Wysyłanie..." 
          : isReply 
            ? "Opublikuj odpowiedź" 
            : "Opublikuj komentarz"
        }
      </Button>
    </form>
  );
}

export default CommentForm;