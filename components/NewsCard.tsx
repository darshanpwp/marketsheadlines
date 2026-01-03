import Link from 'next/link';
import Image from 'next/image';
import { PageWithDetails } from '@/types/wordpress';
import { formatDate, calculateReadingTime } from '@/lib/utils';

interface NewsCardProps {
  page: PageWithDetails;
}

export default function NewsCard({ page }: NewsCardProps) {
  const readingTime = calculateReadingTime(page.content);

  return (
    <article className="group relative overflow-hidden rounded-lg border border-zinc-200 bg-white transition-shadow hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
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
          <div className="flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
            <time dateTime={page.date}>{formatDate(page.date)}</time>
            <span>•</span>
            <span>{readingTime} min read</span>
          </div>

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
  );
}