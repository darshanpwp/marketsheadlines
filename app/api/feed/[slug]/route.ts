import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;

    console.log(`[Proxy] Fetching for slug: ${slug}`);
    const FEED_URL = `https://news.marketsheadlines.com/category/${slug}/feed/`;

    try {
        const response = await fetch(FEED_URL, {
            headers: {
                'User-Agent': 'Node.js Test Script',
            },
            cache: 'no-store'
        });

        console.log(`[Proxy] Upstream status: ${response.status}`);

        if (!response.ok) {
            if (response.status === 404) {
                return new NextResponse('Feed not found', { status: 404 });
            }
            return new NextResponse('Feed unavailable', { status: response.status });
        }

        let xml = await response.text();

        // Replace the backend URL with the frontend URL to ensure correct self-references
        // This handles both http and https variants
        xml = xml.replace(/https?:\/\/news\.marketsheadlines\.com/g, 'https://www.marketsheadlines.com');

        return new NextResponse(xml, {
            status: 200,
            headers: {
                'Content-Type': 'application/rss+xml; charset=utf-8',
                'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60'
            },
        });
    } catch (error) {
        console.error(`Error fetching feed for ${slug}:`, error);
        return new NextResponse('Feed unavailable', { status: 500 });
    }
}
