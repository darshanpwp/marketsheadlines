import { getPostBySlug, getPostsByCategory } from '@/lib/wordpress/api';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import PostCard from '@/components/PostCard';
import MarketOverview from '@/components/MarketOverview';
import TrendingStories from '@/components/TrendingStories';
import AuthorBox from '@/components/AuthorBox';
import NewsletterCTA from '@/components/NewsletterCTA';
import { PaginatedResponse, PostWithDetails } from '@/types/wordpress';

type Props = {
  params: Promise<{ slug: string }>;
};

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.title} - Market Headlines`,
    description: post.excerpt?.replace(/<[^>]*>/g, '').slice(0, 160) || post.title,
    openGraph: {
      title: post.title,
      description: post.excerpt?.replace(/<[^>]*>/g, '').slice(0, 160) || post.title,
      images: post.featuredMediaDetails?.source_url ? [post.featuredMediaDetails.source_url] : [],
    },
  };
}

export default async function PostDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Fetch related posts from the same category
  const categoryId = post.categoryDetails?.[0]?.id;
  const { items: relatedPosts } = categoryId
    ? await getPostsByCategory(categoryId, 4, 1)
    : { items: [], totalItems: 0, totalPages: 0 } as PaginatedResponse<PostWithDetails>;

  const filteredRelatedPosts = relatedPosts.filter(p => p.id !== post.id).slice(0, 3);

  const readingTime = Math.ceil(post.content.split(' ').length / 200);

  return (
    <article className="bg-white min-vh-100 pb-5">
      {/* Article Header Section */}
      <header className="pt-5 pb-4">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10 col-xl-8">
              {/* Breadcrumbs */}
              <nav aria-label="breadcrumb" className="mb-3">
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link href="/" className="text-decoration-none small text-uppercase fw-bold opacity-75 breadcrumb-link-home">Home</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    <span className="text-uppercase fw-bold breadcrumb-text-active">Markets</span>
                  </li>
                </ol>
              </nav>

              <div className="mb-4">
                <span className="post-category-badge">
                  {post.categoryDetails?.[0]?.name || 'Markets'}
                </span>
              </div>

              <h1
                className="fw-bold mb-3 lh-sm post-title-main"
                dangerouslySetInnerHTML={{ __html: post.title }}
              />

              {post.excerpt && (
                <div
                  className="mb-5 post-excerpt-main"
                  dangerouslySetInnerHTML={{ __html: post.excerpt }}
                />
              )}

              {/* Meta and Share Row */}
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4 py-4 border-top border-bottom mb-5">
                <div className="d-flex align-items-center gap-2">
                  {post.authorDetails && (
                    <div className="d-flex align-items-center gap-2">
                      <span className="fw-bold post-meta-author">{post.authorDetails.name}</span>
                    </div>
                  )}
                  <span className="post-meta-dot mx-1 post-meta-dot-styled">•</span>
                  <time className="small post-meta-time" suppressHydrationWarning>
                    {new Date(post.date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </time>
                  <span className="post-meta-dot mx-1 post-meta-dot-styled">•</span>
                  <span className="small post-meta-time">{readingTime} min read</span>
                </div>

                {/* Social Share Icons */}
                <div className="d-flex gap-2 align-items-center">
                  <span className="text-secondary small fw-bold text-uppercase opacity-50 me-2 share-tag">Share:</span>
                  <Link href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(process.env.NEXT_PUBLIC_SITE_URL + '/posts/' + post.slug)}`} target="_blank" className="post-share-btn" title="LinkedIn">
                    <i className="fa-brands fa-linkedin-in"></i>
                  </Link>
                  <Link href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(process.env.NEXT_PUBLIC_SITE_URL + '/posts/' + post.slug)}`} target="_blank" className="post-share-btn" title="Twitter">
                    <i className="fa-brands fa-x-twitter"></i>
                  </Link>
                  <Link href={`mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(process.env.NEXT_PUBLIC_SITE_URL + '/posts/' + post.slug)}`} className="post-share-btn" title="Email">
                    <i className="fa-solid fa-envelope"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container">
        {/* Full Width Featured Image */}
        <div className="row justify-content-center mb-5">
          <div className="col-12">
            <div className="rounded-4 overflow-hidden shadow-sm position-relative mb-3" style={{ height: '600px' }}>
              <Image
                src={post.featuredMediaDetails?.source_url || 'https://dev-new-marketsheadlines.pantheonsite.io/wp-content/uploads/2026/01/thumbnail.png'}
                alt={post.featuredMediaDetails?.alt_text || post.title}
                fill
                className="object-fit-cover"
                priority
                sizes="100vw"
              />
            </div>
            <p className="text-center text-muted small fst-italic mt-2 opacity-75">
              {post.featuredMediaDetails?.caption ? (
                <span dangerouslySetInnerHTML={{ __html: post.featuredMediaDetails.caption }} />
              ) : (
                "Major stock exchanges worldwide responded positively to trade agreement developments"
              )}
            </p>
          </div>
        </div>

        <div className="row g-5">
          {/* Main Content Column */}
          <div className="col-lg-8">
            {/* Article Body */}
            <div
              className="article-content rich-text mb-5"
              style={{
                fontSize: '1.25rem',
                lineHeight: '2'
              }}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Newsletter CTA in content flow */}
            <NewsletterCTA />
          </div>

          {/* Sidebar Column */}
          <aside className="col-lg-4">
            <div className="sticky-top" style={{ top: '6rem', zIndex: 10 }}>
              {/* Market Overview Widget */}
              <div className="mb-4">
                <MarketOverview />
              </div>

              {/* Trending Stories Widget */}
              <div className="mb-4">
                <TrendingStories />
              </div>

              {/* Advertisement / Promo */}
              <div className="bg-light rounded-4 p-5 text-center border-dashed border-2 mb-4 position-relative overflow-hidden">
                <div className="position-relative z-1">
                  <div className="text-secondary x-small text-uppercase mb-3 opacity-50 fw-bold tracking-wider">Advertisement</div>
                  <h5 className="font-serif fw-bold mb-3">Premium Market Intelligence</h5>
                  <p className="text-muted small mb-4">Get exclusive access to real-time data and expert analysis.</p>
                  <Link href="#" className="btn btn-outline-primary btn-sm rounded-pill fw-bold text-uppercase">Learn More</Link>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Related Stories Section */}
        {filteredRelatedPosts.length > 0 && (
          <div className="pt-5 border-top mt-5 mb-5">
            <h3 className="fw-bold mb-4" style={{ fontFamily: 'var(--bs-font-serif)' }}>Related Stories</h3>
            <div className="row g-4">
              {filteredRelatedPosts.map((relatedPost) => (
                <div key={relatedPost.id} className="col-md-4">
                  <PostCard post={relatedPost} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Author Box Section */}
        {post.authorDetails && (
          <div className="pt-5 mt-5">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <AuthorBox author={post.authorDetails} />
              </div>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
