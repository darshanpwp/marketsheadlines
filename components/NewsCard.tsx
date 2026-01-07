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
    <article className="card h-100 shadow-sm border-0 hover-lift overflow-hidden">
      <Link href={`/news/${page.slug}`} className="text-decoration-none">
        <div className="position-relative aspect-video overflow-hidden">
          <Image
            src={page.featuredMediaDetails?.source_url || 'https://dev-new-marketsheadlines.pantheonsite.io/wp-content/uploads/2026/01/thumbnail.png'}
            alt={page.featuredMediaDetails?.alt_text || page.title}
            fill
            className="object-fit-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        </div>
      </Link>

      <div className="card-body p-3 bg-white">
        <Link href={`/news/${page.slug}`} className="text-decoration-none">
          <h2 className="h6 fw-bold mb-2 text-dark hover-primary transition-all line-clamp-2" style={{ lineHeight: '1.4' }}>
            {page.title}
          </h2>
        </Link>

        <div className="d-flex align-items-center gap-2 text-secondary small" style={{ fontSize: '0.75rem' }}>
          {page.authorDetails && (
            <span className="fw-medium text-secondary">
              {page.authorDetails.name}
            </span>
          )}
          <span>•</span>
          <span>{readingTime} min read</span>
        </div>
      </div>
    </article>
  );
}