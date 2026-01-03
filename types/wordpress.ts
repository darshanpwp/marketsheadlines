// WordPress REST API Types

/**
 * Represents a Page object returned by the WordPress REST API.
 */
export interface WordPressPage {
  id: number;
  date: string;
  date_gmt: string;
  guid: {
    rendered: string;
  };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  featured_media: number;
  parent: number;
  menu_order: number;
  comment_status: string;
  ping_status: string;
  template: string;
  meta: {
    footnotes: string;
  };
  class_list: string[];
  _links: WordPressLinks;
  _embedded?: {
    author?: WordPressUser[];
    'wp:featuredmedia'?: WordPressMedia[];
  };
}

/**
 * Standard HAL links embedded in WordPress REST API responses.
 */
export interface WordPressLinks {
  self: LinkItem[];
  collection: LinkItem[];
  about: LinkItem[];
  author: EmbeddableLink[];
  replies: EmbeddableLink[];
  'version-history': LinkItem[];
  'predecessor-version': PredecessorLink[];
  'wp:featuredmedia': EmbeddableLink[];
  'wp:attachment': LinkItem[];
  curies: CurieLink[];
}

interface LinkItem {
  href: string;
  targetHints?: {
    allow: string[];
  };
}

interface EmbeddableLink extends LinkItem {
  embeddable: boolean;
}

interface PredecessorLink extends LinkItem {
  id: number;
}

interface CurieLink {
  name: string;
  href: string;
  templated: boolean;
}

/**
 * Represents a Media object (attachment) returned by the WordPress REST API.
 */
export interface WordPressMedia {
  id: number;
  date: string;
  date_gmt: string;
  guid: {
    rendered: string;
  };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  description?: {
    rendered: string;
  };
  author: number;
  post?: number | null; // The parent post ID
  class_list?: string[];
  caption: {
    rendered: string;
  };
  alt_text: string;
  media_type: string;
  mime_type: string;
  media_details: {
    width: number;
    height: number;
    file: string;
    filesize?: number;
    sizes: {
      [key: string]: MediaSize;
    };
    image_meta: {
      [key: string]: any;
    };
  };
  source_url: string;
}

interface MediaSize {
  file: string;
  width: number;
  height: number;
  mime_type: string;
  source_url: string;
}

/**
 * Represents a User object returned by the WordPress REST API.
 */
export interface WordPressUser {
  id: number;
  name: string;
  url: string;
  description: string;
  link: string;
  slug: string;
  avatar_urls: {
    [key: string]: string;
  };
}

/**
 * Represents a Category object returned by the WordPress REST API.
 */
export interface WordPressCategory {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  parent: number;
  meta: any[];
  _links: WordPressLinks;
}

/**
 * Represents a Tag object returned by the WordPress REST API.
 */
export interface WordPressTag {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  meta: any[];
  _links: WordPressLinks;
}

/**
 * Represents generic Site Settings returned by a custom endpoint.
 */
export interface WordPressSite {
  name: string;
  description: string;
  url: string;
  logo: string;
}

/**
 * Represents a Search Result object returned by the REST API (or custom endpoint).
 */
export interface WordPressSearchResult {
  id: number;
  title: string;
  slug: string;
  type: string;
}

// Simplified types for frontend consumption

/**
 * Simplified Page interface for internal application use.
 */
export interface Page {
  id: number;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  date: string;
  modified: string;
  author: number;
  featuredMedia: number;
  link: string;
}

/**
 * Simplified Page with embedded details (author and featured media).
 */
export interface PageWithDetails extends Page {
  authorDetails?: WordPressUser;
  featuredMediaDetails?: WordPressMedia;
}

// WordPress Post Types

/**
 * Represents a Post object returned by the WordPress REST API.
 */
export interface WordPressPost {
  id: number;
  date: string;
  date_gmt: string;
  guid: {
    rendered: string;
  };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  featured_media: number;
  comment_status: string;
  ping_status: string;
  sticky: boolean;
  template: string;
  format: string;
  meta: {
    footnotes: string;
    [key: string]: any;
  };
  categories: number[];
  tags: number[];
  _links: WordPressLinks;
  _embedded?: {
    author?: WordPressUser[];
    'wp:featuredmedia'?: WordPressMedia[];
    'wp:term'?: Array<Array<{
      id: number;
      link: string;
      name: string;
      slug: string;
      taxonomy: string;
      _links?: any;
    }>>;
    replies?: any[];
  };
  class_list?: string[];
}

// Simplified types for frontend consumption

/**
 * Simplified Post interface for internal application use.
 */
export interface Post {
  id: number;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  date: string;
  modified: string;
  author: number;
  featuredMedia: number;
  link: string;
  categories: number[];
  tags: number[];
  format: string;
  sticky: boolean;
  commentStatus: string;
}

/**
 * Simplified Post with embedded details (author, media, categories, tags).
 */
export interface PostWithDetails extends Post {
  authorDetails?: WordPressUser;
  featuredMediaDetails?: WordPressMedia;
  categoryDetails?: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  tagDetails?: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
}

// Custom Post Type (CPT) Types

/**
 * Represents a Custom Post Type object returned by the WordPress REST API.
 */
export interface WordPressCPT {
  id: number;
  date: string;
  date_gmt: string;
  guid: {
    rendered: string;
  };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt?: {
    rendered: string;
    protected: boolean;
  };
  author?: number;
  featured_media?: number;
  template?: string;
  class_list?: string[];
  _links?: WordPressLinks;
  _embedded?: {
    author?: WordPressUser[];
    'wp:featuredmedia'?: WordPressMedia[];
    'wp:term'?: Array<Array<{
      id: number;
      link: string;
      name: string;
      slug: string;
      taxonomy: string;
      _links?: any;
    }>>;
    [key: string]: any; // Allow for custom embedded data
  };
  [key: string]: any; // Allow for custom fields
}

// Simplified CPT type for frontend consumption

/**
 * Simplified CPT interface for internal application use.
 */
export interface CPT {
  id: number;
  slug: string;
  title: string;
  content: string;
  excerpt?: string;
  date: string;
  modified: string;
  author?: number;
  featuredMedia?: number;
  link: string;
  type: string;
  status: string;
  template?: string;
  classList?: string[];
  customFields?: Record<string, any>;
}

/**
 * Simplified CPT with embedded details.
 */
export interface CPTWithDetails extends CPT {
  authorDetails?: WordPressUser;
  featuredMediaDetails?: WordPressMedia;
  categoryDetails?: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  tagDetails?: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
}