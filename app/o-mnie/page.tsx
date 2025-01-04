import { StrapiImage } from "app/components/StrapiImage";
import ClientSideWrapper from '@/components/ClientSideWrapper';

import  { components } from "@strapi-types";
type Author = components["schemas"]["Author"] & {
    big_bio: RichTextBlock[] | string;
};
type AuthorResponse = components["schemas"]["AuthorListResponse"];

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkHtml from 'remark-html';



async function getData(): Promise<Author[]> {
    const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
    const baseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;
    const response = await fetch(`${baseUrl}/api/authors?populate=*`, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        next: { revalidate: 60 } // Cache for 60 seconds
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const jsonData = await response.json();
    return jsonData.data;
}

// Helper for markdown processing
const markdownToHtml = async (markdown: string) => {
  const result = await unified()
    .use(remarkParse)
    .use(remarkHtml)
    .process(markdown);
  return result.toString();
};

interface RichText {
    content: RichTextBlock[] | string, // Allow both structured content array and markdown string
    type: 'structured' | 'markdown'    // Limit type to specific values
}

interface RichTextBlock {
    type: 'paragraph' | 'heading',
    children: RichTextChild[]
}

interface RichTextChild {
    text: string,
    bold?: boolean,
    italic?: boolean
}

const RichText = ({ content, type = 'structured' }: RichText) => {
    if (!content) return null;

    // For markdown content
    if (type === 'markdown') {
        return (
            <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: content }}
            />
        );
    }

    // Check if content is an array before mapping
    if (Array.isArray(content)) {
        return content.map((block, index) => {
            switch (block.type) {
                case 'paragraph':
                    return (
                        <p key={index} className="text-lg leading-relaxed mb-6">
                            {block.children.map((child, i) => (
                                child.bold ? <strong key={i}>{child.text}</strong> :
                                child.italic ? <em key={i}>{child.text}</em> :
                                child.text
                            ))}
                        </p>
                    );
                case 'heading':
                    return (
                        <h2 key={index} className="text-2xl font-bold mb-4 mt-8">
                            {block.children.map(child => child.text).join('')}
                        </h2>
                    );
                default:
                    return null;
            }
        });
    }

    return null; // Return null if content is not structured as expected
};

export default async function AboutMe() {
    const data: Author[] = await getData();
    const largeImageUrl = data[0]?.bio_avatar?.url ?? '';

    return (
        <ClientSideWrapper>
            <div className="max-w-6xl mx-auto px-4 py-16">
                <h1 className="text-blue-500 text-4xl font-bold text-center mb-16">O MNIE</h1>

                {data.map((author) => (
                    <div key={author.id} className="flex flex-col items-center">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 items-start mb-16">
                            <div className="space-y-6">
                                <h2 className="text-3xl font-bold">{author.short_bio}</h2>
                                <div className="prose prose-lg">
                                    <RichText content={author.big_bio} type="structured" />
                                </div>
                            </div>

                            <div className="flex justify-center md:h-[calc(100vh-12rem)] overflow-y-auto">
                                <div className="relative w-3/4">
                                    <StrapiImage
                                        alt={"Profile picture"}
                                        className="rounded-lg object-contain"
                                        src={largeImageUrl}
                                        width={400}
                                        height={600}
                                        priority
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </ClientSideWrapper>
    );
}