import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from './components/Header/header';
import Footer from './components/Footer/footer';
import React from 'react';
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google'
import CookieConsent from "react-cookie-consent";

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
   <GoogleTagManager gtmId={process.env.GOOGLE_ANALYTICS_TOKEN || ''} />
   <CookieConsent
        location="bottom"
        buttonText="Accept"
        cookieName="cookieConsent"
        style={{ background: "#2B373B" }}
        buttonStyle={{ color: "#4e503b", fontSize: "13px" }}
        expires={150}
      >
        This website uses cookies to enhance the user experience.
      </CookieConsent>
  </html>
 );
}
