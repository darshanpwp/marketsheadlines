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
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Back to news link */}
        <Link
          href="/news"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          <svg
            className="h-4 w-4"
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
        <header className="mb-8">
          <time
            dateTime={page.date}
            className="text-sm text-zinc-500 dark:text-zinc-400"
          >
            {new Date(page.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>

          <h1 className="mt-2 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
            {page.title}
          </h1>

          <div
            className="mt-4 text-xl text-zinc-600 dark:text-zinc-400 [&>p]:m-0"
            dangerouslySetInnerHTML={{ __html: page.excerpt }}
          />

          {page.authorDetails && (
            <div className="mt-6 flex items-center gap-3 border-y border-zinc-200 py-4 dark:border-zinc-800">
              {page.authorDetails.avatar_urls?.['96'] && (
                <Image
                  src={page.authorDetails.avatar_urls['96']}
                  alt={page.authorDetails.name}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              )}
              <div>
                <p className="font-medium text-zinc-900 dark:text-zinc-50">
                  {page.authorDetails.name}
                </p>
                {page.authorDetails.description && (
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {page.authorDetails.description}
                  </p>
                )}
              </div>
            </div>
          )}
        </header>

        {/* Featured image */}
        {page.featuredMediaDetails?.source_url && (
          <div className="relative mb-8 aspect-video overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
            <Image
              src={page.featuredMediaDetails.source_url}
              alt={page.featuredMediaDetails.alt_text || page.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
            />
          </div>
        )}

        {/* Article content */}
        <div
          className="prose prose-zinc max-w-none dark:prose-invert prose-headings:font-bold prose-a:text-zinc-900 prose-a:no-underline hover:prose-a:underline dark:prose-a:text-zinc-50"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />

        {/* Footer */}
        <footer className="mt-12 border-t border-zinc-200 pt-8 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <time
              dateTime={page.modified}
              className="text-sm text-zinc-500 dark:text-zinc-400"
            >
              Last updated: {new Date(page.modified).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>

            <Link
              href="/news"
              className="text-sm font-medium text-zinc-900 hover:underline dark:text-zinc-50"
            >
              View all articles →
            </Link>
          </div>
        </footer>
      </article>
    </div>
  );
}