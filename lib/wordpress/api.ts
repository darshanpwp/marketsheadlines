import type {
  WordPressPage,
  WordPressPost,
  WordPressCPT,
  WordPressMedia,
  WordPressUser,
  Page,
  PageWithDetails,
  Post,
  PostWithDetails,
  CPT,
  CPTWithDetails,
  WordPressMenu,
  PaginatedResponse,
  MarketHeadlinesSettings,
  HomePageData,
  MarketTicker,
  WordPressRestSettings,
  GlobalThemeSettings,
  WordPressCategory,
  WordPressMenuItem
} from '@/types/wordpress';

export const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://news.marketsheadlines.com';
const WP_API_URL = process.env.NEXT_PUBLIC_WP_API_URL || `${WORDPRESS_URL}/wp-json/wp/v2`;
const MARKET_HEADLINES_API_URL = `${WORDPRESS_URL}/wp-json/marketheadlines/v1`;
const WP_USERNAME = process.env.WP_USERNAME;
const WP_PASSWORD = process.env.WP_PASSWORD;

/**
 * Custom error class for WordPress API errors.
 */
export class WordPressError extends Error {
  constructor(public message: string, public status: number) {
    super(message);
    this.name = 'WordPressError';
  }
}

// Create base64 encoded auth header
function getAuthHeader(): string | null {
  if (!WP_USERNAME || !WP_PASSWORD) {
    console.warn('WordPress credentials not configured. API requests may fail if authentication is required.');
    return null;
  }
  return `Basic ${Buffer.from(`${WP_USERNAME}:${WP_PASSWORD}`).toString('base64')} `;
}

export function normalizeWpUrl(urlInput: string | undefined | null): string {
  if (!urlInput) return '';
  const match = urlInput.match(/href="([^"]*)"/);
  const url = match ? match[1] : urlInput;
  return url.replace(/(https?:)?\/\/.*\.pantheonsite\.io/g, 'https://news.marketsheadlines.com');
}

function normalizeMedia(media: WordPressMedia | undefined): WordPressMedia | undefined {
  if (!media) return undefined;

  // Deep clone to avoid mutating original if needed, but here we just spread
  const normalizedMedia = {
    ...media,
    source_url: normalizeWpUrl(media.source_url),
    guid: { ...media.guid, rendered: normalizeWpUrl(media.guid?.rendered) }
  } as WordPressMedia;

  // Normalize sizes if they exist
  if (normalizedMedia.media_details?.sizes) {
    const sizes = normalizedMedia.media_details.sizes;
    Object.keys(sizes).forEach(key => {
      if (sizes[key] && sizes[key].source_url) {
        sizes[key].source_url = normalizeWpUrl(sizes[key].source_url);
      }
    });
  }

  return normalizedMedia;
}


// Fetch with authentication
async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const authHeader = getAuthHeader();

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  // Only add Content-Type for methods that typically require a body
  const method = options.method?.toUpperCase() || 'GET';
  if (method !== 'GET' && method !== 'HEAD') {
    headers['Content-Type'] = 'application/json';
  }

  // Only add authorization if credentials are available
  if (authHeader) {
    headers['Authorization'] = authHeader;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorMessage = `WordPress API error: ${response.status} ${response.statusText} `;

    // Provide helpful error message for authentication issues


    throw new WordPressError(errorMessage, response.status);
  }

  return response;
}

// Transform WordPress page to simplified format
function transformPage(wpPage: WordPressPage): Page {
  return {
    id: wpPage.id,
    slug: wpPage.slug,
    title: wpPage.title.rendered,
    content: normalizeWpUrl(wpPage.content.rendered),
    excerpt: normalizeWpUrl(wpPage.excerpt.rendered),
    date: wpPage.date,
    modified: wpPage.modified,
    author: wpPage.author,
    featuredMedia: wpPage.featured_media,
    link: normalizeWpUrl(wpPage.link),
    seo: wpPage.yoast_head_json ? {
      title: wpPage.yoast_head_json.title,
      description: wpPage.yoast_head_json.description,
      og_title: wpPage.yoast_head_json.og_title,
      og_description: wpPage.yoast_head_json.og_description,
      og_image: wpPage.yoast_head_json.og_image,
      twitter_image: wpPage.yoast_head_json.twitter_image,
      schema: wpPage.yoast_head_json.schema,
    } : undefined,
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
    // Use direct fetch to avoid 415 errors
    const response = await fetch(url, {
      next: { revalidate: 60 }, // ISR: Revalidate every 60 seconds
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) return [];

    const pages: WordPressPage[] = await response.json();
    if (!Array.isArray(pages)) return [];
    return pages.map(transformPage);
  } catch (error) {
    console.error('Error fetching pages:', error);
    // Fail-safe: return an empty list so build/prerendering continues when the WP API is unreachable or unauthorized
    return [];
  }
}

/**
 * Fetch all pages with embedded author and media details with pagination
 */
export async function getPagesWithDetails(perPage: number = 10, page: number = 1): Promise<PaginatedResponse<PageWithDetails>> {
  const url = `${WP_API_URL}/pages?status=publish&_embed&per_page=${perPage}&page=${page}`;

  try {
    // Use direct fetch to avoid 415 errors
    const response = await fetch(url, {
      next: { revalidate: 60 },
      headers: { 'Accept': 'application/json' }
    });

    const totalItems = parseInt(response.headers.get('X-WP-Total') || '0', 10);
    const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '0', 10);

    if (!response.ok) return { items: [], totalItems: 0, totalPages: 0 };

    const pages: WordPressPage[] = await response.json();

    const items = pages.map((wpPage) => {
      const page = transformPage(wpPage);
      const embedded = wpPage._embedded;

      return {
        ...page,
        authorDetails: embedded?.author?.[0] as WordPressUser | undefined,
        featuredMediaDetails: normalizeMedia(embedded?.['wp:featuredmedia']?.[0]),
      } as PageWithDetails;
    });

    return { items, totalItems, totalPages };
  } catch (error) {
    console.error('Error fetching pages with details:', error);
    return { items: [], totalItems: 0, totalPages: 0 };
  }
}

/**
 * Fetch a single page by slug
 */
