/** @type {import('next').NextConfig} */
const nextConfig = {
 images: {
    remotePatterns: [
        {
          // Local development
          protocol: 'http',
          hostname: 'localhost',
          port: '1337',
          pathname: '/uploads/**',
        },
        {
          // Production (Railway)
          protocol: 'https',
          hostname: 'blog-backend-production-a0ab.up.railway.app',
          port: new URL(process.env.NEXT_PUBLIC_STRAPI_API_URL).port || '',
          pathname: '/uploads/**',
        }
      ],
 },
 env: {
  NEXT_PUBLIC_STRAPI_API_URL: process.env.NEXT_PUBLIC_STRAPI_API_URL,
  NEXT_PUBLIC_STRAPI_API_TOKEN: process.env.NEXT_PUBLIC_STRAPI_API_TOKEN,
 },
 reactStrictMode: true,
};

module.exports = nextConfig;
