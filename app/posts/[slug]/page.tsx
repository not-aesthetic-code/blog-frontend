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

interface Section {
  title: string;
  content: string;
}

function splitIntoSections(markdown: string): Section[] {
  if (!markdown) return [];
  
  const lines = markdown.split('\n');
  const sections: Section[] = [];
  let currentSection: Section | null = null;
  let inList = false;
  let listContent = '';
  let listType = '';

  // Create initial section if content appears before any header
  currentSection = {
    title: '',
    content: ''
  };

  lines.forEach((line: string) => {
    // Handle main headers (## only)
    if (line.startsWith('## ')) {
      if (currentSection) sections.push({ ...currentSection });
      currentSection = {
        title: line.slice(3).trim(),
        content: ''
      };
    }
    // All other content goes into current section
    else if (currentSection) {
      // Handle other header levels
      if (line.startsWith('# ')) {
        currentSection.content += `<h1 class="text-4xl font-bold my-8">${line.slice(2).trim()}</h1>\n`;
      }
      else if (line.startsWith('### ')) {
        currentSection.content += `<h3 class="text-2xl font-semibold my-6">${line.slice(4).trim()}</h3>\n`;
      }
      else if (line.startsWith('#### ')) {
        currentSection.content += `<h4 class="text-xl font-semibold my-5">${line.slice(5).trim()}</h4>\n`;
      }
      // Handle images
      else if (line.match(/!\[.*?\]\(.*?\)/)) {
        const [, alt, src] = line.match(/!\[(.*?)\]\((.*?)\)/) || [];
        // Keep the markdown format for now, let markdownToHtml handle it
        currentSection.content += line + '\n';
      }
      // Handle numbered lists
      else if (line.match(/^\d+[\.)]\s/)) {
        if (!inList || listType !== 'ordered') {
          if (inList) currentSection.content += listType === 'unordered' ? '</ul>\n' : '</ol>\n';
          inList = true;
          listType = 'ordered';
          currentSection.content += '<ol class="list-decimal pl-6 space-y-2 my-4">\n';
        }
        const content = line.replace(/^\d+[\.)]\s/, '').trim();
        currentSection.content += `<li class="mb-2">${content}</li>\n`;
      }
      // Handle bullet lists
      else if (line.startsWith('- ')) {
        if (!inList || listType !== 'unordered') {
          if (inList) currentSection.content += listType === 'ordered' ? '</ol>\n' : '</ul>\n';
          inList = true;
          listType = 'unordered';
          currentSection.content += '<ul class="list-disc pl-6 space-y-2 my-4">\n';
        }
        const content = line.slice(2).trim();
        currentSection.content += `<li class="mb-2 ">${content}</li>\n`;
      }
      // Handle empty lines
      else if (line.trim() === '') {
        if (inList) {
          currentSection.content += listType === 'ordered' ? '</ol>\n' : '</ul>\n';
          inList = false;
        }
        currentSection.content += '\n';
      }
      // Handle regular paragraphs
      else if (line.trim() !== '') {
        currentSection.content += `<p class="mb-4">${line}</p>\n`;
      }
    }
  });

  // Add the last section
  if (currentSection && (currentSection.title || currentSection.content)) {
    if (inList) {
      currentSection.content += listType === 'ordered' ? '</ol>\n' : '</ul>\n';
    }
    sections.push(currentSection);
  }

  return sections;
}

async function markdownToHtml(markdown: string) {
  if (!markdown) return '';

  // Pre-process image markdown before unified processing
  let processedMarkdown = markdown.replace(
    /!\[(.*?)\]\((.*?)\)/g,
    (match, alt, src) => {
      try {
        // Clean up the URL - remove any line breaks and extra spaces
        const cleanSrc = src.trim().replace(/\n/g, '');
        const decodedSrc = decodeURIComponent(cleanSrc);
        
        // Handle URLs that might be split across lines or have spaces
        const fullUrl = decodedSrc.startsWith('http') 
          ? decodedSrc 
          : `${decodedSrc.replace(/\s+/g, '')}`;

        return `<img src="${fullUrl}" alt="${alt}" class="my-12 rounded-lg w-full" />`;
      } catch (error) {
        console.error('Error processing image URL:', error);
        return match;
      }
    }
  );

  // Return if already contains HTML
  if (processedMarkdown.includes('<h2 class="') || 
      processedMarkdown.includes('<p class="') || 
      processedMarkdown.includes('<ul class="') || 
      processedMarkdown.includes('<ol class="')) {
    return processedMarkdown;
  }

  const result = await unified()
    .use(remarkParse)
    .use(remarkHtml, { sanitize: false })
    .process(processedMarkdown);

  return result.toString();
}

type Props = {
  params: Promise<{ slug: string }>
};

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
  const lastUrl = `${imageUrl}`


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
                className="bg-gray-200  text-sm font-medium mr-2 mb-2 px-4 py-2 rounded-full"
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

      <article className="bg-white p-8">
      {processedSections.map((section, index) => (
        <div key={index} className="mb-16 last:mb-0">
          <h2 className="text-3xl font-bold mb-8 ">{section.title}</h2>
          <div
            className="prose prose-lg max-w-none 
              prose-headings: 
              prose-p: 
              prose-li:
              prose-strong:
              prose-img:my-12
              prose-img:rounded-lg"
            dangerouslySetInnerHTML={{
              __html: section.content,
            }}
          />
        </div>
      ))}
    </article>

      <div className="mt-8">
        <div id='comments'>
          <Comments postId={post.id} slug={slug} />
        </div>
      </div>
    </div>
  );
}