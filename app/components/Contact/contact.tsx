'use client';

import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { sendEmail } from 'app/utils/sendForm';

interface FormData {
  name: string;
  email: string;
  message: string;
}

export default function ContactForm() {
  const { register, handleSubmit } = useForm<FormData>();

  function onSubmit(data: FormData) {
    sendEmail(data);
  }

  return (
    <section className="bg-background py-12" id="contact">
      <div className="max-w-2xl mx-auto px-6">
        <h1 className="text-3xl font-bold mb-4">Skontaktuj się ze mną</h1>
        <p className="text-gray-600 mb-8">

        Masz pytanie, pomysł na projekt albo chcesz porozmawiać o współpracy? Daj znać! Niezależnie od tego, czy potrzebujesz pomocy, masz techniczne pytanie, czy po prostu chcesz się przywitać – napisz do mnie przez poniższy formularz.         </p>
        
     
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <input
              type="text"
              {...register('name')}
              placeholder="Imię i nazwisko"
              className="w-full p-3 border rounded"
              required
            />
          </div>
          
          <div>
            <input
              type="email" 
              {...register('email')}
              placeholder="Email"
              className="w-full p-3 border rounded"
              required
            />
          </div>

          <div>
            <textarea
              {...register('message')}
              placeholder="Twoja wiadomość"
              className="w-full p-3 border rounded"
              rows={5}
              required
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg 
                     font-semibold hover:bg-blue-700 transition-colors"
          >
            WYŚLIJ ZAPYTANIE
          </button>
        </form>
        </div>
      </section>
    );
}