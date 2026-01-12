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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  yoast_head_json?: any;
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export interface WordPressSearchResult {
  id: number;
  title: string;
  slug: string;
  type: string;
}

/**
 * Represents Global Theme Settings from custom Pods endpoint.
 */
export interface GlobalThemeSettings {
  footer_logo?: {
    guid: string;
    alt?: string;
  };
  footer_sub_title?: string;
  footer_copyright?: string;
  social_media_urls?: string[];
  blog_default_image?: {
    guid: string;
    ID: string;
  };
  // New Global CTA Section
  single_post_cta_heading?: string;
  single_post_cta_description?: string;
  subscribe_to_newsletter_button_text?: string;
  subscribe_to_newsletter_button_url?: string;
  register_for_market_access_button_text?: string;
  register_for_market_access_button_url?: string;
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
  seo?: {
    title: string;
    description: string;
    og_title: string;
    og_description: string;
    og_image: Array<{ url: string }>;
    twitter_image: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: any;
  };
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      _links?: any;
    }>>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    replies?: any[];
  };
  class_list?: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  yoast_head_json?: any;
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
  seo?: {
    title: string;
    description: string;
    og_title: string;
    og_description: string;
    og_image: Array<{ url: string }>;
    twitter_image: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: any;
  };
  customReadingTime?: string;
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      _links?: any;
    }>>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any; // Allow for custom embedded data
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

/**
 * Represents a Single Menu Item returned by the menus API.
 */
export interface WordPressMenuItem {
  /** Unique ID of the menu item (post ID of the nav_menu_item). */
  ID: number;
  /** Display title of the menu item. */
  title: string;
  /** URL the menu item points to. */
  url: string;
  /** ID of the parent menu item (0 if top-level). */
  menu_item_parent: string;
  /** CSS classes associated with the menu item. */
  classes: string[];
  /** Target attribute for the link (e.g., '_blank'). */
  target: string;
  /** Title attribute for the link. */
  attr_title: string;
  /** Description of the menu item. */
  description: string;
  /** URL slug of the linked object. */
  slug: string;
  /** Type of object (e.g., 'page', 'custom', 'post'). */
  object: string;
  /** Unique ID of the linked object. */
  object_id: string;
  /** Nested child menu items. */
  child_items?: WordPressMenuItem[];
}

/**
 * Represents a Menu object with its items.
 */
export interface WordPressMenu {
  /** Unique ID of the menu term. */
  term_id: number;
  /** Display name of the menu. */
  name: string;
  /** URL slug of the menu. */
  slug: string;
  /** Number of items in the menu. */
  count: number;
  /** Array of menu items. */
  items: WordPressMenuItem[];
}
/**
 * Paginated response wrapper for WordPress API
 */
export interface PaginatedResponse<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
}

export interface SiteIdentity {
  title: string;
  description: string;
  logoUrl: string | null;
}

/**
 * Represents custom site settings for MarketHeadlines.
 */
export interface MarketHeadlinesSettings {
  name: string;
  description: string;
  url: string;
  logo?: string;
  footer_logo?: string;
  footer_title: string;
  footer_sub_title: string;
  footer_copyright: string;
  social: string[];
}

export interface HomePageSection {
  title: string;
  view_all_url: string;
  posts: PostWithDetails[];
}

export interface HomePageData {
  market_intelligence_heading: string;
  market_intelligence_main_heading: string;
  market_intelligence_description: string;
  market_intelligence_features_text: string[];
  get_market_intelligence_button_text: string;
  get_market_intelligence_button_url: string;
  explore_coverage_button_text: string;
  explore_coverage_button_url: string;
  market_intelligence_image: string;
  // Investors Section
  for_investors_organizations_heading: string;
  for_investors_organizations_main_heading: string;
  for_investors_organizations_description: string;
  for_investors_organizations_features: Array<{
    id: string | number;
    title: string;
    description: string;
    image: string | null;
  }>;
  request_a_quote_button_text: string;
  request_a_quote_button_url: string;
  register_for_access_button_text: string;
  register_for_access_button_url: string;
  // Newsletter Section
  show_newsletter_section: string;
  newsletter_heading: string;
  newsletter_description: string;
  default_daily_market_brief: string;
  default_weekly_deep_dive: string;
  default_breaking_news_alerts?: string;
  // Dynamic Content Sections
  trending_now_section?: HomePageSection;
  world_news_grid_section?: HomePageSection;
  world_news_list_section?: HomePageSection;
  business_section?: HomePageSection;
}

export interface MarketTicker {
  symbol: string;
  name: string;
  price: number;
  change: number;
  change_percent: number;
  market?: string;
  currency?: string;
}

export interface WordPressRestSettings {
  title: string;
  description: string;
  page_for_posts: number;
}
