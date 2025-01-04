"use client"

import { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  type: string;
}

export function Modal({ isOpen, onClose, message, type }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/30" onClick={onClose} />
      <div className={`relative p-4 rounded-lg shadow-lg ${
        type === 'success' ? 'bg-green-100' : 'bg-red-100'
      }`}>
        <p className={`text-lg ${
          type === 'success' ? 'text-green-800' : 'text-red-800'
        }`}>
          {message}
        </p>
      </div>
    </div>
  );
} 