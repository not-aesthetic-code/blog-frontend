interface ImageFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  path: string | null;
  width: number;
  height: number;
  size: number;
  url: string;
 }
 
 interface ImageData1 {
  attributes: {
   name: string;
   alternativeText: string | null;
   caption: string | null;
   width: number;
   height: number;
   formats: {
    thumbnail: ImageFormat;
    medium: ImageFormat;
    small: ImageFormat;
    large: ImageFormat;
   };
   hash: string;
   ext: string;
   mime: string;
   size: number;
   url: string;
   previewUrl: string | null;
   provider: string;
   provider_metadata: any | null;
   createdAt: string;
   updatedAt: string;
  };
 }
 
 interface ImageData {
   name: string;
   alternativeText: string | null;
   caption: string | null;
   width: number;
   height: number;
   formats: {
    thumbnail: ImageFormat;
    medium: ImageFormat;
    small: ImageFormat;
    large: ImageFormat;
   };
   hash: string;
   ext: string;
   mime: string;
   size: number;
   url: string;
   previewUrl: string | null;
   provider: string;
   provider_metadata: any | null;
   createdAt: string;
   updatedAt: string;

 }
 

//  export interface ArticleType {
//   id: number;
//   attributes: {
//    title: string;
//    slug: string;
//    section: string;
//    creationDate: string;
//    description: string | null;
//    createdAt: string;
//    updatedAt: string;
//    publishedAt: string;
//    media: {
//     data: ImageData[];
//    };
//   };
//  }

 export interface ArticleType {
    id: number;
    title: string;
    description?: string;
    slug: string;
    createdAt: string;
    media: ImageData[];
 }