export async function getPageBySlug(slug: string): Promise<PageWithDetails | null> {
  const url = `${WP_API_URL}/pages?slug=${slug}&status=publish&_embed`;

  try {
    // Use direct fetch to avoid 415 errors
    const response = await fetch(url, {
      next: { revalidate: 60 },
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) return null;

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
      featuredMediaDetails: embedded?.['wp:featuredmedia']?.[0],
    } as PageWithDetails;
  } catch (error) {
    if (error instanceof WordPressError && error.status === 404) {
      return null;
    }
    console.error(`Error fetching page with slug "${slug}":`, error);
    return null;
  }
}

/**
 * Fetch a single page by ID
 */
export async function getPage(id: number): Promise<Page | null> {
  const url = `${WP_API_URL}/pages/${id}`;

  try {
    // Use direct fetch to avoid 415 errors
    const response = await fetch(url, {
      next: { revalidate: 3600 },
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) return null;

    const wpPage: WordPressPage = await response.json();
    return transformPage(wpPage);
  } catch (error) {
    console.error(`Error fetching page with ID ${id}:`, error);
    return null;
  }
}

// ... existing imports ...
// ... existing imports ...


// ... getAllCategories ...

/**
 * Fetch global theme settings (Pods)
 */
export async function getGlobalThemeSettings(): Promise<GlobalThemeSettings | null> {
  const url = `${WP_API_URL.replace('/wp/v2', '/custom/v1')}/global-pods-theme-settings/`;

  try {
    // Using direct fetch to avoid potential 415 issues with unnecessary headers/auth
    // This endpoint should be public.
    // Use timeout to fail fast (3s)
    const response = await fetchWithTimeout(url, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      console.warn('Failed to fetch global theme settings:', response.status);
      return null;
    }

    const data = await response.json();

    // Normalize URLs in the response
    if (data) {
      if (data.blog_default_image) {
        if (typeof data.blog_default_image === 'string') {
          data.blog_default_image = normalizeWpUrl(data.blog_default_image);
        } else if (data.blog_default_image.guid) {
          data.blog_default_image.guid = normalizeWpUrl(data.blog_default_image.guid);
        }
      }
      if (data.footer_logo) {
        if (typeof data.footer_logo === 'string') {
          data.footer_logo = normalizeWpUrl(data.footer_logo);
        } else if (data.footer_logo.guid) {
          data.footer_logo.guid = normalizeWpUrl(data.footer_logo.guid);
        }
      }
    }


    return data;
  } catch (error) {
    console.warn('Error fetching global theme settings:', error instanceof Error ? error.message : error);
    return null;
  }
}

/**
 * Fetch all categories
 */
export async function getAllCategories(): Promise<WordPressCategory[]> {
  const url = `${WP_API_URL}/categories?per_page=100&hide_empty=true`;
  try {
    // Use direct fetch to avoid 415 errors
    const response = await fetch(url, {
      next: { revalidate: 60 },
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) {
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

/**
 * Fetch site icon from root API
 */
export async function getSiteIcon(): Promise<string> {
  const url = WORDPRESS_URL + '/wp-json/';

  try {
    const response = await fetch(url, { next: { revalidate: 60 } });
    if (!response.ok) return '';
    const data = await response.json();
    return data.site_icon_url || '';
  } catch (error) {
    console.error('Error fetching site icon:', error);
    return '';
  }
}
/**
 * Fetch all page slugs for static generation
 */
export async function getAllPageSlugs(): Promise<string[]> {
  const url = `${WP_API_URL}/pages?status=publish&per_page=100`;

  try {
    // Use direct fetch to avoid 415 errors
    const response = await fetch(url, {
      next: { revalidate: 60 }, // Cache for 1 hour
      headers: { 'Accept': 'application/json' }
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
      next: { revalidate: 60 }, // Cache for 1 hour
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
      next: { revalidate: 60 }, // Cache for 1 hour
    });

    return await response.json();
  } catch (error) {
    console.error(`Error fetching user with ID ${id}:`, error);
    return null;
  }
}

// Transform WordPress post to simplified format
/**
 * Fetch user/author by slug
 */
export async function getAuthorBySlug(slug: string): Promise<WordPressUser | null> {
  const url = `${WP_API_URL}/users?slug=${slug}`;

  try {
    // Use direct fetch to avoid 415 errors
    const response = await fetch(url, {
      next: { revalidate: 60 },
      headers: {
        'Accept': 'application/json'
      }
    });

    const users: WordPressUser[] = await response.json();

    if (users.length === 0) {
      return null;
    }

    return users[0];
  } catch (error) {
    console.error(`Error fetching user with slug "${slug}":`, error);
    return null;
  }
}

function transformPost(wpPost: WordPressPost): Post {
  return {
    id: wpPost.id,
    slug: wpPost.slug,
    title: wpPost.title.rendered,
    content: normalizeWpUrl(wpPost.content.rendered),
    excerpt: normalizeWpUrl(wpPost.excerpt.rendered),
    date: wpPost.date,
    modified: wpPost.modified,
    author: wpPost.author,
    featuredMedia: wpPost.featured_media,
    link: normalizeWpUrl(wpPost.link),
    categories: wpPost.categories || [],
    tags: wpPost.tags || [],
    format: wpPost.format || 'standard',
    sticky: wpPost.sticky || false,
    commentStatus: wpPost.comment_status,
    seo: wpPost.yoast_head_json ? {
      title: wpPost.yoast_head_json.title,
      description: wpPost.yoast_head_json.description,
      og_title: wpPost.yoast_head_json.og_title,
      og_description: wpPost.yoast_head_json.og_description,
      og_image: wpPost.yoast_head_json.og_image,
      twitter_image: wpPost.yoast_head_json.twitter_image,
      schema: wpPost.yoast_head_json.schema,
    } : undefined,
  };
}

/**
 * Fetch all posts from WordPress
 * @param perPage Number of posts per request (default: 10)
 * @param page Page number (default: 1)
 */
export async function getPosts(perPage: number = 10, page: number = 1): Promise<Post[]> {
  const url = `${WP_API_URL}/posts?per_page=${perPage}&page=${page}&status=publish&_embed`;

  try {
    // Use direct fetch to avoid 415 errors
    const response = await fetch(url, {
      next: { revalidate: 60 }, // ISR: Revalidate every 60 seconds
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) {
      if (response.status === 404) return [];
      throw new Error(`Failed to fetch posts: ${response.status}`);
    }

    const posts: WordPressPost[] = await response.json();
    if (!Array.isArray(posts)) return [];
    return posts.map(transformPost);
  } catch (error) {
    console.error('Error fetching posts:', error);
    // Fail-safe: return an empty list so build/prerendering continues when the WP API is unreachable or unauthorized
    return [];
  }
}

/**
 * Fetch all posts with embedded author, media, and taxonomy details with pagination
 */
export async function getPostsWithDetails(perPage: number = 10, page: number = 1, search?: string): Promise<PaginatedResponse<PostWithDetails>> {
  let url = `${WP_API_URL}/posts?status=publish&_embed&per_page=${perPage}&page=${page}`;

  if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }

  try {
    // Use direct fetch to avoid 415 errors
    const response = await fetch(url, {
      next: { revalidate: 60 },
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) {
      if (response.status === 404) return { items: [], totalItems: 0, totalPages: 0 };
      throw new Error(`Failed to fetch posts with details: ${response.status}`);
    }

    const totalItems = parseInt(response.headers.get('X-WP-Total') || '0', 10);
    const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '0', 10);
    const posts: WordPressPost[] = await response.json();

    if (!Array.isArray(posts)) {
      console.warn('API returned non-array for posts:', posts);
      return { items: [], totalItems: 0, totalPages: 0 };
    }

    const items = posts.map((wpPost) => {
      const post = transformPost(wpPost);
      const embedded = wpPost._embedded;

      // Extract category and tag details from embedded terms
      const allTerms = embedded?.['wp:term']?.flat() || [];
      const categoryDetails = allTerms
        .filter((term) => term.taxonomy === 'category')
        .map((term) => ({
          id: term.id,
          name: term.name,
          slug: term.slug,
        }));

      const tagDetails = allTerms
        .filter((term) => term.taxonomy === 'post_tag')
        .map((term) => ({
          id: term.id,
          name: term.name,
          slug: term.slug,
        }));

      return {
        ...post,
        authorDetails: embedded?.author?.[0] as WordPressUser | undefined,
        featuredMediaDetails: normalizeMedia(embedded?.['wp:featuredmedia']?.[0]),
        categoryDetails,
        tagDetails,
      } as PostWithDetails;
    });

    return { items, totalItems, totalPages };
  } catch (error) {
    console.error('Error fetching posts with details:', error);
    return { items: [], totalItems: 0, totalPages: 0 };
  }
}

/**
 * Fetch a single post by slug
 */
export async function getPostBySlug(slug: string): Promise<PostWithDetails | null> {
  const url = `${WP_API_URL}/posts?slug=${slug}&status=publish&_embed`;

  try {
    // Use direct fetch to avoid 415 errors
    const response = await fetch(url, {
      next: { revalidate: 60 },
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      console.error(`getPostBySlug failed for ${slug}: ${response.status} ${response.statusText}`);
      throw new Error(`Failed to fetch post with slug "${slug}": ${response.status}`);
    }

    const posts: WordPressPost[] = await response.json();

    if (posts.length === 0) {
      return null;
    }

    const wpPost = posts[0];
    const post = transformPost(wpPost);
    const embedded = wpPost._embedded;

    // Extract category and tag details from embedded terms
    // wp:term is an array of arrays: [categories[], tags[]]
    const allTerms = embedded?.['wp:term']?.flat() || [];
    const categoryDetails = allTerms
      .filter((term) => term.taxonomy === 'category')
      .map((term) => ({
        id: term.id,
        name: term.name,
        slug: term.slug,
      }));

    const tagDetails = allTerms
      .filter((term) => term.taxonomy === 'post_tag')
      .map((term) => ({
        id: term.id,
        name: term.name,
        slug: term.slug,
      }));

    return {
      ...post,
      authorDetails: embedded?.author?.[0] as WordPressUser | undefined,
      featuredMediaDetails: normalizeMedia(embedded?.['wp:featuredmedia']?.[0]),
      categoryDetails,
      tagDetails,
    } as PostWithDetails;
  } catch (error: unknown) {
    if (error instanceof WordPressError && error.status === 404) {
      return null;
    }
    console.error(`Error fetching post with slug "${slug}":`, error);
    return null;
  }
}

/**
 * Fetch all post slugs for static generation
 */
export async function getAllPostSlugs(): Promise<string[]> {
  const url = `${WP_API_URL}/posts?status=publish&per_page=100`;

  try {
    // Use direct fetch to avoid 415 errors
    const response = await fetch(url, {
      next: { revalidate: 60 }, // Cache for 1 hour
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) return [];

    const posts = await response.json() as WordPressPost[];
    if (!Array.isArray(posts)) {
      return [];
    }
    return posts.map((post) => post.slug);
  } catch (error: unknown) {
    console.error('Error fetching post slugs:', error);
    return [];
  }
}

/**
 * Fetch posts by category ID with pagination
 */
export async function getPostsByCategory(categoryId: number, perPage: number = 10, page: number = 1): Promise<PaginatedResponse<PostWithDetails>> {
  const url = `${WP_API_URL}/posts?categories=${categoryId}&status=publish&_embed&per_page=${perPage}&page=${page}`;

  try {
    // Use direct fetch to avoid 415 errors
    const response = await fetch(url, {
      next: { revalidate: 60 },
      headers: { 'Accept': 'application/json' }
    });

    const totalItems = parseInt(response.headers.get('X-WP-Total') || '0', 10);
    const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '0', 10);

    if (!response.ok) return { items: [], totalItems: 0, totalPages: 0 };

    if (!response.ok) return { items: [], totalItems: 0, totalPages: 0 };

    const posts = await response.json() as WordPressPost[];

    const items = posts.map((wpPost) => {
      const post = transformPost(wpPost);
      const embedded = wpPost._embedded;

      // Extract category and tag details from embedded terms
      const allTerms = embedded?.['wp:term']?.flat() || [];
      const categoryDetails = allTerms
        .filter((term) => term.taxonomy === 'category')
        .map((term) => ({
          id: term.id,
          name: term.name,
          slug: term.slug,
        }));

      const tagDetails = allTerms
        .filter((term) => term.taxonomy === 'post_tag')
        .map((term) => ({
          id: term.id,
          name: term.name,
          slug: term.slug,
        }));

      return {
        ...post,
        authorDetails: embedded?.author?.[0] as WordPressUser | undefined,
        featuredMediaDetails: normalizeMedia(embedded?.['wp:featuredmedia']?.[0]),
        categoryDetails,
        tagDetails,
      } as PostWithDetails;
    });

    return { items, totalItems, totalPages };
  } catch (error: unknown) {
    console.error(`Error fetching posts by category ${categoryId}:`, error);
    return { items: [], totalItems: 0, totalPages: 0 };
  }
}

/**
 * Fetch posts by tag ID with pagination
 */
export async function getPostsByTag(tagId: number, perPage: number = 10, page: number = 1): Promise<PaginatedResponse<PostWithDetails>> {
  const url = `${WP_API_URL}/posts?tags=${tagId}&status=publish&_embed&per_page=${perPage}&page=${page}`;

  try {
    // Use direct fetch to avoid 415 errors
    const response = await fetch(url, {
      next: { revalidate: 60 },
      headers: { 'Accept': 'application/json' }
    });

    const totalItems = parseInt(response.headers.get('X-WP-Total') || '0', 10);
    const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '0', 10);
    if (!response.ok) return { items: [], totalItems: 0, totalPages: 0 };

    const posts: WordPressPost[] = await response.json();

    const items = posts.map((wpPost) => {
      const post = transformPost(wpPost);
      const embedded = wpPost._embedded;

      // Extract category and tag details from embedded terms
      const allTerms = embedded?.['wp:term']?.flat() || [];
      const categoryDetails = allTerms
        .filter((term) => term.taxonomy === 'category')
        .map((term) => ({
          id: term.id,
          name: term.name,
          slug: term.slug,
        }));

      const tagDetails = allTerms
        .filter((term) => term.taxonomy === 'post_tag')
        .map((term) => ({
          id: term.id,
          name: term.name,
          slug: term.slug,
        }));

      return {
        ...post,
        authorDetails: embedded?.author?.[0] as WordPressUser | undefined,
        featuredMediaDetails: normalizeMedia(embedded?.['wp:featuredmedia']?.[0]),
        categoryDetails,
        tagDetails,
      } as PostWithDetails;
    });

    return { items, totalItems, totalPages };
  } catch (error) {
    console.error(`Error fetching posts by tag ${tagId}:`, error);
    return { items: [], totalItems: 0, totalPages: 0 };
  }
}

/**
 * Fetch posts by author ID with pagination
 */
export async function getPostsByAuthor(authorId: number, perPage: number = 10, page: number = 1): Promise<PaginatedResponse<PostWithDetails>> {
  const url = `${WP_API_URL}/posts?author=${authorId}&status=publish&_embed&per_page=${perPage}&page=${page}`;

  try {
    // Use direct fetch to avoid 415 errors
    const response = await fetch(url, {
      next: { revalidate: 60 },
      headers: { 'Accept': 'application/json' }
    });

    const totalItems = parseInt(response.headers.get('X-WP-Total') || '0', 10);
    const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '0', 10);
    if (!response.ok) return { items: [], totalItems: 0, totalPages: 0 };

    const posts: WordPressPost[] = await response.json();

    const items = posts.map((wpPost) => {
      const post = transformPost(wpPost);
      const embedded = wpPost._embedded;

      const allTerms = embedded?.['wp:term']?.flat() || [];
      const categoryDetails = allTerms
        .filter((term) => term.taxonomy === 'category')
        .map((term) => ({
          id: term.id,
          name: term.name,
          slug: term.slug,
        }));

      const tagDetails = allTerms
        .filter((term) => term.taxonomy === 'post_tag')
        .map((term) => ({
          id: term.id,
          name: term.name,
          slug: term.slug,
        }));

      return {
        ...post,
        authorDetails: embedded?.author?.[0] as WordPressUser | undefined,
        featuredMediaDetails: normalizeMedia(embedded?.['wp:featuredmedia']?.[0]),
        categoryDetails,
        tagDetails,
      } as PostWithDetails;
    });

    return { items, totalItems, totalPages };
  } catch (error) {
    console.error(`Error fetching posts by author ${authorId}:`, error);
    return { items: [], totalItems: 0, totalPages: 0 };
  }
}

/**
 * Fetch category by slug
 */
export async function getCategoryBySlug(slug: string): Promise<{ id: number; name: string; slug: string; description: string } | null> {
  const url = `${WP_API_URL}/categories?slug=${slug}`;

  try {
    // Use direct fetch to avoid 415 errors
    const response = await fetch(url, {
      next: { revalidate: 60 }, // Cache for 1 hour
      headers: { 'Accept': 'application/json' }
    });

    const categories = await response.json();

    if (categories.length === 0) {
      return null;
    }

    return {
      id: categories[0].id,
      name: categories[0].name,
      slug: categories[0].slug,
      description: categories[0].description || '',
    };
  } catch (error) {
    console.error(`Error fetching category with slug "${slug}":`, error);
    return null;
  }
}

/**
 * Fetch tag by slug
 */
export async function getTagBySlug(slug: string): Promise<{ id: number; name: string; slug: string; description: string } | null> {
  const url = `${WP_API_URL}/tags?slug=${slug}`;

  try {
    // Use direct fetch to avoid 415 errors
    const response = await fetch(url, {
      next: { revalidate: 60 }, // Cache for 1 hour
      headers: { 'Accept': 'application/json' }
    });

    const tags = await response.json();

    if (tags.length === 0) {
      return null;
    }

    return {
      id: tags[0].id,
      name: tags[0].name,
      slug: tags[0].slug,
      description: tags[0].description || '',
    };
  } catch (error) {
    console.error(`Error fetching tag with slug "${slug}":`, error);
    return null;
  }
}

/**
 * Fetch posts by category slug with pagination
 */
export async function getPostsByCategorySlug(slug: string, perPage: number = 10, page: number = 1): Promise<PaginatedResponse<PostWithDetails>> {
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return { items: [], totalItems: 0, totalPages: 0 };
  }

  return getPostsByCategory(category.id, perPage, page);
}

/**
 * Fetch posts by tag slug with pagination
 */
export async function getPostsByTagSlug(slug: string, perPage: number = 10, page: number = 1): Promise<PaginatedResponse<PostWithDetails>> {
  const tag = await getTagBySlug(slug);

  if (!tag) {
    return { items: [], totalItems: 0, totalPages: 0 };
  }

  return getPostsByTag(tag.id, perPage, page);
}

// Transform WordPress CPT to simplified format
function transformCPT(wpCPT: WordPressCPT): CPT {
  // Extract custom fields (everything that's not a standard field)
  const standardFields = [
    'id', 'date', 'date_gmt', 'guid', 'modified', 'modified_gmt', 'slug',
    'status', 'type', 'link', 'title', 'content', 'excerpt', 'author',
    'featured_media', 'template', 'class_list', '_links', '_embedded'
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const customFields: Record<string, any> = {};
  Object.keys(wpCPT).forEach(key => {
    if (!standardFields.includes(key)) {
      customFields[key] = wpCPT[key];
    }
  });

  return {
    id: wpCPT.id,
    slug: wpCPT.slug,
    title: wpCPT.title.rendered,
    content: normalizeWpUrl(wpCPT.content.rendered),
    excerpt: normalizeWpUrl(wpCPT.excerpt?.rendered),
    date: wpCPT.date,
    modified: wpCPT.modified,
    author: wpCPT.author,
    featuredMedia: wpCPT.featured_media,
    link: normalizeWpUrl(wpCPT.link),
    type: wpCPT.type,
    status: wpCPT.status,
    template: wpCPT.template,
    classList: wpCPT.class_list,
    customFields: Object.keys(customFields).length > 0 ? customFields : undefined,
  };
}

/**
 * Fetch all items from a Custom Post Type with pagination
 * @param cptSlug The REST base slug of the CPT (e.g., 'popupbuilder', 'news-release')
 * @param perPage Number of items per request (default: 10)
 * @param page Page number (default: 1)
 */
export async function getCPTItems(cptSlug: string, perPage: number = 10, page: number = 1): Promise<CPT[]> {
  const url = `${WP_API_URL}/${cptSlug}?per_page=${perPage}&page=${page}&status=publish&_embed`;

  try {
    // Use direct fetch to avoid 415 errors
    const response = await fetch(url, {
      next: { revalidate: 60 }, // ISR: Revalidate every 60 seconds
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) return [];

    const items: WordPressCPT[] = await response.json();
    return items.map(transformCPT);
  } catch (error) {
    console.error(`Error fetching ${cptSlug} items:`, error);
    return [];
  }
}

/**
 * Fetch all CPT items with embedded author, media, and taxonomy details with pagination
 * @param cptSlug The REST base slug of the CPT
 */
export async function getCPTItemsWithDetails(cptSlug: string, perPage: number = 10, page: number = 1): Promise<PaginatedResponse<CPTWithDetails>> {
  const url = `${WP_API_URL}/${cptSlug}?status=publish&_embed&per_page=${perPage}&page=${page}`;

  try {
    // Use direct fetch to avoid 415 errors
    const response = await fetch(url, {
      next: { revalidate: 60 },
      headers: { 'Accept': 'application/json' }
    });

    const totalItems = parseInt(response.headers.get('X-WP-Total') || '0', 10);
    const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '0', 10);

    if (!response.ok) return { items: [], totalItems: 0, totalPages: 0 };

    const items: WordPressCPT[] = await response.json();

    const result = items.map((wpCPT) => {
      const cpt = transformCPT(wpCPT);
      const embedded = wpCPT._embedded;

      // Extract category and tag details from embedded terms (if available)
      const allTerms = embedded?.['wp:term']?.flat() || [];
      const categoryDetails = allTerms
        .filter((term) => term.taxonomy === 'category')
        .map((term) => ({
          id: term.id,
          name: term.name,
          slug: term.slug,
        }));

      const tagDetails = allTerms
        .filter((term) => term.taxonomy === 'post_tag')
        .map((term) => ({
          id: term.id,
          name: term.name,
          slug: term.slug,
        }));

      return {
        ...cpt,
        authorDetails: embedded?.author?.[0] as WordPressUser | undefined,
        featuredMediaDetails: normalizeMedia(embedded?.['wp:featuredmedia']?.[0]),
        categoryDetails: categoryDetails.length > 0 ? categoryDetails : undefined,
        tagDetails: tagDetails.length > 0 ? tagDetails : undefined,
      } as CPTWithDetails;
    });

    return { items: result, totalItems, totalPages };
  } catch (error) {
    console.error(`Error fetching ${cptSlug} items with details:`, error);
    return { items: [], totalItems: 0, totalPages: 0 };
  }
}

/**
 * Fetch a single CPT item by slug
 * @param cptSlug The REST base slug of the CPT
 * @param slug The item slug
 */
export async function getCPTItemBySlug(cptSlug: string, slug: string): Promise<CPTWithDetails | null> {
  const url = `${WP_API_URL}/${cptSlug}?slug=${slug}&status=publish&_embed`;

  try {
    // Use direct fetch to avoid 415 errors
    const response = await fetch(url, {
      next: { revalidate: 60 },
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) return null;

    const items: WordPressCPT[] = await response.json();

    if (items.length === 0) {
      return null;
    }

    const wpCPT = items[0];
    const cpt = transformCPT(wpCPT);
    const embedded = wpCPT._embedded;

    // Extract category and tag details from embedded terms (if available)
    const allTerms = embedded?.['wp:term']?.flat() || [];
    const categoryDetails = allTerms
      .filter((term) => term.taxonomy === 'category')
      .map((term) => ({
        id: term.id,
        name: term.name,
        slug: term.slug,
      }));

    const tagDetails = allTerms
      .filter((term) => term.taxonomy === 'post_tag')
      .map((term) => ({
        id: term.id,
        name: term.name,
        slug: term.slug,
      }));

    return {
      ...cpt,
      authorDetails: embedded?.author?.[0] as WordPressUser | undefined,
      featuredMediaDetails: normalizeMedia(embedded?.['wp:featuredmedia']?.[0]),
      categoryDetails: categoryDetails.length > 0 ? categoryDetails : undefined,
      tagDetails: tagDetails.length > 0 ? tagDetails : undefined,
    } as CPTWithDetails;
  } catch (error) {
    if (error instanceof WordPressError && error.status === 404) {
      return null;
    }
    console.error(`Error fetching ${cptSlug} item with slug "${slug}":`, error);
    return null;
  }
}

/**
 * Fetch all CPT item slugs for static generation
 * @param cptSlug The REST base slug of the CPT
 */
export async function getAllCPTItemSlugs(cptSlug: string): Promise<string[]> {
  const url = `${WP_API_URL}/${cptSlug}?status=publish&per_page=100`;

  try {
    // Use direct fetch to avoid 415 errors
    const response = await fetch(url, {
      next: { revalidate: 60 }, // Cache for 1 hour
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) return [];

    const items: WordPressCPT[] = await response.json();
    return items.map((item) => item.slug);
  } catch (error) {
    console.error(`Error fetching ${cptSlug} item slugs:`, error);
    return [];
  }
}

/**
 * Fetch a menu by its slug using the custom menus/v1 endpoint.
 */
export async function getMenu(slug: string): Promise<WordPressMenu | null> {
  const baseUrl = WP_API_URL.replace('/wp/v2', '/menus/v1');
  const url = `${baseUrl}/menus/${slug}`;

  try {
    // Use direct fetch to avoid 415 errors
    // Use timeout to fail fast (3s)
    const response = await fetchWithTimeout(url, {
      next: { revalidate: 60 },
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      console.warn(`Warning: Failed to fetch menu "${slug}". Status: ${response.status}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof WordPressError && (error.status === 404 || error.status === 401)) {
      return null;
    }
    console.warn(`Error fetching menu "${slug}":`, error instanceof Error ? error.message : error);
    return null;
  }
}

/**
 * Fetch site settings
 */

/**
 * Fetch with timeout helper
 */
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 3000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getSiteSettings(): Promise<any> {
  const url = `${WP_API_URL}/settings`;

  try {
    // Use timeout to fail fast (3s) instead of hanging for 10s
    const response = await fetchWithTimeout(url, {
      next: { revalidate: 60 },
    });

    // Gracefully handle 401s (which are expected for public unauthenticated requests to settings)
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) return null;
      console.warn('Failed to fetch site settings:', response.status);
      return null;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof WordPressError && (error.status === 401 || error.status === 403)) {
      // Silently fail for authentication errors on settings
      return null;
    }
    // Only log warning to avoid huge stack traces in dev console for timeouts
    console.warn(`Error fetching site settings (${url}):`, error instanceof Error ? error.message : error);
    return null;
  }
}

/**
 * Get the full site identity (title, description, logo)
 */
export async function getSiteIdentity(): Promise<{ title: string; description: string; logoUrl: string | null }> {
  const settings = await getSiteSettings();

  const title = settings?.title || 'Market Headlines';
  const description = settings?.description || '';

  let logoUrl = null;
  if (settings?.site_logo) {
    const media = await getMediaById(settings.site_logo);
    logoUrl = media?.source_url || null;
  }

  // Fallback to local logo if API fails (e.g. 401 Unauthorized)
  if (!logoUrl) {
    logoUrl = '/logo.svg';
  }

  return {
    title,
    description,
    logoUrl
  };
}

/**
 * Fetch MarketHeadlines settings from the custom endpoint
 */
export async function getMarketHeadlinesSettings(): Promise<MarketHeadlinesSettings | null> {
  // Use the custom value for Pods settings
  const baseUrl = WP_API_URL.replace('/wp/v2', '/custom/v1');
  const url = `${baseUrl}/global-pods-theme-settings/`;

  try {
    // Using direct fetch to avoid 415 on this sensitive custom endpoint
    const response = await fetch(url, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      console.warn('Failed to fetch MarketHeadlines settings:', response.status, response.statusText);
      return null;
    }

    const rawData = await response.json();

    // Map the raw response to our interface
    const settings: MarketHeadlinesSettings = {
      name: 'Market Headlines', // Default
      description: '', // Default
      url: WP_API_URL, // Default to API URL if general settings aren't fetched
      logo: undefined,
      footer_title: rawData.footer_title || '',
      footer_sub_title: rawData.footer_sub_title || '',
      footer_copyright: rawData.footer_copyright || '',
      social: rawData.social_media_urls || [],
      // Handle footer_logo object or string
      footer_logo: typeof rawData.footer_logo === 'object' && rawData.footer_logo?.guid
        ? rawData.footer_logo.guid
        : (typeof rawData.footer_logo === 'string' ? rawData.footer_logo : undefined)
    };

    return settings;
  } catch (error) {
    console.error('Error fetching MarketHeadlines settings:', error);
    return null;
  }
}

/**
 * Helper to extract URL from HTML anchor tag string
 */
function extractUrlFromAnchor(html: string): string {
  if (!html) return '';
  const match = html.match(/href="([^"]*)"/);
  return match ? match[1] : html;
}





/**
 * Smart split function to handle comma-separated lists while respecting parentheses
 */
function smartSplit(text: string): string[] {
  const results: string[] = [];
  let current = '';
  let parenDepth = 0;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (char === '(') {
      parenDepth++;
      current += char;
    } else if (char === ')') {
      if (parenDepth > 0) parenDepth--;
      current += char;
    } else if (char === ',' && parenDepth === 0) {
      results.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  if (current.trim()) {
    results.push(current.trim());
  }

  return results.map(item => {
    // Strip "and " prefix if it looks like a list conjunction
    if (/^and\s+/i.test(item)) {
      return item.replace(/^and\s+/i, '');
    }
    return item;
  });
}

/**
 * Fetch latest posts for fallback
 */
export async function getAllPosts(limit: number = 5): Promise<PostWithDetails[]> {
  const url = `${WP_API_URL}/posts?per_page=${limit}&status=publish&_embed`;
  try {
    // Use direct fetch to avoid 415 errors
    const response = await fetch(url, {
      next: { revalidate: 60 },
      headers: { 'Accept': 'application/json' }
    });
    if (!response.ok) return [];
    const items: any[] = await response.json();
    return items.map((post) => {
      const embedded = post._embedded || {};
      const categoryDetails = (embedded['wp:term']?.flat() || [])
        .filter((term: any) => term.taxonomy === 'category')
        .map((term: any) => ({ id: term.id, name: term.name, slug: term.slug }));

      const author = embedded.author?.[0];
      const media = embedded['wp:featuredmedia']?.[0];

      return {
        id: post.id,
        slug: post.slug,
        title: post.title.rendered,
        content: post.content.rendered,
        excerpt: post.excerpt.rendered,
        date: post.date,
        modified: post.modified,
        author: post.author,
        featuredMedia: post.featured_media,
        link: post.link,
        categories: post.categories || [],
        tags: post.tags || [],
        categoryDetails,
        authorDetails: author ? { name: author.name, id: author.id, url: author.link, description: author.description, slug: author.slug, avatar_urls: author.avatar_urls } : undefined,
        featuredMediaDetails: media ? { source_url: media.source_url, alt_text: media.alt_text, id: media.id, date: media.date, guid: media.guid, modified: media.modified, slug: media.slug, status: media.status, type: media.type, link: media.link, title: media.title, author: media.author, caption: media.caption, media_type: media.media_type, mime_type: media.mime_type, media_details: media.media_details } : undefined,
        customReadingTime: post.reading_time || '', // Attempt to get custom field if exposed
      } as PostWithDetails;
    });
  } catch (e) {
    console.error('Error fetching latest posts:', e);
    return [];
  }
}

/**
 * Fetch Home Page Data (ID: 3504679)
 */
export async function getHomePageData(): Promise<HomePageData | null> {
  const homePageId = 3504679;
  // Use the new custom endpoint that returns Pods data
  const baseUrl = WP_API_URL.replace('/wp/v2', '/custom/v1');
  const url = `${baseUrl}/page-pods/${homePageId}/`;

  try {
    // Use direct fetch to avoid potential 415/401 on custom endpoint
    const response = await fetch(url, {
      next: { revalidate: 60 },
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      console.warn('Failed to fetch Home Page Pods data:', response.status);
      return null;
    }

    const data = await response.json();

    // keys in data: "Market Intelligence Section", "For Investors & Organizations", "Page Newsletter Section", "General", etc.
    const marketSection = data['Market Intelligence Section'] || {};
    const investorsSection = data['For Investors & Organizations'] || {};
    const newsletterSection = data['Page Newsletter Section'] || {};

    // Handle market_intelligence_features_text
    let marketFeatures: string[] = [];
    const rawMarketFeatures = marketSection.market_intelligence_features_text;

    if (Array.isArray(rawMarketFeatures)) {
      marketFeatures = rawMarketFeatures.map((f: unknown) => String(f)).filter(Boolean);
    } else if (typeof rawMarketFeatures === 'string') {
      const newlineSplit = rawMarketFeatures.split(/\r?\n/).filter(Boolean);
      if (newlineSplit.length > 1) {
        marketFeatures = newlineSplit;
      } else {
        marketFeatures = smartSplit(rawMarketFeatures);
      }
    }

    // Handle investors features
    let investorsFeatures: Array<{ id: string | number; title: string; description: string; image: string | null }> = [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rawInvestorsFeatures = investorsSection.for_investors_organizations_features as any[];

    if (Array.isArray(rawInvestorsFeatures) && rawInvestorsFeatures.length > 0) {
      const featureIds = rawInvestorsFeatures.map(f => f.ID || f.id).filter(Boolean);

      if (featureIds.length > 0) {
        // Fetch full feature items to get custom fields (features_title, features_description, image)
        // utilizing the standard WP REST API endpoint discovered: /wp/v2/feature_item
        try {
          const featuresUrl = `${WP_API_URL}/feature_item?include=${featureIds.join(',')}&per_page=100`;
          const featuresRes = await fetch(featuresUrl, { next: { revalidate: 300 } });

          if (featuresRes.ok) {
            const featuresData = await featuresRes.json();
            // Map back to preserve order if needed, or just use the fetched list
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            investorsFeatures = featuresData.map((item: any) => ({
              id: item.id,
              title: item.features_title || item.title?.rendered || '',
              description: item.features_description || item.content?.rendered || '',
              // item.image is the attachment object from REST
              image: normalizeWpUrl(item.image?.guid || item.image?.source_url)
            }));
          } else {
            // Fallback to the raw data if fetch fails
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            investorsFeatures = rawInvestorsFeatures.map((feature: any) => ({
              id: feature.ID || feature.id,
              title: feature.post_title || feature.title,
              description: feature.post_content || feature.description || '',
              image: normalizeWpUrl(typeof feature.image === 'object' && feature.image?.guid ? feature.image.guid : (typeof feature.image === 'string' ? feature.image : null))
            }));
          }
        } catch (e) {
          console.error('Error fetching rich feature items:', e);
          // Fallback
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          investorsFeatures = rawInvestorsFeatures.map((feature: any) => ({
            id: feature.ID || feature.id,
            title: feature.post_title || feature.title,
            description: feature.post_content || feature.description || '',
            image: normalizeWpUrl(typeof feature.image === 'object' && feature.image?.guid ? feature.image.guid : (typeof feature.image === 'string' ? feature.image : null))
          }));
        }
      }
    }

    // Helper to transform Pods "simple posts" into PostWithDetails
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const transformPodsPost = (simplePost: any): PostWithDetails => {
      // Extract slug from link
      const link = normalizeWpUrl(simplePost.link) || '';
      const slug = link.split('/').filter(Boolean).pop() || '';

      return {
        id: simplePost.id,
        slug: slug,
        title: simplePost.title,
        content: '', // Not needed for cards
        excerpt: '', // Can be populated if API provides it later
        date: '',
        modified: '',
        author: 0,
        featuredMedia: 0,
        link: link,
        categories: [],
        tags: [],
        format: 'standard',
        sticky: false,
        commentStatus: 'closed',
        customReadingTime: simplePost.reading_time || '',
        featuredMediaDetails: simplePost.image ? {
          source_url: normalizeWpUrl(simplePost.image),

          alt_text: simplePost.title,
          // minimal mock for other required fields
          id: 0, date: '', date_gmt: '', guid: { rendered: '' }, modified: '', modified_gmt: '', slug: '', status: '', type: '', link: '', title: { rendered: '' }, author: 0, caption: { rendered: '' }, media_type: '', mime_type: '', media_details: { width: 0, height: 0, file: '', sizes: {}, image_meta: {} }
        } : undefined,
        categoryDetails: simplePost.category ? [{
          id: 0,
          name: simplePost.category,
          slug: simplePost.category.toLowerCase().replace(/\s+/g, '-')
        }] : [],
        authorDetails: {
          name: '',
          id: 0, url: '', description: '', link: '', slug: '', avatar_urls: {} // simplified
        }
      } as PostWithDetails;
    };

    // Parse dynamic sections
    const trendingSection = data['Trending Now'] || {};
    const worldGridSection = data['World News Grid'] || {};
    const worldListSection = data['World News'] || {};
    const businessSection = data['Business Section'] || {};

    // Trending Section Fallback Logic
    let trendingPosts: PostWithDetails[] = [];
    if (trendingSection.posts && Array.isArray(trendingSection.posts) && trendingSection.posts.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      trendingPosts = trendingSection.posts.map((p: any) => transformPodsPost(p));
    } else {
      // Fallback to latest posts if no posts selected (empty category)
      trendingPosts = await getAllPosts(5);
    }

    return {
      // Market Intelligence Section
      market_intelligence_heading: marketSection.market_intelligence_heading || '',
      market_intelligence_main_heading: marketSection.market_intelligence_main_heading || '',
      market_intelligence_description: marketSection.market_intelligence_description || '',
      market_intelligence_features_text: marketFeatures,
      get_market_intelligence_button_text: marketSection.get_market_intelligence_button_text || '',
      get_market_intelligence_button_url: normalizeWpUrl(marketSection.get_market_intelligence_button_url),
      explore_coverage_button_text: marketSection.explore_coverage_button_text || '',
      explore_coverage_button_url: normalizeWpUrl(marketSection.explore_coverage_button_url),
      market_intelligence_image: normalizeWpUrl((marketSection.market_intelligence_image && typeof marketSection.market_intelligence_image === 'object')
        ? (marketSection.market_intelligence_image.guid || marketSection.market_intelligence_image.source_url || '')
        : (typeof marketSection.market_intelligence_image === 'string' ? marketSection.market_intelligence_image : '')),

      // Investors & Organizations Section
      for_investors_organizations_heading: investorsSection.for_investors_organizations_heading || '',
      for_investors_organizations_main_heading: investorsSection.for_investors_organizations_main_heading || '',
      for_investors_organizations_description: investorsSection.for_investors_organizations_description || '',
      for_investors_organizations_features: investorsFeatures,
      request_a_quote_button_text: investorsSection.request_a_quote_button_text || '',
      request_a_quote_button_url: normalizeWpUrl(investorsSection.request_a_quote_button_url),
      register_for_access_button_text: investorsSection.register_for_access_button_text || '',
      register_for_access_button_url: normalizeWpUrl(investorsSection.register_for_access_button_url),

      // Newsletter Section
      show_newsletter_section: newsletterSection.show_newsletter_section || '0',
      newsletter_heading: newsletterSection.newsletter_heading || '',
      newsletter_description: newsletterSection.newsletter_description || '',
      default_daily_market_brief: newsletterSection.default_daily_market_brief || '0',
      default_weekly_deep_dive: newsletterSection.default_weekly_deep_dive || '0',
      default_breaking_news_alerts: newsletterSection.default_breaking_news_alerts || '0',

      // Dynamic Content Sections
      trending_now_section: {
        title: trendingSection.title || 'Trending Now',
        view_all_url: normalizeWpUrl(trendingSection.view_all_url || ''),
        posts: trendingPosts
      },
      world_news_grid_section: {
        title: worldGridSection.title || 'World News',
        view_all_url: normalizeWpUrl(worldGridSection.view_all_url || ''),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        posts: (worldGridSection.posts || []).map((p: any) => transformPodsPost(p))
      },
      world_news_list_section: {
        title: worldListSection.title || 'World News',
        view_all_url: normalizeWpUrl(worldListSection.view_all_url || ''),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        posts: (worldListSection.posts || []).map((p: any) => transformPodsPost(p))
      },
      business_section: {
        title: businessSection.title || 'Business',
        view_all_url: normalizeWpUrl(businessSection.view_all_url || ''),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        posts: (businessSection.posts || []).map((p: any) => transformPodsPost(p))
      }
    };
  } catch (error) {
    console.error('CRITICAL ERROR in getHomePageData:', error);
    return null;
  }
}

/**
 * Fetch Market Tickers from custom endpoint
 */
export async function getMarketTickers(): Promise<MarketTicker[]> {
  const url = `${WORDPRESS_URL}/wp-json/custom-market/v1/tickers`;
  try {
    const response = await fetchWithTimeout(url, {
      next: { revalidate: 60 },
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      console.warn('Failed to fetch market tickers:', response.status);
      return [];
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.warn('Error fetching market tickers:', error instanceof Error ? error.message : error);
    return [];
  }
}
// ... existing code ...


// ... existing code ...

/**
 * Get the designated posts page from WordPress settings
 */
export async function getPostsPage(): Promise<Page | null> {
  try {
    // 1. Fetch Settings to get page_for_posts ID
    // Note: /settings usually requires authentication. We'll handle 401 gracefully.
    let settingsRes;
    try {
      settingsRes = await fetch(`${WP_API_URL}/settings`, { headers: { 'Accept': 'application/json' } });
    } catch (error) {
      if (error instanceof WordPressError && error.status === 401) {
        // Silently fail for unauthenticated requests
        return null;
      }
      throw error; // Re-throw other errors
    }

    // If we can't get settings (e.g. 401 unauthenticated), we can't determine the page
    if (!settingsRes.ok) {
      return null;
    }

    const settings: WordPressRestSettings = await settingsRes.json();
    const postsPageId = settings.page_for_posts;

    if (!postsPageId || postsPageId === 0) {
      return null;
    }

    // 2. Fetch the actual Page
    return await getPage(postsPageId);
  } catch (error) {
    console.error('Error fetching posts page:', error);
    return null;
  }
}

/**
 * Global Search using custom endpoint
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getGlobalSearch(query: string): Promise<any[]> {
  const url = `${MARKET_HEADLINES_API_URL}/search?q=${encodeURIComponent(query)}`;
  try {
    // Use direct fetch to avoid 415 errors
    const response = await fetch(url, { next: { revalidate: 60 }, headers: { 'Accept': 'application/json' } });
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error('Error fetching global search:', error);
    return [];
  }
}
