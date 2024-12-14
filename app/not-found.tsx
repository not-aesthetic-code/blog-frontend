import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import notFound from '../public/notFound.svg';

export default function NotFound() {
 return (
  <div className="container mx-auto py-8 flex flex-col items-center">
   <section className="mb-8">
    <Image priority src={notFound} alt="Not Found" />
   </section>
   <h1 className="text-4xl font-bold mb-8 text-center">
    Strony nie znaleziono
   </h1>
   <h3 className="text-center mb-4 text-2xl">
    Wygląda na to, że strona, której szukasz nie istnieje.
   </h3>
   <Button>
    <Link href="/" className="text-center">
     Powrót do strony głównej
    </Link>
   </Button>
  </div>
 );
}
