// WordPress REST API Types

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
  author: number;
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

// Simplified types for frontend consumption
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

export interface PageWithDetails extends Page {
  authorDetails?: WordPressUser;
  featuredMediaDetails?: WordPressMedia;
}