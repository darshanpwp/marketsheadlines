import { NextRequest } from 'next/server';
import { proxyFeed } from '../utils';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string[] }> }
) {
    const { slug } = await params;

    // Reconstruct the path from the slug array
    // e.g. ['category', 'bbc-world', 'feed'] -> '/category/bbc-world/feed/'
    const path = '/' + slug.join('/') + '/';

    return proxyFeed(path, request);
}
