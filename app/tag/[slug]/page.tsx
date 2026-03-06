import { getPostsByTagSlug, getTagBySlug } from '@/lib/wordpress/api';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import PostCard from '@/components/PostCard';
import Pagination from '@/components/Pagination';

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export const revalidate = 60; // Revalidate every 60 seconds

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tag = await getTagBySlug(slug);

  if (!tag) {
    return {
      title: 'Tag Not Found',
    };
  }

  return {
    title: tag.name,
    description: tag.description || `Posts tagged with ${tag.name}`,
  };
}

export default async function TagArchivePage({ params, searchParams }: Props) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const currentPage = parseInt(resolvedSearchParams.page || '1', 10);
  const perPage = 16;

  const tag = await getTagBySlug(slug);

  if (!tag) {
    notFound();
  }

  const { items: posts, totalItems, totalPages } = await getPostsByTagSlug(slug, perPage, currentPage);

  return (
    <div className="min-vh-100 bg-white">
      {/* Redesigned Header */}
      <div className="archive-header mb-5 bg-gradient-c">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="archive-title mb-0 h2 primary-text-blue">
                Tag: {tag.name}
              </h1>
            </div>
            <div className="primary-text-blue fw-medium small">
              {totalItems} {totalItems === 1 ? 'Article' : 'Articles'}
            </div>
          </div>
        </div>
      </div>

      <div className="container pb-5">
        {/* Posts Grid - Responsive layout */}
        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-4">
          {posts.map((post) => (
            <div key={post.id} className="col">
              <PostCard post={post} />
            </div>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="card border-0 bg-light text-center p-5">
            <p className="text-secondary mb-0">
              No posts found with this tag.
            </p>
          </div>
        )}

        {/* Pagination UI */}
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
        />
      </div>
    </div>
  );
}

