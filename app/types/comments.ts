export type NewBlogComment = {
  id?: string;
  name: string;
  email: string;
  body: string;
  post: string;
  parentId?: string;
};

export type BlogComment = NewBlogComment & {
  id: string;
  createdAt: string;
  replies?: BlogComment[];
};