'use client';

import Link from 'next/link';
import Image from 'next/image';
import { PostWithDetails } from '@/types/wordpress';
import { formatDate, calculateReadingTime } from '@/lib/utils';

interface PostCardProps {
  post: PostWithDetails;
  showExcerpt?: boolean;
  filterCategory?: string;
}

export default function PostCard({ post, showExcerpt = false, filterCategory }: PostCardProps) {
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

  return (
    <article className="card h-100 shadow-sm border-0 hover-lift overflow-hidden">
      {/* Image Link */}
      <div className="position-relative">
        <Link href={`/posts/${post.slug}`} className="text-decoration-none">
          <div className="position-relative aspect-video overflow-hidden">
            <Image
              src={post.featuredMediaDetails?.source_url || 'https://dev-new-marketsheadlines.pantheonsite.io/wp-content/uploads/2026/01/thumbnail.png'}
              alt={post.featuredMediaDetails?.alt_text || post.title}
              fill
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

      <div className="card-body p-3">
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
          <span>{readingTime} min read</span>
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

