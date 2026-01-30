import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'news.marketsheadlines.com',
        pathname: '/wp-content/**',
      },
      {
        protocol: 'https',
        hostname: 'secure.gravatar.com',
      },
      {
        protocol: 'https',
        hostname: '*.gravatar.com',
      },
    ],
  },
  async rewrites() {
    const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://news.marketsheadlines.com';
    return [
      {
        source: '/feed',
        destination: '/api/feed/feed',
      },
      {
        source: '/rss',
        destination: '/api/feed/feed',
      },
      {
        source: '/category/:path*/feed',
        destination: '/api/feed/category/:path*/feed',
      },
      {
        source: '/tag/:path*/feed',
        destination: '/api/feed/tag/:path*/feed',
      },
      {
        source: '/author/:path*/feed',
        destination: '/api/feed/author/:path*/feed',
      },
    ];
  },
};

export default nextConfig;