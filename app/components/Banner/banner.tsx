'use server'
import TextFlash from './TextTransition';
import { StrapiImage } from 'app/components/StrapiImage';
import { Button } from "@/components/ui/button"
import Link from 'next/link';
import Image from 'next/image';

async function getData() {
   try {
     const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
     const baseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;
     
     // Change the endpoint to match Strapi's collection name
     const response = await fetch(
       `${baseUrl}/api/authors?populate=*`,  // Changed from authors/1 to author
       {
         headers: {
           Authorization: `Bearer ${token}`,
           'Content-Type': 'application/json',
         },
         cache: 'no-store'
       }
     );
 
     if (!response.ok) {
       throw new Error(`HTTP error! status: ${response.status}`);
     }
 
     const jsonData = await response.json();
     return jsonData.data
   } catch (error) {
     console.error('Error fetching data:', error);
     return null;
   }
 }

export default async function Banner() {
   const data = await getData();
   const baseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL
   const imageUrl = data?.[0]?.avatar?.url || 
   data?.[0]?.avatar?.formats?.small?.url;
   const lastUrl = imageUrl ? `${baseUrl}${imageUrl}` : '';


   console.log("Full data:", JSON.stringify(data, null, 2));

   console.log("DATA:", JSON.stringify(data))

 return (
    <div className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
     <div className="max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row items-center justify-between">
       {/* Image Container - Now first in the flex column for mobile */}
       <div className="lg:w-1/2 flex justify-center lg:justify-end order-first lg:order-last mb-8 lg:mb-0">
  <div className="relative w-64 h-64 lg:w-80 lg:h-80">
         {lastUrl && (
            <Image
            src={lastUrl}
            alt="Łukasz"
            fill
            className="rounded-lg object-cover"
            sizes="(max-width: 768px) 256px, 320px"
            priority
            />
         )}
      </div>
</div>
  
       {/* Text Content */}
       <div className="lg:w-1/2 max-w-xl text-center lg:text-left">
        <h1 className="text-4xl font-bold mb-4">
         Cześć, jestem <span className="text-blue-500">Łukasz</span>
        </h1>
        <div className="text-lg mb-4">
         <p>
          Pomagam ludziom w{' '}
          <span className="inline-block">
           <TextFlash interval={1500} />
          </span>
         </p>
        </div>
        <p className="text-gray-300 mb-6">
         Pracuję jako web developer i zajmuję się wszystkim, co jest potrzebne do
         rozwiązania problemu
        </p>
        <div className="space-x-4">
         <Button className="bg-blue-500 hover:bg-bg-blue-500 text-white text-sm py-2.5 px-5 mr-2 mb-2 rounded-xl shadow-md hover:scale-105 transition duration-300">
          <Link href="/o-mnie">
           O mnie
          </Link>
         </Button>
        </div>
       </div>
    </div>
   </div>
  </div>
 );
}
