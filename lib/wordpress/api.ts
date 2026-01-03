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
  CPTWithDetails
} from '@/types/wordpress';

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

// Transform WordPress post to simplified format
function transformPost(wpPost: WordPressPost): Post {
  return {
    id: wpPost.id,
    slug: wpPost.slug,
    title: wpPost.title.rendered,
    content: wpPost.content.rendered,
    excerpt: wpPost.excerpt.rendered,
    date: wpPost.date,
    modified: wpPost.modified,
    author: wpPost.author,
    featuredMedia: wpPost.featured_media,
    link: wpPost.link,
    categories: wpPost.categories || [],
    tags: wpPost.tags || [],
    format: wpPost.format || 'standard',
    sticky: wpPost.sticky || false,
    commentStatus: wpPost.comment_status,
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
    const response = await fetchWithAuth(url, {
      next: { revalidate: 60 }, // ISR: Revalidate every 60 seconds
    });

    const posts: WordPressPost[] = await response.json();
    return posts.map(transformPost);
  } catch (error) {
    console.error('Error fetching posts:', error);
    // Fail-safe: return an empty list so build/prerendering continues when the WP API is unreachable or unauthorized
    return [];
  }
}

/**
 * Fetch all posts with embedded author, media, and taxonomy details
 */
export async function getPostsWithDetails(): Promise<PostWithDetails[]> {
  const url = `${WP_API_URL}/posts?status=publish&_embed`;
  
  try {
    const response = await fetchWithAuth(url, {
      next: { revalidate: 60 },
    });

    const posts: WordPressPost[] = await response.json();
    
    return posts.map((wpPost) => {
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
        featuredMediaDetails: embedded?.['wp:featuredmedia']?.[0] as WordPressMedia | undefined,
        categoryDetails,
        tagDetails,
      } as PostWithDetails;
    });
  } catch (error) {
    console.error('Error fetching posts with details:', error);
    // Fail-safe: return an empty list so build/prerendering continues when the WP API is unreachable or unauthorized
    return [];
  }
}

/**
 * Fetch a single post by slug
 */
export async function getPostBySlug(slug: string): Promise<PostWithDetails | null> {
  const url = `${WP_API_URL}/posts?slug=${slug}&status=publish&_embed`;
  
  try {
    const response = await fetchWithAuth(url, {
      next: { revalidate: 60 },
    });

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
      featuredMediaDetails: embedded?.['wp:featuredmedia']?.[0] as WordPressMedia | undefined,
      categoryDetails,
      tagDetails,
    } as PostWithDetails;
  } catch (error) {
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
    const response = await fetchWithAuth(url, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    const posts: WordPressPost[] = await response.json();
    return posts.map((post) => post.slug);
  } catch (error) {
    console.error('Error fetching post slugs:', error);
    return [];
  }
}

/**
 * Fetch posts by category ID
 */
export async function getPostsByCategory(categoryId: number): Promise<PostWithDetails[]> {
  const url = `${WP_API_URL}/posts?categories=${categoryId}&status=publish&_embed`;
  
  try {
    const response = await fetchWithAuth(url, {
      next: { revalidate: 60 },
    });

    const posts: WordPressPost[] = await response.json();
    
    return posts.map((wpPost) => {
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
        featuredMediaDetails: embedded?.['wp:featuredmedia']?.[0] as WordPressMedia | undefined,
        categoryDetails,
        tagDetails,
      } as PostWithDetails;
    });
  } catch (error) {
    console.error(`Error fetching posts by category ${categoryId}:`, error);
    return [];
  }
}

/**
 * Fetch posts by tag ID
 */
export async function getPostsByTag(tagId: number): Promise<PostWithDetails[]> {
  const url = `${WP_API_URL}/posts?tags=${tagId}&status=publish&_embed`;
  
  try {
    const response = await fetchWithAuth(url, {
      next: { revalidate: 60 },
    });

    const posts: WordPressPost[] = await response.json();
    
    return posts.map((wpPost) => {
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
        featuredMediaDetails: embedded?.['wp:featuredmedia']?.[0] as WordPressMedia | undefined,
        categoryDetails,
        tagDetails,
      } as PostWithDetails;
    });
  } catch (error) {
    console.error(`Error fetching posts by tag ${tagId}:`, error);
    return [];
  }
}

/**
 * Fetch category by slug
 */
