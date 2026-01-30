import { NextResponse } from 'next/server';

const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://news.marketsheadlines.com';

/**
 * Fetches an RSS feed from WordPress and replaces the backend URL with the frontend URL.
 * 
 * @param path - The path to the feed on the WordPress site (e.g., '/feed', '/category/tech/feed')
 * @param request - The incoming Next.js request
 * @returns NextResponse containing the modified XML
 */
export async function proxyFeed(path: string, request: Request) {
    try {
        // Construct the full WordPress feed URL
        const wpFeedUrl = `${WP_URL}${path}`;

        // Fetch the feed from WordPress
        const response = await fetch(wpFeedUrl, {
            headers: {
                'User-Agent': 'MarketHeadlines-NextJS-Proxy',
            },
            next: { revalidate: 300 } // Cache for 5 minutes
        });

        if (!response.ok) {
            console.error(`Failed to fetch feed from ${wpFeedUrl}: ${response.status}`);
            return new NextResponse('Error fetching feed', { status: response.status });
        }

        const xml = await response.text();

        // Determine the current site URL (frontend)
        // We prefer the standard header or default to the request URL's origin
        const url = new URL(request.url);
        const siteUrl = `${url.protocol}//${url.host}`;

        // Replace all instances of the WP URL with the Site URL
        // Handle both http and https, and be case-insensitive
        const wpHostname = WP_URL.replace(/^https?:\/\//, '');
        const escapedWpHostname = wpHostname.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        // Match https://hostname or http://hostname
        const regex = new RegExp(`https?://${escapedWpHostname}`, 'gi');

        const modifiedXml = xml.replace(regex, siteUrl);

        // Return the modified XML with correct content type
        return new NextResponse(modifiedXml, {
            headers: {
                'Content-Type': 'application/rss+xml; charset=utf-8',
                'Cache-Control': 's-maxage=300, stale-while-revalidate',
            },
        });

    } catch (error) {
        console.error('Feed proxy error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
