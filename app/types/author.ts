export interface Author { 
    id: string;
    bio: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    slug: string;
    documentId: string;
    locale: string | null;
    avatar: {
        id: number;
        name: string;
        alternativeText: string | null;
        caption: string | null;
        width: number;
        height: number;
        formats: {
            thumbnail: object;
            small: object;
        };
        hash: string;
        ext: string;
        mime: string;
        size: number;
        url: string;
        previewUrl: string | null;
        provider: string;
        provider_metadata: null;
        createdAt: string;
        updatedAt: string;
        documentId: string;
        locale: string | null;
        publishedAt: string | null;
    };
    localizations: any[];
}