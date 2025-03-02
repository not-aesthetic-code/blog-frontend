export function getStrapiURL() {
  return process.env.NEXT_PUBLIC_STRAPI_API_URL ?? "http://localhost:1337";
}

export function getStrapiMedia(url: string): string {
  if (!url) return '';
  
  // If the URL is already absolute, return it
  if (url.startsWith('http')) return url;
  
  const path = url.startsWith('/') ? url.slice(1) : url;
  return `${path}`;
}