import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Rewrite /category/[slug]/feed to /api/feed/[slug]
    // Regex to match /category/SOMETHING/feed or /category/SOMETHING/feed/
    const feedMatch = pathname.match(/^\/category\/([^\/]+)\/feed\/?$/);

    if (feedMatch) {
        const slug = feedMatch[1];
        const url = request.nextUrl.clone();
        url.pathname = `/api/feed/${slug}`;
        console.log(`[Middleware] Redirecting ${pathname} to ${url.pathname}`);
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
