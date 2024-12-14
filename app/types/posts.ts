export interface Post {
    id: string;
    title: string;
    section: string;
    createdAt: string;
    slug: string
    media: {
      id: number;
      name: string;
      formats: {
        large?: {
          url: string;
        };
        // ... other format sizes ...
      };
      url: string;
      // ... other media properties ...
    }[];
    comments: {
      data: Array<{
        id: string;
          name: string;
          email: string;
          body: string;
          replies: Array<{
            name: string;
            email: string;
            body: string;
          }>;
      }>;
    }
    categories: Array<{
      id: number;
      documentId: string;
      title: string;
      createdAt: string;
      updatedAt: string;
      publishedAt: string;
      locale: string | null;
    }>;
  // ... other properties ...
}