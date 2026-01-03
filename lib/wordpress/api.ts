import type { WordPressPage, WordPressMedia, WordPressUser, Page, PageWithDetails } from '@/types/wordpress';

const WP_API_URL = process.env.NEXT_PUBLIC_WP_API_URL || 'https://dev-new-marketsheadlines.pantheonsite.io/wp-json/wp/v2';
const WP_USERNAME = process.env.WP_USERNAME;
const WP_PASSWORD = process.env.WP_PASSWORD;

// Create base64 encoded auth header
function getAuthHeader(): string | null {
  if (!WP_USERNAME || !WP_PASSWORD) {
    console.warn('WordPress credentials not configured. API requests may fail if authentication is required.');
    return null;
  }
  return `Basic ${Buffer.from(`${WP_USERNAME}:${WP_PASSWORD}`).toString('base64')}`;
}

// Fetch with authentication
async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const authHeader = getAuthHeader();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  // Only add authorization if credentials are available
  if (authHeader) {
    headers['Authorization'] = authHeader;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorMessage = `WordPress API error: ${response.status} ${response.statusText}`;
    
    // Provide helpful error message for authentication issues
    if (response.status === 401 || response.status === 403) {
      console.error(`${errorMessage}. Please check your WordPress credentials in environment variables.`);
    }
    
    throw new Error(errorMessage);
  }

  return response;
}

// Transform WordPress page to simplified format
function transformPage(wpPage: WordPressPage): Page {
  return {
    id: wpPage.id,
    slug: wpPage.slug,
    title: wpPage.title.rendered,
    content: wpPage.content.rendered,
    excerpt: wpPage.excerpt.rendered,
    date: wpPage.date,
    modified: wpPage.modified,
    author: wpPage.author,
    featuredMedia: wpPage.featured_media,
    link: wpPage.link,
  };
}

/**
 * Fetch all pages from WordPress
 * @param perPage Number of pages per request (default: 10)
 * @param page Page number (default: 1)
 */
export async function getPages(perPage: number = 10, page: number = 1): Promise<Page[]> {
  const url = `${WP_API_URL}/pages?per_page=${perPage}&page=${page}&status=publish&_embed`;
  
  try {
    const response = await fetchWithAuth(url, {
      next: { revalidate: 60 }, // ISR: Revalidate every 60 seconds
    });

    const pages: WordPressPage[] = await response.json();
    return pages.map(transformPage);
  } catch (error) {
    console.error('Error fetching pages:', error);
    // Fail-safe: return an empty list so build/prerendering continues when the WP API is unreachable or unauthorized
    return [];
  }
}

/**
 * Fetch all pages with embedded author and media details
 */
export async function getPagesWithDetails(): Promise<PageWithDetails[]> {
  const url = `${WP_API_URL}/pages?status=publish&_embed`;
  
  try {
    const response = await fetchWithAuth(url, {
      next: { revalidate: 60 },
    });

    const pages: WordPressPage[] = await response.json();
    
    return pages.map((wpPage) => {
      const page = transformPage(wpPage);
      const embedded = wpPage._embedded;

      return {
        ...page,
        authorDetails: embedded?.author?.[0] as WordPressUser | undefined,
        featuredMediaDetails: embedded?.['wp:featuredmedia']?.[0] as WordPressMedia | undefined,
      } as PageWithDetails;
    });
  } catch (error) {
    console.error('Error fetching pages with details:', error);
    // Fail-safe: return an empty list so build/prerendering continues when the WP API is unreachable or unauthorized
    return [];
  }
}

/**
 * Fetch a single page by slug
 */
export async function getPageBySlug(slug: string): Promise<PageWithDetails | null> {
  const url = `${WP_API_URL}/pages?slug=${slug}&status=publish&_embed`;
  
  try {
    const response = await fetchWithAuth(url, {
      next: { revalidate: 60 },
    });

    const pages: WordPressPage[] = await response.json();
    
    if (pages.length === 0) {
      return null;
    }

    const wpPage = pages[0];
    const page = transformPage(wpPage);
    const embedded = wpPage._embedded;

    return {
      ...page,
      authorDetails: embedded?.author?.[0] as WordPressUser | undefined,
      featuredMediaDetails: embedded?.['wp:featuredmedia']?.[0] as WordPressMedia | undefined,
    } as PageWithDetails;
  } catch (error) {
    console.error(`Error fetching page with slug "${slug}":`, error);
    return null;
  }
}

/**
 * Fetch all page slugs for static generation
 */
export async function getAllPageSlugs(): Promise<string[]> {
  const url = `${WP_API_URL}/pages?status=publish&per_page=100`;
  
  try {
    const response = await fetchWithAuth(url, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    const pages: WordPressPage[] = await response.json();
    return pages.map((page) => page.slug);
  } catch (error) {
    console.error('Error fetching page slugs:', error);
    return [];
  }
}

/**
 * Fetch featured media by ID
 */
export async function getMediaById(id: number): Promise<WordPressMedia | null> {
  if (!id) return null;

  const url = `${WP_API_URL}/media/${id}`;
  
  try {
    const response = await fetchWithAuth(url, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    return await response.json();
  } catch (error) {
    console.error(`Error fetching media with ID ${id}:`, error);
    return null;
  }
}

/**
 * Fetch user/author by ID
 */
export async function getUserById(id: number): Promise<WordPressUser | null> {
  if (!id) return null;

  const url = `${WP_API_URL}/users/${id}`;
  
  try {
    const response = await fetchWithAuth(url, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    return await response.json();
  } catch (error) {
    console.error(`Error fetching user with ID ${id}:`, error);
    return null;
  }
}