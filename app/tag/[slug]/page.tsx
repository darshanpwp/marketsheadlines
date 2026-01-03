import { getPostsByTagSlug, getTagBySlug } from '@/lib/wordpress/api';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import PostCard from '@/components/PostCard';
import Link from 'next/link';

type Props = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 60; // Revalidate every 60 seconds

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tag = await getTagBySlug(slug);

  if (!tag) {
    return {
      title: 'Tag Not Found',
    };
  }

  return {
    title: `${tag.name} - Market Headlines`,
    description: tag.description || `Posts tagged with ${tag.name}`,
  };
}

export default async function TagArchivePage({ params }: Props) {
  const { slug } = await params;
  const tag = await getTagBySlug(slug);
  const posts = await getPostsByTagSlug(slug);

  if (!tag) {
    notFound();
  }

  return (
    <div className="min-vh-100 bg-white">
      <div className="container py-5">
        {/* Header */}
        <div className="mb-5">
          <Link
            href="/posts"
            className="d-inline-flex align-items-center gap-2 text-secondary text-decoration-none mb-3 small fw-medium"
          >
            <svg
              width="16"
              height="16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to All Posts
          </Link>

          <h1 className="display-4 fw-bold mb-3">
            Tag: {tag.name}
          </h1>
          {tag.description && (
            <p className="lead text-secondary">
              {tag.description}
            </p>
          )}
          <p className="text-secondary">
            {posts.length} {posts.length === 1 ? 'post' : 'posts'} with this tag
          </p>
        </div>

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
              No posts found with this tag.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

