import Link from 'next/link';
import { getPagesWithDetails } from '@/lib/wordpress/api';
import Image from 'next/image';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  const pages = await getPagesWithDetails();
  const latestPages = pages.slice(0, 3); // Get latest 3 pages

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-black">
      <main className="flex w-full max-w-6xl flex-col items-center px-6 py-16 sm:px-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-6xl">
            Market Headlines
          </h1>
          <p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Your source for the latest financial news and market insights
          </p>
        </div>

        <div className="mt-10 flex gap-4">
          <Link
            href="/news"
            className="rounded-lg bg-zinc-900 px-6 py-3 font-semibold text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Browse News
          </Link>
          <a
            href="https://dev-new-marketsheadlines.pantheonsite.io"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-zinc-300 px-6 py-3 font-semibold text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-900"
          >
            WordPress Admin
          </a>
        </div>

        {latestPages.length > 0 && (
          <div className="mt-16 w-full">
            <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              Latest Headlines
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latestPages.map((page) => (
                <Link
                  key={page.id}
                  href={`/news/${page.slug}`}
                  className="group relative overflow-hidden rounded-lg border border-zinc-200 bg-white transition-shadow hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
                >
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
                  <div className="p-4">
                    <h3 className="font-semibold text-zinc-900 group-hover:text-zinc-600 dark:text-zinc-50 dark:group-hover:text-zinc-300">
                      {page.title}
                    </h3>
                    <div
                      className="mt-2 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400 [&>p]:m-0"
                      dangerouslySetInnerHTML={{ __html: page.excerpt }}
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}