import { NextResponse } from 'next/server';

const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://news.marketsheadlines.com';

/**
 * Fetches an RSS feed from WordPress and replaces the backend URL with the frontend URL.
 * Also injects <company:symbol> tags and fixes broken links.
 * 
 * @param path - The path to the feed on the WordPress site (e.g., '/feed', '/category/tech/feed')
 * @param request - The incoming Next.js request
 * @returns NextResponse containing the modified XML
 */
export async function proxyFeed(path: string, request: Request) {
    try {
        // Construct the full WordPress feed URL
        const wpFeedUrl = `${WP_URL}${path}`;

        // Create headers object
        const headers: HeadersInit = {
            'User-Agent': 'MarketHeadlines-NextJS-Proxy',
        };

        // Add Basic Auth if credentials are provided
        const authUser = process.env.WORDPRESS_AUTH_USER;
        const authPass = process.env.WORDPRESS_AUTH_PASS;

        if (authUser && authPass) {
            const token = Buffer.from(`${authUser}:${authPass}`).toString('base64');
            headers['Authorization'] = `Basic ${token}`;
        }

        // Fetch the feed from WordPress
        const response = await fetch(wpFeedUrl, {
            headers,
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

        // --- TRANSFORMATION LOGIC ---

        // 1. Add Namespace Definition if missing
        let modifiedXml = xml;
        if (!modifiedXml.includes('xmlns:company')) {
            modifiedXml = modifiedXml.replace(
                /<rss version="2.0"/,
                '<rss version="2.0" xmlns:company="http://www.marketsheadlines.com/company"'
            );
        }

        // 2. Fix Empty Links logic
        // The backend returns <link></link> in channel and image. We replace these.
        // We look for <link></link> and assume it belongs to channel/image because items usually have valid links.
        // But to be safe, we can do global replace since an empty link is never valid.
        modifiedXml = modifiedXml.replace(/<link><\/link>/g, `<link>${siteUrl}</link>`);

        // 3. Global URL Replacement (Backend -> Frontend)
        const wpHostname = WP_URL.replace(/^https?:\/\//, '');
        const escapedWpHostname = wpHostname.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regexUrl = new RegExp(`https?://${escapedWpHostname}`, 'gi');
        modifiedXml = modifiedXml.replace(regexUrl, siteUrl);

        // 4. Inject <company:symbol> tags
        // We need to parse items to find text like (NASDAQ: AAPL) and inject tags.
        // Using a regex to split items is safer than full DOM parsing for simple injection.

        // Regex to find <item> blocks
        const itemRegex = /<item>[\s\S]*?<\/item>/g;

        modifiedXml = modifiedXml.replace(itemRegex, (itemXml) => {
            // Check if company:symbol already exists (if backend starts supporting it)
            if (itemXml.includes('<company:symbol>')) {
                return itemXml;
            }

            const symbols = new Set<string>();
            // Regex to find stock symbols in content
            // Matches: (NASDAQ: VWAV), (NYSE: LMT), (TSX: AG), etc.
            // \b ensures we match word boundaries for the exchange
            const symbolRegex = /\((NASDAQ|NYSE|TSX|TSXV|CSE|OTC[A-Z]*):\s*([A-Z0-9]+)\)/gi;

            let match;
            // Search in the whole item XML (title + description + content)
            while ((match = symbolRegex.exec(itemXml)) !== null) {
                // match[1] = Exchange (e.g. NASDAQ), match[2] = Symbol (e.g. VWAV)
                const exchange = match[1].toUpperCase();
                const ticker = match[2].toUpperCase();
                symbols.add(`${exchange}:${ticker}`);
            }

            if (symbols.size === 0) {
                return itemXml;
            }

            // Construct new tags
            const tags = Array.from(symbols)
                .map(s => `<company:symbol>${s}</company:symbol>`)
                .join('\n\t\t');

            // Insert after <category> tags
            if (itemXml.includes('</category>')) {
                // Find the last occurrence of </category> to append after it
                const lastCategoryIndex = itemXml.lastIndexOf('</category>');

                // Inspect indentation of the category tag to match it
                const lineStart = itemXml.lastIndexOf('\n', lastCategoryIndex);
                let indentation = '\t\t'; // Default
                if (lineStart !== -1) {
                    const indentationMatch = itemXml.substring(lineStart + 1, lastCategoryIndex).match(/^\s+/);
                    if (indentationMatch) {
                        indentation = indentationMatch[0];
                    }
                }

                // Re-construct tags with correct indentation
                const indentedTags = Array.from(symbols)
                    .map(s => `${indentation}<company:symbol>${s}</company:symbol>`)
                    .join('\n');

                // We use string slicing to insert after the last category
                return itemXml.slice(0, lastCategoryIndex + 11) + `\n${indentedTags}` + itemXml.slice(lastCategoryIndex + 11);
            } else if (itemXml.includes('<guid')) {
                // Fallback to inserting before <guid> if no category tags
                return itemXml.replace('<guid', `${tags}\n\t\t<guid`);
            } else {
                // Fallback: append to end of item
                return itemXml.replace('</item>', `\t${tags}\n</item>`);
            }
        });

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
