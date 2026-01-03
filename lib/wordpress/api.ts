import type { WordPressPage, WordPressMedia, WordPressUser, Page, PageWithDetails } from '@/types/wordpress';

const WP_API_URL = process.env.NEXT_PUBLIC_WP_API_URL || 'https://dev-new-marketsheadlines.pantheonsite.io/wp-json/wp/v2';
const WP_USERNAME = process.env.WP_USERNAME;
const WP_PASSWORD = process.env.WP_PASSWORD;

// Create base64 encoded auth header
function getAuthHeader(): string {
  if (!WP_USERNAME || !WP_PASSWORD) {
    throw new Error('WordPress credentials not configured');
  }
  return `Basic ${Buffer.from(`${WP_USERNAME}:${WP_PASSWORD}`).toString('base64')}`;
}

// Fetch with authentication
async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: getAuthHeader(),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`WordPress API error: ${response.status} ${response.statusText}`);
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
    throw error;
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
    throw error;
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