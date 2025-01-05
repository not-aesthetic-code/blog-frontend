import Image from 'next/image';
import '../../styles/articlePage.scss';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkHtml from 'remark-html';
import { format } from 'date-fns'
import { Post } from '../../types/posts'
import { Comments } from 'app/components/Comments';
import { getPosts } from 'app/server/actions/posts';

import { getCommentCount } from 'app/server/actions/comments';
import { ScrollLink } from 'app/components/ScrollLink';

async function markdownToHtml(markdown: string) {
  const result = await unified()
    .use(remarkParse)
    .use(remarkHtml)
    .process(markdown);
  return result.toString();
}

interface Section {
  title: string;
  content: string;
}

function splitIntoSections(markdown: string): Section[] {
  const lines = markdown.split('\n');
  const sections: Section[] = [];
  let currentSection: Section = { title: '', content: '' }; // Initialize as an empty section
  let inList = false;
  let listContent = '';

  lines.forEach((line: string) => {
    if (line.startsWith('# ')) {
      if (currentSection.title) {
        // Close any open list before pushing the current section
        if (inList) {
          currentSection.content += `<ol class="list-decimal pl-6 space-y-2">${listContent}</ol>\n`;
          inList = false;
          listContent = '';
        }
        sections.push(currentSection);
      }
      currentSection = { title: line.slice(2).trim(), content: '' };
    } else if (currentSection) {
      const listItemMatch = line.match(/^(\d+)\.\s*(.*)/);
      if (listItemMatch) {
        if (!inList) {
          inList = true;
          listContent = '';
        }
        const content = listItemMatch[2].trim();
        listContent += `<li class="mb-2">${content}</li>\n`;
      } else {
        // If we encounter an empty line and are in a list, close it
        if (inList && line.trim() === '') {
          currentSection.content += `<ol class="list-decimal pl-6 space-y-2">${listContent}</ol>\n`;
          inList = false;
          listContent = '';
        }
        currentSection.content += line + '\n';
      }
    }
  });

  // Push the last section if it exists
  if (currentSection.title) {
    if (inList) {
      currentSection.content += `<ol class="list-decimal pl-6 space-y-2">${listContent}</ol>\n`;
    }
    sections.push(currentSection);
  }

  return sections;
}

interface Props {
  params: Promise<{ slug: string }>;
}


export default async function Page({ params }: Props) {
  const { slug } = await params;

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
    sections.map(async (section: Section) => ({
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