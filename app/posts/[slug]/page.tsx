import { getPostBySlug, getAllPostSlugs } from '@/lib/wordpress/api';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';

type Props = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 60; // Revalidate every 60 seconds

// Generate static params for all posts
export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const description = post.excerpt.replace(/<[^>]*>/g, '').substring(0, 160);

  return {
    title: `${post.title} - Market Headlines`,
    description,
    openGraph: {
      title: post.title,
      description,
      images: post.featuredMediaDetails?.source_url
        ? [post.featuredMediaDetails.source_url]
        : [],
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.modified,
      authors: post.authorDetails?.name ? [post.authorDetails.name] : undefined,
      tags: post.tagDetails?.map((tag) => tag.name),
    },
  };
}

export default async function PostDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-vh-100 bg-white">
      <article className="container py-5" style={{ maxWidth: '800px' }}>
        {/* Back to posts link */}
        <Link
          href="/posts"
          className="d-inline-flex align-items-center gap-2 text-secondary text-decoration-none mb-4 small fw-medium"
        >
          <svg
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Posts
        </Link>

        {/* Article header */}
        <header className="mb-4">
          <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
            <time
              dateTime={post.date}
              className="small text-secondary"
            >
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            {post.sticky && (
              <span className="badge bg-warning text-dark">Featured</span>
            )}
          </div>

          <h1 className="display-4 fw-bold mb-3">
            {post.title}
          </h1>

          <div
            className="lead text-secondary"
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
                >
                  {category.name}
                </Link>
              ))}
              {post.tagDetails?.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/tag/${tag.slug}`}
                  className="badge bg-secondary text-decoration-none"
                >
                  {tag.name}
                </Link>
              ))}
            </div>
          ) : null}

          {post.authorDetails && (
            <div className="d-flex align-items-center gap-3 border-top border-bottom py-3 mt-4">
              {post.authorDetails.avatar_urls?.['96'] && (
                <Image
                  src={post.authorDetails.avatar_urls['96']}
                  alt={post.authorDetails.name}
                  width={48}
                  height={48}
                  className="rounded-circle"
                />
              )}
              <div>
                <p className="fw-medium mb-0">
                  {post.authorDetails.name}
                </p>
                {post.authorDetails.description && (
                  <p className="small text-secondary mb-0">
                    {post.authorDetails.description}
                  </p>
                )}
              </div>
            </div>
          )}
        </header>

        {/* Featured image */}
        {post.featuredMediaDetails?.source_url && (
          <div className="position-relative aspect-video overflow-hidden rounded mb-4">
            <Image
              src={post.featuredMediaDetails.source_url}
              alt={post.featuredMediaDetails.alt_text || post.title}
              fill
              className="object-fit-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
            />
          </div>
        )}

        {/* Article content */}
        <div
          className="article-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Footer */}
        <footer className="border-top pt-4 mt-5">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
            <time
              dateTime={post.modified}
              className="small text-secondary"
            >
              Last updated: {new Date(post.modified).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>

            <Link
              href="/posts"
              className="small fw-medium text-dark text-decoration-none"
            >
              View all posts →
            </Link>
          </div>
        </footer>
      </article>
    </div>
  );
}

