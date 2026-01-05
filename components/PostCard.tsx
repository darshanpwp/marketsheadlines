'use client';

import Link from 'next/link';
import Image from 'next/image';
import { PostWithDetails } from '@/types/wordpress';
import { formatDate, calculateReadingTime } from '@/lib/utils';

interface PostCardProps {
  post: PostWithDetails;
}

export default function PostCard({ post }: PostCardProps) {
  const readingTime = calculateReadingTime(post.content);

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
        {post.categoryDetails?.[0] && (
          <Link
            href={`/category/${post.categoryDetails[0].slug}`}
            className="badge badge-floating text-white text-decoration-none shadow-sm"
          >
            {post.categoryDetails[0].name}
          </Link>
        )}
      </div>

      <div className="card-body p-3">
        {/* Title Link */}
        <Link href={`/posts/${post.slug}`} className="text-decoration-none">
          <h2
            className="h6 fw-bold mb-2 transition-all line-clamp-2 card-title-link"
            dangerouslySetInnerHTML={{ __html: post.title }}
          />
        </Link>

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

