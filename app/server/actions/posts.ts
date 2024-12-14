"use server"

import { Post } from '../../types/posts'

export async function getPosts(slug: string): Promise<Post | null> {
    try {
      const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/posts?filters[slug][$eq]=${slug}&populate=*`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
  
      const jsonData = await response.json();

      return jsonData.data[0] || null;
    } catch (error) {
      console.error('Error fetching post:', error);
      return null;
    }
  }
  