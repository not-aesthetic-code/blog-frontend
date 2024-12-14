
import { Post } from '../../types/posts';
import ArticleCard from './ArticleCard';

async function getData(): Promise<Post[]> {
 const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
 const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/posts?populate=*`, {
  headers: {
   Authorization: `Bearer ${token}`,
   'Content-Type': 'application/json',
  },
 });

 const jsonData = await response.json();
 return jsonData.data;
}

export default async function ArticleCardLayout() {
 const data: Post[] = await getData();

 return (
  <>
   <div>
    <h1 className="text-2xl justify-center text-center my-4 font-bold">
     Najnowsze Wpisy
    </h1>
    <div className="flex justify-center">
     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 max-w-screen-lg">
      {data.map((article) => (
       <ArticleCard key={article.id} article={article} />
      ))}
     </div>
    </div>
   </div>
   
  </>
 );
}
