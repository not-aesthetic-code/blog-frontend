// components/ArticleList.js
import { ArticleType } from 'app/components/Article/Article.type';
import { transformDate } from 'app/utils/shortDateForm';
import Image from 'next/image';
import Link from 'next/link';

async function getData(): Promise<ArticleType[]> {
    const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
    const baseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  
    try {
      const response = await fetch(`${baseUrl}/api/posts?populate=*`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const jsonData = await response.json();
      console.log('API Response:', jsonData);
  
      if (!jsonData.data || !Array.isArray(jsonData.data)) {
        console.error('Unexpected API response structure:', jsonData);
        return [];
      }
  
      return jsonData.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      return [];
    }
  }

const Page = async () => {
  const data: ArticleType[] = await getData();
  console.log("DATA?", data)
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;

  return (
      <div className="container mx-auto py-8">
          <h1 className="text-4xl font-bold mb-8 text-center">Artykuły</h1>
          <div className="space-y-8">
          {data && data.map((article) => (
                <div
                    key={article.id}
                    className="flex flex-col md:flex-row items-center bg-white shadow-md rounded-lg overflow-hidden"
                >
                    <div className="md:w-1/2">
                        {article.media && Array.isArray(article.media) && article.media.length > 0 && article.media[0].formats && article.media[0].formats.medium && (
                            <Image
                                src={`${baseUrl}${article.media[0].formats.medium.url}`}
                                alt={article.media[0].name || 'Article image'}
                                width={article.media[0].formats.medium.width}
                                height={article.media[0].formats.medium.height}
                                className="object-cover w-full h-full"
                                priority
                            />
                        )}
                    </div>
                      <div className="md:w-1/2 p-6">
                          <div className="flex items-center mb-4">
                              <div className="bg-gray-200 text-gray-700 rounded-full px-3 py-1 mr-2">
                                  {transformDate(article.createdAt)}
                              </div>
                          </div>
                          <h2 className="text-2xl font-bold mb-4">{article.title || 'Untitled'}</h2>
                            {article.description && (
                                <p className="text-gray-700 mb-4">{article.description}</p>
                            )}
                            <Link href={`/posts/${article.slug || ''}`} className="text-blue-600 hover:underline">
                                CZYTAJ DALEJ
                            </Link>
                      </div>
                  </div>
              ))}
          </div>
      </div>
  );
};


export default Page;
