import { getPostsWithDetails } from '@/lib/wordpress/api';
import { Metadata } from 'next';
import PostCard from '@/components/PostCard';
import Pagination from '@/components/Pagination';

export const metadata: Metadata = {
  title: 'All Posts - Market Headlines',
  description: 'Browse all posts and articles from Market Headlines',
};

export const revalidate = 60; // Revalidate every 60 seconds

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function PostsPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const currentPage = parseInt(resolvedParams.page || '1', 10);
  const perPage = 16;

  const { items: posts, totalItems, totalPages } = await getPostsWithDetails(perPage, currentPage);

  return (
    <div className="min-vh-100 bg-white">
      {/* Redesigned Header */}
      <div className="archive-header mb-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="archive-title mb-0 h2">
                World News
              </h1>
            </div>
            <div className="text-secondary fw-medium small">
              {totalItems} {totalItems === 1 ? 'Article' : 'Articles'}
            </div>
          </div>
        </div>
      </div>

      <div className="container pb-5">
        {/* Posts Grid - 4 columns on desktop */}
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
          {posts.map((post) => (
            <div key={post.id} className="col">
              <PostCard post={post} />
            </div>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="card border-0 bg-light text-center p-5">
            <p className="text-secondary mb-0">
              No posts available at the moment.
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

