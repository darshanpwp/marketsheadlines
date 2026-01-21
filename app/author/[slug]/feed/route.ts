import { proxyFeed } from '@/app/api/feed/utils';
import { NextRequest } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;
    return proxyFeed(`/author/${slug}/feed`, request);
}
