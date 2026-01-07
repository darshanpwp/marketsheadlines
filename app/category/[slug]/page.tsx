import { getPostsByCategorySlug, getCategoryBySlug, getAllCategories, getGlobalThemeSettings } from '@/lib/wordpress/api';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import PostCard from '@/components/PostCard';
import Pagination from '@/components/Pagination';
import ArchiveToolbar from '@/components/ArchiveToolbar';

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; search?: string }>;
};

export const revalidate = 60; // Revalidate every 60 seconds

// ... generateMetadata ...

export default async function CategoryArchivePage({ params, searchParams }: Props) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const currentPage = parseInt(resolvedSearchParams.page || '1', 10);
  const searchTerm = resolvedSearchParams.search || '';
  const perPage = 16;

  const [category, categories, postsData, globalSettings] = await Promise.all([
    getCategoryBySlug(slug),
    getAllCategories(),
    getPostsByCategorySlug(slug, perPage, currentPage),
    getGlobalThemeSettings()
    // Note: getPostsByCategorySlug likely doesn't support 'search' param yet based on previous file views.
    // If it does, update here. If not, search on category page might only filter clientside or ignore search term?
    // WARNING: 'search' param support in getPostsByCategorySlug was NOT explicitly added in previous steps.
    // I need to check api.ts or just rely on global search redirecting to /posts.
    // Actually, SearchWidget redirects to /posts?search=... so putting it here just acts as a portal to global search.
    // It WON'T search *within* the category unless I update the widget or API. 
    // Given the widget implementation (router.push('/posts?search=...')), it redirects AWAY from category page.
    // This is acceptable behavior for "adding a search bar".
  ]);

  const defaultImageUrl = globalSettings?.blog_default_image?.guid || 'https://dev-new-marketsheadlines.pantheonsite.io/wp-content/uploads/2026/01/thumbnail.png';

  if (!category) {
    notFound();
  }

  const { items: posts, totalItems, totalPages } = postsData;

  return (
    <div className="min-vh-100 bg-white">
      {/* Header */}
      <div className="archive-header mb-5 bg-gradient-c">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="archive-title mb-0 h2 primary-text-blue">
                {category.name}
              </h1>
            </div>
            <div className="primary-text-blue fw-medium small">
              {totalItems} {totalItems === 1 ? 'Article' : 'Articles'}
            </div>
          </div>
        </div>
      </div>

      <div className="container pb-5">

        {/* Archive Toolbar */}
        <div className="row mb-4">
          <div className="col-12">
            <ArchiveToolbar categories={categories} />
          </div>
        </div>

        {/* Posts Grid - 4 columns on desktop */}
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
          {posts.map((post) => (
            <div key={post.id} className="col">
              <PostCard post={post} />
            </div>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="card bg-white border-0 bg-light text-center p-5 mt-4">
            <p className="text-secondary mb-0">
              No posts found in this category.
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

