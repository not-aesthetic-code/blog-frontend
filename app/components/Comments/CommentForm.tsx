"use client"
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';

type CommentFormProps = {
  postId?: string;
  handleSubmit: (formData: FormData, parentId?: string) => Promise<void>;
  isReply: boolean;
  isLoading?: boolean;
};

function CommentForm({ postId, handleSubmit, isReply, isLoading }: CommentFormProps) {
  const [modalState, setModalState] = useState({
    isOpen: false,
    message: '',
    type: 'success'
  });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      await handleSubmit(formData);

      console.log("modal", formData)
      setModalState({
        isOpen: true,
        message: 'Komentarz został dodany pomyślnie!',
        type: 'success'
      });
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      setModalState({
        isOpen: true,
        message: 'Wystąpił błąd podczas dodawania komentarza.',
        type: 'error'
      });
    }
  };

  return (
    <>
      <form onSubmit={onSubmit} className={isReply ? "mt-4 w-full" : ""}>
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

      <Modal
        isOpen={modalState.isOpen}
        onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
        message={modalState.message}
        type={modalState.type}
      />
    </>
  );
}

export default CommentForm;