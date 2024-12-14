import Image from 'next/image';
import '../../styles/articlePage.scss';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkHtml from 'remark-html';
import { format } from 'date-fns'
import { Button } from '@/components/ui/button';
import { Post } from '../../types/posts'
import { Comments } from 'app/components/Comments';
import { getPosts } from 'app/server/actions/posts';
import { HydrationBoundary } from '@tanstack/react-query';
import Link from 'next/link';
import { getCommentCount } from 'app/server/actions/comments';
import { ScrollLink } from 'app/components/ScrollLink';
import { StrapiImage } from 'app/components/StrapiImage';

async function markdownToHtml(markdown: string) {
  const result = await unified()
    .use(remarkParse)
    .use(remarkHtml)
    .process(markdown);
  return result.toString();
}

function splitIntoSections(markdown: string) {
  const lines = markdown.split('\n');
  const sections: { title: string; content: string }[] = [];
  let currentSection: { title: string; content: string } | null = null;

  lines.forEach((line) => {
    if (line.startsWith('# ')) {
      // Start of a new section (e.g., "# Header")
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = { title: line.slice(2), content: '' };
    } else if (currentSection) {
      // Add content to the current section
      currentSection.content += `${line}\n`;
    }
  });

  if (currentSection) {
    sections.push(currentSection); // Add the last section
  }

  return sections;
}


export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;

  if (!slug) {
    return <div>Slug not provided</div>;
  }

  let post: Post | null;
  try {
    post = await getPosts(slug);
    if (!post) {
      return <div>Post not found</div>;
    }
  } catch (error) {
    console.error('Error fetching post:', error);
    return <div>Error loading post</div>;
  }

  const { section } = post;

  let commentCount = 0;
  try {
    commentCount = await getCommentCount(post.id);
  } catch (error) {
    console.error('Error fetching comment count:', error);
  }

  const formattedDate = post.createdAt
    ? format(new Date(post.createdAt), 'MMMM d, yyyy')
    : 'Date unknown';

  const sections = section ? splitIntoSections(section) : [];

  const processedSections = await Promise.all(
    sections.map(async (section) => ({
      ...section,
      content: await markdownToHtml(section.content),
    }))
  );

  const firstImage = post.media && post.media.length > 0 ? post.media[0] : null;
  const imageUrl = firstImage?.formats?.large?.url ?? firstImage?.url ?? '';
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || '';
  const lastUrl = `${baseUrl}${imageUrl}`

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="relative mb-8">
        {imageUrl && (
          <div className="relative w-full h-[300px] md:h-[400px] lg:h-[600px] overflow-hidden">
            <Image
              src={lastUrl}
              alt={post.title || 'Post image'}
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              className="rounded-lg object-cover"
              quality={90}
              style={{ objectFit: 'cover' }}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
              <h1 className="text-3xl font-bold text-white">{post.title}</h1>
            </div>
          </div>
        )}
        {!imageUrl && <h1 className="text-3xl font-bold mb-4">{post.title}</h1>}
      </div>
      <div className="mb-4 flex items-center justify-between">
        {post.categories && post.categories.length > 0 && (
          <div className="flex flex-wrap items-center">
            {post.categories.map((category) => (
              <span
                key={category.id}
                className="bg-gray-200 text-gray-800 text-sm font-medium mr-2 mb-2 px-4 py-2 rounded-full"
              >
                {category.title}
              </span>
            ))}
          </div>
        )}
        <div className="text-sm text-gray-600">
          <span className="mr-4">{formattedDate}</span>
          <ScrollLink href='#comments' className="hover:underline">
            {commentCount} {commentCount === 1 ? 'comment' : 'comments'}
          </ScrollLink>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-8">
        {processedSections.map((section, index) => (
          <div key={index} className="mb-8">
            <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{
                __html: section.content,
              }}
            />
          </div>
        ))}
      </div>
      <div className="mt-8">
        <div id='comments'>
          <Comments postId={post.id} slug={slug} />
        </div>
      </div>
    </div>
  );
}