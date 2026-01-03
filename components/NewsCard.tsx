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
    <article className="card h-100 shadow-sm border-0">
      <Link href={`/news/${page.slug}`} className="text-decoration-none">
        {page.featuredMediaDetails?.source_url && (
          <div className="position-relative aspect-video overflow-hidden">
            <Image
              src={page.featuredMediaDetails.source_url}
              alt={page.featuredMediaDetails.alt_text || page.title}
              fill
              className="object-fit-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}

        <div className="card-body">
          <div className="d-flex align-items-center gap-2 text-secondary small mb-2">
            <time dateTime={page.date}>{formatDate(page.date)}</time>
            <span>•</span>
            <span>{readingTime} min read</span>
          </div>

          <h2 className="card-title h5 fw-semibold mb-3 text-dark">
            {page.title}
          </h2>

          <div
            className="card-text text-secondary small line-clamp-3"
            dangerouslySetInnerHTML={{ __html: page.excerpt }}
          />

          {page.authorDetails && (
            <div className="d-flex align-items-center gap-2 mt-3">
              {page.authorDetails.avatar_urls?.['48'] && (
                <Image
                  src={page.authorDetails.avatar_urls['48']}
                  alt={page.authorDetails.name}
                  width={32}
                  height={32}
                  className="rounded-circle"
                />
              )}
              <span className="small fw-medium">
                {page.authorDetails.name}
              </span>
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}