import { getPagesWithDetails } from '@/lib/wordpress/api';
import { Metadata } from 'next';
import NewsCard from '@/components/NewsCard';
import Pagination from '@/components/Pagination';

export const metadata: Metadata = {
  title: 'Market Headlines - Latest News',
  description: 'Stay updated with the latest market news and headlines',
};

export const revalidate = 60; // Revalidate every 60 seconds

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

import ArchiveSidebar from '@/components/ArchiveSidebar';

export default async function NewsPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const currentPage = parseInt(resolvedParams.page || '1', 10);
  const perPage = 16; // Kept high for grid presence

  const { items: pages, totalItems, totalPages } = await getPagesWithDetails(perPage, currentPage);

  return (
    <div className="min-vh-100 bg-white">
      {/* Refined Header */}
      <div className="archive-header border-bottom mb-5 bg-light">
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-md-6">
              <span className="badge bg-primary rounded-pill px-3 py-2 mb-3 fw-bold shadow-sm">News Archive</span>
              <h1 className="display-4 fw-bold mb-2 text-dark font-serif">
                Market Headlines
              </h1>
              <p className="lead text-muted mb-0">
                Comprehensive coverage of global financial markets
              </p>
            </div>
            <div className="col-md-6 text-md-end mt-4 mt-md-0">
              <div className="d-inline-flex align-items-center bg-white rounded-pill px-4 py-2 shadow-sm border">
                <span className="fw-bold text-dark me-2">{totalItems}</span>
                <span className="text-muted small text-uppercase tracking-wider">Articles Available</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container pb-5">
        <div className="row g-5">
          {/* Main Content Column */}
          <div className="col-lg-8">
            <div className="row row-cols-1 row-cols-md-2 g-4">
              {pages.map((page) => (
                <div key={page.id} className="col">
                  <NewsCard page={page} />
                </div>
              ))}
            </div>

            {pages.length === 0 && (
              <div className="card border-0 bg-light text-center p-5 rounded-4">
                <div className="py-5">
                  <i className="fa-regular fa-folder-open fa-3x text-secondary opacity-25 mb-3"></i>
                  <h3 className="h5 text-secondary fw-bold">No articles found</h3>
                  <p className="text-muted small mb-0">Try adjusting your filters or check back later.</p>
                </div>
              </div>
            )}

            {/* Pagination UI */}
            <div className="mt-5 pt-3 border-top">
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
              />
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="col-lg-4">
            <ArchiveSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}
