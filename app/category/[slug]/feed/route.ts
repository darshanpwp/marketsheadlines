import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Nuclear option to prevent caching

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    // Await params for Next.js 16 compatibility
    const { slug } = await params;

    console.log(`[Proxy] Fetching for slug: ${slug}`);
    // Construct the upstream WordPress feed URL
    // We use the production URL directly as this is a specific proxy for that purpose
    // In a more complex setup, this could use an environment variable
    const FEED_URL = `https://news.marketsheadlines.com/category/${slug}/feed/`;

    try {
        const response = await fetch(FEED_URL, {
            headers: {
                'User-Agent': 'Node.js Test Script', // Match the working script
            },
            cache: 'no-store' // Always fetch fresh
        });

        console.log(`[Proxy] Upstream status: ${response.status}`);
        if (!response.ok) {
            if (response.status === 404) {
                return new NextResponse('Feed not found', { status: 404 });
            }
            return new NextResponse('Feed unavailable', { status: response.status });
        }

        const xml = await response.text();

        return new NextResponse(xml, {
            status: 200,
            headers: {
                'Content-Type': 'application/rss+xml; charset=utf-8',
                // Optional: Add cache control header for the client/CDN
                'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60'
            },
        });
    } catch (error) {
        console.error(`Error fetching feed for ${slug}:`, error);
        return new NextResponse('Feed unavailable', { status: 500 });
    }
}
