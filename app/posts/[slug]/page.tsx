import { getPostBySlug, getPostsByCategory, getMarketTickers, getGlobalThemeSettings, getHomePageData, normalizeWpUrl } from '@/lib/wordpress/api';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import PostCard from '@/components/PostCard';
import MarketOverview from '@/components/MarketOverview';
import TrendingStories from '@/components/TrendingStories';
import AuthorBox from '@/components/AuthorBox';
import NewsletterCTA from '@/components/NewsletterCTA';
import GlobalCallToAction from '@/components/GlobalCallToAction';
import { PaginatedResponse, PostWithDetails } from '@/types/wordpress';

import { DEFAULT_POST_IMAGE, SITE_URL } from '@/lib/constants';

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
    title: post.seo?.title || `${post.title} - Market Headlines`,
    description: post.seo?.description || post.excerpt?.replace(/<[^>]*>/g, '').slice(0, 160) || post.title,
    openGraph: {
      title: post.seo?.og_title || post.title,
      description: post.seo?.og_description || post.excerpt?.replace(/<[^>]*>/g, '').slice(0, 160) || post.title,
      images: post.seo?.og_image ? post.seo.og_image.map(img => img.url) : (post.featuredMediaDetails?.source_url ? [post.featuredMediaDetails.source_url] : []),
    },
    alternates: {
      canonical: `${SITE_URL}/posts/${post.slug}`,
    },
  };
}

export default async function PostDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  const tickers = await getMarketTickers();
  const globalSettings = await getGlobalThemeSettings();
  const homePageData = await getHomePageData();
  // Use global default image from Pods settings, with a fallback hardcoded URL
  const defaultImageUrl = normalizeWpUrl(globalSettings?.blog_default_image?.guid) || DEFAULT_POST_IMAGE;

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
    <article className="bg-white min-vh-100">
      {/* Article Header Section */}
      <header className="pt-4 pb-3 pt-lg-5 pb-lg-4">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-12 col-xl-10">


              <div className="mb-4">
                <span className="post-category-badge">
                  {post.categoryDetails?.[0]?.name || 'Markets'}
                </span>
              </div>

              <h1
                className="fw-semibold mb-3 lh-sm post-title-main"
                dangerouslySetInnerHTML={{ __html: post.title }}
              />

              {post.excerpt && (
                <div
                  className="mb-5 post-excerpt-main fs-18"
                  dangerouslySetInnerHTML={{ __html: post.excerpt }}
                />
              )}

              {/* Meta and Share Row */}
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4 py-4 border-top border-bottom mb-5">
                <div className="d-flex align-items-center gap-2 flex-wrap">
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
                  <Link href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(SITE_URL + '/posts/' + post.slug)}`} target="_blank" className="post-share-btn" title="LinkedIn">
                    <i className="fa-brands fa-linkedin-in"></i>
                  </Link>
                  <Link href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(SITE_URL + '/posts/' + post.slug)}`} target="_blank" className="post-share-btn" title="Twitter">
                    <i className="fa-brands fa-x-twitter"></i>
                  </Link>
                  <Link href={`mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(SITE_URL + '/posts/' + post.slug)}`} className="post-share-btn" title="Email">
                    <i className="fa-solid fa-envelope"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="post-listing p-60 pt-0">
        <div className="container">
          {/* Full Width Featured Image */}
          <div className="row justify-content-center mb-4 mb-lg-5">
            <div className="col-12">
              <div className="rounded-4 overflow-hidden shadow-sm position-relative mb-3 single-post-hero">
                <Image
                  src={post.featuredMediaDetails?.source_url || defaultImageUrl}
                  alt={post.featuredMediaDetails?.alt_text || post.title}
                  fill
                  className="object-fit-cover"
                  priority
                  unoptimized={true} // Ensure image loads even if optimization fails, keeping full resolution
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

          <div className="row g-4 g-lg-5">
            {/* Main Content Column */}
            <div className="col-lg-8">
              {/* Article Body */}
              <div
                className="article-content fs-18 mb-4 mb-lg-5"
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
                  <MarketOverview tickers={tickers} />
                </div>

                {/* Trending Stories Widget */}
                <div className="mb-4">
                  <TrendingStories />
                </div>
              </div>
            </aside>
          </div>


        </div>
      </div>
      <div className="related-sec bg-light-c p-60">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-10">
              {/* Related Stories Section */}
              {filteredRelatedPosts.length > 0 && (
                <div className="p-0">
                  <h3 className="h2 fw-semibold mb-4 font-serif primary-text-blue">Related News</h3>
                  <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
                    {filteredRelatedPosts.map((relatedPost) => (
                      <div key={relatedPost.id} className="col">
                        <PostCard post={relatedPost} defaultImageUrl={defaultImageUrl} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Author Box Section */}
              {post.authorDetails && (
                <div className="pt-5 p-0">
                  <div className="row justify-content-center">
                    <div className="col-lg-12">
                      <AuthorBox author={post.authorDetails} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Subscription Section */}
      {/* Global Call to Action Section - Wrapped to serve as anchor for CTA buttons */}
      <div id="newsletter-section">
        <GlobalCallToAction settings={globalSettings} />
      </div>

    </article>
  );
}
