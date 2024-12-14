export type NewBlogComment = {
  id?: string; // Make id optional
  name: string;
  email: string;
  body: string;
  post: string;
  parentId?: string;
  };
  
  // Keep the original BlogComment type if needed
  export type BlogComment = NewBlogComment & {
    id: string;
    createdAt: string;
    replies?: BlogComment[];
  };