import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Post } from '../../types/posts'

interface ArticleCardProps {
 article: Post;
}

export default function ArticleCard({ article }: ArticleCardProps) {
 const formattedDate = new Date(article.createdAt)
  .toISOString()
  .split('T')[0];
  
 const firstImage = article.media && article.media.length > 0 ? article.media[0] : null;
 const imageUrl = firstImage?.formats?.large?.url ?? firstImage?.url ?? null;

 return (
    <div className="bg-white rounded-lg overflow-hidden flex flex-col w-full max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto shadow transition-shadow duration-300 hover:shadow-lg cursor-pointer">
    <div className="relative w-full pt-[56.25%] sm:pt-[75%] md:pt-[66.67%] lg:pt-[60%]">
        <Image
              src={imageUrl || '/placeholder-image.jpg'}
              alt={article.title || 'Article title'}
              fill
              priority
              className="object-cover absolute top-0 left-0 w-full h-full"
              quality={90}
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 384px, (max-width: 1024px) 448px, 576px"
              />
    </div>
    <div className="p-4 flex flex-col justify-between flex-grow">
     <div className="flex justify-between items-center">
      <h1 className="font-bold text-lg sm:text-xl md:text-2xl my-2 sm:my-3 md:my-4 flex-1 pr-2">{article.title}</h1>
      <span className="text-gray-600 text-xs sm:text-sm whitespace-nowrap">
       {formattedDate}
      </span>
     </div>
     <p className="text-gray-700 text-sm sm:text-base my-2 sm:my-3 md:my-4">{getBodyContent(article.section)}</p>
    </div>
    <div className="flex justify-end m-4">
     <Button className="w-28 sm:w-32 bg-blue-500 hover:bg-bg-blue-500 text-white text-sm py-2.5 px-5 mr-2 mb-2 rounded-xl shadow-md hover:scale-105 transition duration-300">
      <Link href={`/posts/${article.slug}`} className="text-center text-sm sm:text-base" passHref>
       Czytaj Dalej
      </Link>
     </Button>
    </div>
   </div>
 );
}

function getBodyContent(section: string): string {
  // Remove Markdown headers and image markdown
  const content = section
    .replace(/^#.*$/gm, '') // Remove headers
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove image markdown
    .trim();

  // Limit to 200 characters
  return content.substring(0, 200) + (content.length > 200 ? '...' : '');
}