export async function getCategoryBySlug(slug: string): Promise<{ id: number; name: string; slug: string; description: string } | null> {
  const url = `${WP_API_URL}/categories?slug=${slug}`;
  
  try {
    const response = await fetchWithAuth(url, {
      next: { revalidate: 3600 }, // Cache for 1 hour
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
    const response = await fetchWithAuth(url, {
      next: { revalidate: 3600 }, // Cache for 1 hour
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
 * Fetch posts by category slug
 */
export async function getPostsByCategorySlug(slug: string): Promise<PostWithDetails[]> {
  const category = await getCategoryBySlug(slug);
  
  if (!category) {
    return [];
  }

  return getPostsByCategory(category.id);
}

/**
 * Fetch posts by tag slug
 */
export async function getPostsByTagSlug(slug: string): Promise<PostWithDetails[]> {
  const tag = await getTagBySlug(slug);
  
  if (!tag) {
    return [];
  }

  return getPostsByTag(tag.id);
}

// Transform WordPress CPT to simplified format
function transformCPT(wpCPT: WordPressCPT): CPT {
  // Extract custom fields (everything that's not a standard field)
  const standardFields = [
    'id', 'date', 'date_gmt', 'guid', 'modified', 'modified_gmt', 'slug',
    'status', 'type', 'link', 'title', 'content', 'excerpt', 'author',
    'featured_media', 'template', 'class_list', '_links', '_embedded'
  ];
  
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
    content: wpCPT.content.rendered,
    excerpt: wpCPT.excerpt?.rendered,
    date: wpCPT.date,
    modified: wpCPT.modified,
    author: wpCPT.author,
    featuredMedia: wpCPT.featured_media,
    link: wpCPT.link,
    type: wpCPT.type,
    status: wpCPT.status,
    template: wpCPT.template,
    classList: wpCPT.class_list,
    customFields: Object.keys(customFields).length > 0 ? customFields : undefined,
  };
}

/**
 * Fetch all items from a Custom Post Type
 * @param cptSlug The REST base slug of the CPT (e.g., 'popupbuilder', 'news-release')
 * @param perPage Number of items per request (default: 10)
 * @param page Page number (default: 1)
 */
export async function getCPTItems(cptSlug: string, perPage: number = 10, page: number = 1): Promise<CPT[]> {
  const url = `${WP_API_URL}/${cptSlug}?per_page=${perPage}&page=${page}&status=publish&_embed`;
  
  try {
    const response = await fetchWithAuth(url, {
      next: { revalidate: 60 }, // ISR: Revalidate every 60 seconds
    });

    const items: WordPressCPT[] = await response.json();
    return items.map(transformCPT);
  } catch (error) {
    console.error(`Error fetching ${cptSlug} items:`, error);
    return [];
  }
}

/**
 * Fetch all CPT items with embedded author, media, and taxonomy details
 * @param cptSlug The REST base slug of the CPT
 */
export async function getCPTItemsWithDetails(cptSlug: string): Promise<CPTWithDetails[]> {
  const url = `${WP_API_URL}/${cptSlug}?status=publish&_embed`;
  
  try {
    const response = await fetchWithAuth(url, {
      next: { revalidate: 60 },
    });

    const items: WordPressCPT[] = await response.json();
    
    return items.map((wpCPT) => {
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
        featuredMediaDetails: embedded?.['wp:featuredmedia']?.[0] as WordPressMedia | undefined,
        categoryDetails: categoryDetails.length > 0 ? categoryDetails : undefined,
        tagDetails: tagDetails.length > 0 ? tagDetails : undefined,
      } as CPTWithDetails;
    });
  } catch (error) {
    console.error(`Error fetching ${cptSlug} items with details:`, error);
    return [];
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
    const response = await fetchWithAuth(url, {
      next: { revalidate: 60 },
    });

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
      featuredMediaDetails: embedded?.['wp:featuredmedia']?.[0] as WordPressMedia | undefined,
      categoryDetails: categoryDetails.length > 0 ? categoryDetails : undefined,
      tagDetails: tagDetails.length > 0 ? tagDetails : undefined,
    } as CPTWithDetails;
  } catch (error) {
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
    const response = await fetchWithAuth(url, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    const items: WordPressCPT[] = await response.json();
    return items.map((item) => item.slug);
  } catch (error) {
    console.error(`Error fetching ${cptSlug} item slugs:`, error);
    return [];
  }
}