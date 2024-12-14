'use client';

import { useState, useEffect } from 'react';

interface TextFlashProps {
 interval?: number;
}

const strings = [
 'tworzeniu stron internetowych',
 'automatyzacji',
 'tworzeniu ci/cd',
];

const TextFlash: React.FC<TextFlashProps> = ({ interval = 3000 }) => {
 const [currentStringIndex, setCurrentStringIndex] = useState(0);
 const [typedString, setTypedString] = useState('');
 const [isDeleting, setIsDeleting] = useState(false);

 useEffect(() => {
  const currentString = strings[currentStringIndex];
  let typingSpeed = 100;

  if (isDeleting) {
   typingSpeed /= 2;
  }

  const handleTyping = () => {
   if (!isDeleting && typedString.length < currentString.length) {
    setTypedString(currentString.substring(0, typedString.length + 1));
   } else if (isDeleting && typedString.length > 0) {
    setTypedString(currentString.substring(0, typedString.length - 1));
   } else if (!isDeleting && typedString.length === currentString.length) {
    setIsDeleting(true);
    typingSpeed = interval;
   } else if (isDeleting && typedString.length === 0) {
    setIsDeleting(false);
    setCurrentStringIndex((prevIndex) => (prevIndex + 1) % strings.length);
   }
  };

  const typingTimeout = setTimeout(handleTyping, typingSpeed);

  return () => clearTimeout(typingTimeout);
 }, [typedString, isDeleting, currentStringIndex, interval]);

 return (
  <span className="text-lg text-white">
   <span>{typedString}</span>
   <span className="blinking-cursor">|</span>
  </span>
 );
};

export default TextFlash;
