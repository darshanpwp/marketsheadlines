'use client';

import { useState } from 'react';

import Link from 'next/link';
import Image from 'next/image';
import { PostWithDetails } from '@/types/wordpress';
import { formatDate, calculateReadingTime } from '@/lib/utils';
import { DEFAULT_POST_IMAGE } from '@/lib/constants';

interface PostCardProps {
  post: PostWithDetails;
  showExcerpt?: boolean;
  filterCategory?: string;
  defaultImageUrl?: string;
}

export default function PostCard({ post, showExcerpt = false, filterCategory, defaultImageUrl }: PostCardProps) {
  const readingTime = calculateReadingTime(post.content);

  // Determine which category to display
  let displayCategory = post.categoryDetails?.[0];
  if (filterCategory && post.categoryDetails) {
    const filtered = post.categoryDetails.find(cat =>
      cat.name.toLowerCase().includes(filterCategory.toLowerCase())
    );
    if (filtered) {
      displayCategory = filtered;
    }
  }

  // Use dynamic default image or hardcoded fallback as last resort
  const fallbackImage = defaultImageUrl || DEFAULT_POST_IMAGE;

  // Try to use a smaller image size (medium_large or medium) to improve load time
  const mediaDetails = post.featuredMediaDetails?.media_details?.sizes;
  const bestImage = mediaDetails?.['medium_large']?.source_url
    || mediaDetails?.['medium']?.source_url
    || mediaDetails?.['large']?.source_url
    || post.featuredMediaDetails?.source_url
    || fallbackImage;

  // State to handle image loading errors (404s, etc)
  const [imgSrc, setImgSrc] = useState(bestImage);

  return (
    <article className="card bg-white h-100 shadow-sm border-0 hover-lift overflow-hidden" suppressHydrationWarning>
      {/* Image Link */}
      <div className="position-relative">
        <Link href={`/posts/${post.slug}`} className="text-decoration-none">
          <div className="position-relative aspect-video overflow-hidden">
            <Image
              src={imgSrc}
              onError={(e) => {
                console.error('Image load error for:', imgSrc);
                setImgSrc(fallbackImage);
              }}
              alt={post.featuredMediaDetails?.alt_text || post.title}
              fill
              unoptimized={true} // Bypass Next.js optimization to prevent server timeouts
              className="object-fit-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          </div>
        </Link>

        {/* Floating Category Badge */}
        {displayCategory && (
          <Link
            href={`/category/${displayCategory.slug}`}
            className="badge rounded-pill px-3 py-2 small badge-floating primary-text-blue bg-white text-decoration-none shadow-sm"
          >
            {displayCategory.name}
          </Link>
        )}
      </div>

      <div className="card-body p-3 bg-white">
        {/* Title Link */}
        <Link href={`/posts/${post.slug}`} className="text-decoration-none">
          <h2
            className="h6 text-font-family mb-2 transition-all line-clamp-2 card-title-link"
            dangerouslySetInnerHTML={{ __html: post.title }}
          />
        </Link>

        {/* Optional Excerpt */}
        {showExcerpt && (
          <div
            className="small text-secondary mb-3 line-clamp-3"
            dangerouslySetInnerHTML={{ __html: post.excerpt || '' }}
          />
        )}

        {/* Meta Info */}
        <div className="d-flex align-items-center gap-2 small card-meta-row">
          {post.authorDetails && (
            <span className="fw-medium">
              {post.authorDetails.name}
            </span>
          )}
          <span>•</span>
          {post.customReadingTime ? (
            <span>{post.customReadingTime}</span>
          ) : (
            <span>{readingTime} min read</span>
          )}
          {post.sticky && (
            <>
              <span>•</span>
              <span className="fw-bold card-featured-tag">Featured</span>
            </>
          )}
        </div>
      </div>
    </article>
  );
}

