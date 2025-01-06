import Image from 'next/image';

interface SocialIconProps {
 href: string;
 src: string;
 alt: string;
 hoverColor: string;
}

const socialIcons: SocialIconProps[] = [
 {
  href: 'https://www.linkedin.com/in/lukaszwasyleczko',
  src: '/icons/linkedin.svg',
  alt: 'linkedin',
  hoverColor: 'hover:bg-cyan-700',
 },
 {
  href: 'https://x.com/lwasyleczko',
  src: '/icons/x.svg',
  alt: 'x',
  hoverColor: 'hover:bg-gray-800',
 },
//  {
//   href: '#',
//   src: '/icons/instagram.svg',
//   alt: 'instagram',
//   hoverColor: 'hover:bg-red-700',
//  },
//  {
//   href: '#',
//   src: '/icons/email.svg',
//   alt: 'email',
//   hoverColor: 'hover:bg-gray-500',
//  },
];

const SocialIcon = ({ href, src, alt, hoverColor }: SocialIconProps) => (
 <a href={href} className="mr-4">
  <div
   className={`bg-gray-600 ${hoverColor} rounded-full w-10 h-10 flex items-center justify-center`}
  >
   <Image src={src} alt={alt} width={18} height={18} />
  </div>
 </a>
);

export default function Footer() {
 return (
  <footer className="bg-black text-white py-8 w-full">
   <div className="container mx-auto flex flex-col md:flex-row justify-between items-start md:space-x-8 px-4">
    <div className="flex flex-col space-y-4 md:w-1/2 md:ml-auto">
     <span className="text-2xl font-bold">Łukasz Wasyłeczko</span>
     <p>Zapraszam do śledzenia również na innych platformach</p>
     <div className="flex justify-start">
      {socialIcons.map((icon) => (
       <SocialIcon key={icon.alt} {...icon} />
      ))}
     </div>
     <h3 className="font-semibold">Szybki dostęp</h3>
     <div className="flex justify-center md:justify-start space-x-8">
      <ul className="flex space-x-4">
       <li>
        <a href="#" className="hover:underline">
         Strona główna
        </a>
       </li>
       <li>
        <a href="/o-mnie" className="hover:underline">
         O mnie
        </a>
       </li>
       <li>
        <a href="/artykuly" className="hover:underline">
         Artykuły
        </a>
       </li>
       {/* <li>
        <a href="#" className="hover:underline">
         Spis Treści
        </a>
       </li> */}
      </ul>
     </div>
    </div>
    <div className="flex flex-col space-y-4 md:w-1/2 mt-4">
     <h3 className="font-semibold">Dane kontaktowe</h3>
     <p>
      <a href="mailto:lukasz.wasyleczko@gmail.com" className="text-blue-400">
       lukasz.wasyleczko@gmail.com
      </a>
     </p>
     <p>
      Możesz skontaktować się przez ten adres e-mail lub poprzez formularz na
      stronie, śmiało możesz pisać poprzez social media
     </p>
    </div>
   </div>
   <div className="container mx-auto text-center mt-8">
    <p className="text-sm">
     2024 © Łukasz Wasyłeczko Wszelkie prawa zastrzeżone.
    </p>
   </div>
  </footer>
 );
}
