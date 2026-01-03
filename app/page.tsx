import Link from 'next/link';
import { getPagesWithDetails } from '@/lib/wordpress/api';
import Image from 'next/image';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  const pages = await getPagesWithDetails();
  const latestPages = pages.slice(0, 3); // Get latest 3 pages

  return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light">
      <main className="container py-5">
        <div className="text-center mb-5">
          <h1 className="display-3 fw-bold mb-3">
            Market Headlines
          </h1>
          <p className="lead text-secondary">
            Your source for the latest financial news and market insights
          </p>
        </div>

        <div className="d-flex gap-3 justify-content-center mb-5">
          <Link
            href="/news"
            className="btn btn-dark btn-lg px-4"
          >
            Browse News
          </Link>
          <a
            href="https://dev-new-marketsheadlines.pantheonsite.io"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline-dark btn-lg px-4"
          >
            WordPress Admin
          </a>
        </div>

        {latestPages.length > 0 && (
          <div className="mt-5">
            <h2 className="h3 fw-bold mb-4">Latest Headlines</h2>
            <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
              {latestPages.map((page) => (
                <div key={page.id} className="col">
                  <Link
                    href={`/news/${page.slug}`}
                    className="text-decoration-none"
                  >
                    <div className="card h-100 shadow-sm border-0">
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
                        <h3 className="card-title h6 fw-semibold mb-2">
                          {page.title}
                        </h3>
                        <div
                          className="card-text text-secondary small line-clamp-2"
                          dangerouslySetInnerHTML={{ __html: page.excerpt }}
                        />
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}