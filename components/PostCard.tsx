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
    <article className="card h-100 shadow-sm border-0">
      <Link href={`/posts/${post.slug}`} className="text-decoration-none">
        {post.featuredMediaDetails?.source_url && (
          <div className="position-relative aspect-video overflow-hidden">
            <Image
              src={post.featuredMediaDetails.source_url}
              alt={post.featuredMediaDetails.alt_text || post.title}
              fill
              className="object-fit-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}

        <div className="card-body">
          <div className="d-flex align-items-center gap-2 text-secondary small mb-2 flex-wrap">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span>•</span>
            <span>{readingTime} min read</span>
            {post.sticky && (
              <>
                <span>•</span>
                <span className="badge bg-warning text-dark">Featured</span>
              </>
            )}
          </div>

          <h2 className="card-title h5 fw-semibold mb-3 text-dark">
            {post.title}
          </h2>

          <div
            className="card-text text-secondary small line-clamp-3"
            dangerouslySetInnerHTML={{ __html: post.excerpt }}
          />

          {/* Categories and Tags */}
          {(post.categoryDetails && post.categoryDetails.length > 0) || 
           (post.tagDetails && post.tagDetails.length > 0) ? (
            <div className="d-flex flex-wrap gap-2 mt-3">
              {post.categoryDetails?.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="badge bg-primary text-decoration-none"
                  onClick={(e) => e.stopPropagation()}
                >
                  {category.name}
                </Link>
              ))}
              {post.tagDetails?.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/tag/${tag.slug}`}
                  className="badge bg-secondary text-decoration-none"
                  onClick={(e) => e.stopPropagation()}
                >
                  {tag.name}
                </Link>
              ))}
            </div>
          ) : null}

          {post.authorDetails && (
            <div className="d-flex align-items-center gap-2 mt-3">
              {post.authorDetails.avatar_urls?.['48'] && (
                <Image
                  src={post.authorDetails.avatar_urls['48']}
                  alt={post.authorDetails.name}
                  width={32}
                  height={32}
                  className="rounded-circle"
                />
              )}
              <span className="small fw-medium">
                {post.authorDetails.name}
              </span>
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}

