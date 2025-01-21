/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],  // Add this for simpler local development
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'blog-backend-production-a0ab.up.railway.app',
        pathname: '/uploads/**',
      }
    ],
  },
  env: {
    NEXT_PUBLIC_STRAPI_API_URL: process.env.NEXT_PUBLIC_STRAPI_API_URL,
    NEXT_PUBLIC_STRAPI_API_TOKEN: process.env.NEXT_PUBLIC_STRAPI_API_TOKEN,
  }
};

module.exports = nextConfig;
