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
    <div className="min-vh-100 bg-white">
      <div className="container py-5">
        <div className="mb-5">
          <h1 className="display-4 fw-bold mb-3">
            Market Headlines
          </h1>
          <p className="lead text-secondary">
            Latest news and insights from the financial markets
          </p>
        </div>

        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {pages.map((page) => (
            <div key={page.id} className="col">
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
            </div>
          ))}
        </div>

        {pages.length === 0 && (
          <div className="card border-0 bg-light text-center p-5">
            <p className="text-secondary mb-0">
              No news articles available at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}