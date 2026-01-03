import { getPagesWithDetails } from '@/lib/wordpress/api';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Market Headlines - Latest News',
  description: 'Stay updated with the latest market news and headlines',
};

export const revalidate = 60; // Revalidate every 60 seconds

export default async function NewsPage() {
  const pages = await getPagesWithDetails();

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
            Market Headlines
          </h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            Latest news and insights from the financial markets
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {pages.map((page) => (
            <article
              key={page.id}
              className="group relative overflow-hidden rounded-lg border border-zinc-200 bg-white transition-shadow hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
            >
              <Link href={`/news/${page.slug}`}>
                {page.featuredMediaDetails?.source_url && (
                  <div className="relative aspect-video overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                    <Image
                      src={page.featuredMediaDetails.source_url}
                      alt={page.featuredMediaDetails.alt_text || page.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}

                <div className="p-6">
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

                  <h2 className="mt-2 text-xl font-semibold text-zinc-900 group-hover:text-zinc-600 dark:text-zinc-50 dark:group-hover:text-zinc-300">
                    {page.title}
                  </h2>

                  <div
                    className="mt-3 line-clamp-3 text-sm text-zinc-600 dark:text-zinc-400 [&>p]:m-0"
                    dangerouslySetInnerHTML={{ __html: page.excerpt }}
                  />

                  {page.authorDetails && (
                    <div className="mt-4 flex items-center gap-3">
                      {page.authorDetails.avatar_urls?.['48'] && (
                        <Image
                          src={page.authorDetails.avatar_urls['48']}
                          alt={page.authorDetails.name}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                      )}
                      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        {page.authorDetails.name}
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            </article>
          ))}
        </div>

        {pages.length === 0 && (
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-zinc-600 dark:text-zinc-400">
              No news articles available at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}