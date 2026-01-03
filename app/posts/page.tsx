import { getPostsWithDetails } from '@/lib/wordpress/api';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import PostCard from '@/components/PostCard';

export const metadata: Metadata = {
  title: 'All Posts - Market Headlines',
  description: 'Browse all posts and articles from Market Headlines',
};

export const revalidate = 60; // Revalidate every 60 seconds

export default async function PostsPage() {
  const posts = await getPostsWithDetails();

  // Extract unique categories and tags for filtering
  const allCategories = Array.from(
    new Map(
      posts
        .flatMap((post) => post.categoryDetails || [])
        .map((cat) => [cat.id, cat])
    ).values()
  ).sort((a, b) => a.name.localeCompare(b.name));

  const allTags = Array.from(
    new Map(
      posts
        .flatMap((post) => post.tagDetails || [])
        .map((tag) => [tag.id, tag])
    ).values()
  ).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="min-vh-100 bg-white">
      <div className="container py-5">
        <div className="mb-5">
          <h1 className="display-4 fw-bold mb-3">
            All Posts
          </h1>
          <p className="lead text-secondary">
            Browse all posts, articles, and news from Market Headlines
          </p>
        </div>

        {/* Filter Section */}
        {(allCategories.length > 0 || allTags.length > 0) && (
          <div className="mb-5">
            <div className="row g-3">
              {allCategories.length > 0 && (
                <div className="col-12 col-md-6">
                  <h3 className="h6 fw-semibold mb-3">Categories</h3>
                  <div className="d-flex flex-wrap gap-2">
                    {allCategories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/category/${category.slug}`}
                        className="badge bg-primary text-decoration-none px-3 py-2"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              {allTags.length > 0 && (
                <div className="col-12 col-md-6">
                  <h3 className="h6 fw-semibold mb-3">Tags</h3>
                  <div className="d-flex flex-wrap gap-2">
                    {allTags.map((tag) => (
                      <Link
                        key={tag.id}
                        href={`/tag/${tag.slug}`}
                        className="badge bg-secondary text-decoration-none px-3 py-2"
                      >
                        {tag.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Posts Grid */}
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
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
      </div>
    </div>
  );
}

