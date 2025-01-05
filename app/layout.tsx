import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from './components/Header/header';
import Footer from './components/Footer/footer';
import React from 'react';
import { GoogleAnalytics } from '@next/third-parties/google'
 
import { QueryProvider } from './lib/query-provider';


const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
 title: 'Łukasz Wasyłeczko | Tworzenie Stron Internetowych | Automatyzacja | Programowanie',
 description: 'Tworzenie oprogramowania, stron internetowych. Nauka nowych technologii, przedstawianie ciekawych dla mnie konceptów od zaplecza',
};

export default function RootLayout({
 children,
}: Readonly<{
 children: React.ReactNode;
}>) {
 return (
  <html lang="en" className="scroll-smooth" >
   <body className={inter.className}>
    <QueryProvider>
     <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
     </div>
    </QueryProvider>
   </body>
   <GoogleAnalytics gaId={process.env.GOOGLE_ANALYTICS_TOKEN || ''} />
  </html>
 );
}
