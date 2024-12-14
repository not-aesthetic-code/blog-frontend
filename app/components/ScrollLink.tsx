'use client';

import { FC, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

interface ScrollLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

export const ScrollLink: FC<ScrollLinkProps> = ({ href, children, className }) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    const isArticlePage = pathname.startsWith('/article/');
    const targetId = href.replace(/.*\#/, "");

    if (isArticlePage && targetId === 'comments') {
      // If on article page and targeting comments, scroll smoothly
      const element = document.getElementById(targetId);
      element?.scrollIntoView({ behavior: 'smooth' });
    } else {
      // If on another page or targeting contact, navigate to home with hash
      router.push(href);
    }
  };

  return (
    <Link href={href} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
};