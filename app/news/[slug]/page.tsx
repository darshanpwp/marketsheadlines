import { getPageBySlug, getAllPageSlugs } from '@/lib/wordpress/api';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';

type Props = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 60; // Revalidate every 60 seconds

// Generate static params for all pages
export async function generateStaticParams() {
  const slugs = await getAllPageSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    return {
      title: 'Page Not Found',
    };
  }

  return {
    title: `${page.title} - Market Headlines`,
    description: page.excerpt.replace(/<[^>]*>/g, '').substring(0, 160),
    openGraph: {
      title: page.title,
      description: page.excerpt.replace(/<[^>]*>/g, '').substring(0, 160),
      images: page.featuredMediaDetails?.source_url
        ? [page.featuredMediaDetails.source_url]
        : [],
    },
  };
}

export default async function NewsArticlePage({ params }: Props) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return (
    <div className="min-vh-100 bg-white">
      <article className="container py-5" style={{ maxWidth: '800px' }}>
        {/* Back to news link */}
        <Link
          href="/news"
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
          Back to News
        </Link>

        {/* Article header */}
        <header className="mb-4">
          <time
            dateTime={page.date}
            className="d-block small text-secondary mb-2"
          >
            {new Date(page.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>

          <h1 className="display-4 fw-bold mb-3">
            {page.title}
          </h1>

          <div
            className="lead text-secondary"
            dangerouslySetInnerHTML={{ __html: page.excerpt }}
          />

          {page.authorDetails && (
            <div className="d-flex align-items-center gap-3 border-top border-bottom py-3 mt-4">
              {page.authorDetails.avatar_urls?.['96'] && (
                <Image
                  src={page.authorDetails.avatar_urls['96']}
                  alt={page.authorDetails.name}
                  width={48}
                  height={48}
                  className="rounded-circle"
                />
              )}
              <div>
                <p className="fw-medium mb-0">
                  {page.authorDetails.name}
                </p>
                {page.authorDetails.description && (
                  <p className="small text-secondary mb-0">
                    {page.authorDetails.description}
                  </p>
                )}
              </div>
            </div>
          )}
        </header>

        {/* Featured image */}
        {page.featuredMediaDetails?.source_url && (
          <div className="position-relative aspect-video overflow-hidden rounded mb-4">
            <Image
              src={page.featuredMediaDetails.source_url}
              alt={page.featuredMediaDetails.alt_text || page.title}
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
          dangerouslySetInnerHTML={{ __html: page.content }}
        />

        {/* Footer */}
        <footer className="border-top pt-4 mt-5">
          <div className="d-flex align-items-center justify-content-between">
            <time
              dateTime={page.modified}
              className="small text-secondary"
            >
              Last updated: {new Date(page.modified).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>

            <Link
              href="/news"
              className="small fw-medium text-dark text-decoration-none"
            >
              View all articles →
            </Link>
          </div>
        </footer>
      </article>
    </div>
  );
}