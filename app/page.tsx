import Link from 'next/link';
import Image from 'next/image';
import { getPostsWithDetails, getPagesWithDetails } from '@/lib/wordpress/api';
import MarketOverview from '@/components/MarketOverview';
import TrendingListItem from '@/components/TrendingListItem';
import NewsListItem from '@/components/NewsListItem';
import PostCard from '@/components/PostCard';
import { calculateReadingTime } from '@/lib/utils';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  const { items: posts } = await getPostsWithDetails();
  const { items: pages } = await getPagesWithDetails();

  // Get featured/sticky posts for hero carousel (at least 3)
  const stickyPosts = posts.filter(post => post.sticky);
  const featuredPosts = stickyPosts.length >= 3
    ? stickyPosts.slice(0, 3)
    : [...stickyPosts, ...posts.slice(0, 3 - stickyPosts.length)].slice(0, 3);

  // Get trending posts (first 5)
  const trendingPosts = posts.slice(0, 5);

  // Get world news posts
  const worldNewsPosts = posts.filter(post =>
    post.categoryDetails?.some(cat => cat.name.toLowerCase().includes('world') || cat.name.toLowerCase().includes('news'))
  ).slice(0, 5);
  const worldNewsCards = posts.slice(0, 4);

  // Get business posts
  const businessPosts = posts.filter(post =>
    post.categoryDetails?.some(cat => cat.name.toLowerCase().includes('business'))
  ).slice(0, 3);

  return (
    <main className="bg-white">
      {/* 1️⃣ Hero / Featured News Carousel Section */}
      <section className="container-fluid px-0">
        {featuredPosts.length > 0 ? (
          <div
            id="heroCarousel"
            className="carousel slide carousel-fade"
            data-bs-ride="carousel"
            data-bs-interval="5000"
            data-bs-pause="hover"
          >
            {/* Carousel Indicators */}
            <div className="carousel-indicators">
              {featuredPosts.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  data-bs-target="#heroCarousel"
                  data-bs-slide-to={index}
                  className={index === 0 ? 'active' : ''}
                  aria-current={index === 0 ? 'true' : undefined}
                  aria-label={`Slide ${index + 1}`}
                ></button>
              ))}
            </div>

            {/* Carousel Inner */}
            <div className="carousel-inner">
              {featuredPosts.map((post, index) => (
                <div
                  key={post.id}
                  className={`carousel-item ${index === 0 ? 'active' : ''} position-relative hero-item`}
                >
                  {/* Background Image */}
                  {/* Background Image using Next.js Image for optimization */}
                  <div className="hero-bg position-absolute w-100 h-100 top-0 start-0 overflow-hidden" style={{ zIndex: 0 }}>
                    {post.featuredMediaDetails?.source_url ? (
                      <Image
                        src={post.featuredMediaDetails.source_url}
                        alt={post.title}
                        fill
                        className="object-fit-cover transition-transform duration-700 hover-scale"
                        priority={index === 0}
                      />
                    ) : (
                      <div className="w-100 h-100 bg-secondary"></div> // Fallback if no image
                    )}

                    {/* Brand Navy Overlay with Gradient */}
                    <div
                      className="hero-overlay position-absolute w-100 h-100 top-0 start-0"
                      style={{
                        background: 'linear-gradient(0deg, rgba(0, 0, 0, 0.72) 0%, rgba(0, 0, 0, 0.45) 50%, rgba(0, 0, 0, 0.27) 100%)',
                        zIndex: 1
                      }}
                    ></div>
                  </div>

                  {/* Content Overlay */}
                  <div className="container hero-content-container position-relative z-3">
                    <div className="row align-items-center h-100">
                      <div className="col-lg-7 col-md-9 text-white py-5 hero-content">
                        {post.categoryDetails?.[0] && (
                          <span className="badge primary-bg-blue text-white rounded-pill px-3 py-2 mb-4 fw-bold shadow-sm">
                            {post.categoryDetails[0].name}
                          </span>
                        )}
                        <h2
                          className="display-4 text-white fw-bold mb-4 hero-headline"
                          style={{ fontFamily: 'var(--bs-font-serif)', lineHeight: '1.1' }}
                          dangerouslySetInnerHTML={{ __html: post.title }}
                        />
                        <div
                          className="lead hero-excerpt opacity-90 fw-light text-truncate"
                          style={{ maxWidth: '100%' }}
                          dangerouslySetInnerHTML={{
                            __html: post.excerpt || 'Stay informed with the latest market insights and financial news.'
                          }}
                        />
                        {post.authorDetails && (
                          <div className="d-flex align-items-center gap-3 mb-4 pt-4" style={{ maxWidth: 'fit-content' }}>
                            <span className="fw-bold text-uppercase small tracking-wider">By {post.authorDetails.name}</span>
                            <span className="text-white opacity-50">•</span>
                            <span className="small opacity-75">{calculateReadingTime(post.content)} min read</span>
                          </div>
                        )}
                        <Link
                          href={`/posts/${post.slug}`}
                          className="btn btn-white-primary rounded-2"
                        >
                          Read Full Story
                          <i className="fa-solid fa-chevron-right ms-2"></i>

                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Carousel Controls - Previous */}
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#heroCarousel"
              data-bs-slide="prev"
            >
              <div className="bg-white text-dark rounded-circle d-flex align-items-center justify-content-center shadow-lg" style={{ width: '50px', height: '50px' }}>
                <i className="fa-solid fa-chevron-left" aria-hidden="true"></i>
              </div>
              <span className="visually-hidden">Previous</span>
            </button>

            {/* Carousel Controls - Next */}
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#heroCarousel"
              data-bs-slide="next"
            >
              <div className="bg-white text-dark rounded-circle d-flex align-items-center justify-content-center shadow-lg" style={{ width: '50px', height: '50px' }}>
                <i className="fa-solid fa-chevron-right" aria-hidden="true"></i>
              </div>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        ) : (
          // Fallback if no posts available
          <div
            className="position-relative hero-item newsletter-section-main"
          >
            <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark" style={{ opacity: 0.8 }}></div>
            <div className="container position-relative h-100">
              <div className="row align-items-center h-100">
                <div className="col-lg-6 col-md-8 text-white py-5 text-center text-md-start">
                  <span className="badge bg-primary mb-3 px-3 py-2">World News</span>
                  <h1 className="display-4 fw-bold mb-4">
                    Global Markets React to Emerging Trade Agreement Framework
                  </h1>
                  <p className="lead mb-4">
                    Asian and European indices surge on news of multilateral trade negotiations
                  </p>
                  <Link href="/posts" className="btn btn-white-primary btn-lg px-4">
                    Read Full Story
                    <i className="fa-solid fa-chevron-right ms-2 small"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 2️⃣ Trending Now + Market Overview */}
      <section className="py-5 bg-white border-bottom">
        <div className="container py-4">
          <div className="row g-5">
            {/* Left: Trending Now */}
            <div className="col-lg-8">
              <div className="d-flex align-items-center justify-content-between mb-4">
                <h2 className="display-6 fw-bold text-dark mb-0 font-serif">Trending Now</h2>
                <span className="badge bg-light text-secondary border px-3 py-2 rounded-pill">Top 5 Stories</span>
              </div>

              <div className="mb-5">
                {trendingPosts.map((post, index) => (
                  <TrendingListItem key={post.id} post={post} index={index + 1} />
                ))}
              </div>

              <Link href="/posts" className="btn btn-outline-primary rounded-pill px-4 fw-bold">
                View All Trending Stories
                <i className="fa-solid fa-arrow-right ms-2 small"></i>
              </Link>
            </div>

            {/* Right: Market Overview */}
            <div className="col-lg-4">
              <MarketOverview />
            </div>
          </div>
        </div>
      </section>

      {/* 3️⃣ Market Intelligence Promo Section */}
      <section className="py-5 promo-section">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <p className="text-uppercase fw-bold small mb-2 promo-tag">MARKET INTELLIGENCE</p>
              <h2 className="display-5 fw-bold mb-4 promo-title">Turn Headlines Into Market Intelligence</h2>
              <p className="lead mb-4 promo-description">
                Markets move fast. We help you stay ahead with curated global news, regulatory disclosures, and market-moving insights — all in one place.
              </p>

              <ul className="list-unstyled mb-5">
                <li className="d-flex align-items-start gap-3 mb-3">
                  <i className="fa-solid fa-check mt-1 promo-check"></i>
                  <div className="promo-list-item">
                    <strong>Real-time global market coverage</strong>
                  </div>
                </li>
                <li className="d-flex align-items-start gap-3 mb-3">
                  <i className="fa-solid fa-check mt-1 promo-check"></i>
                  <div className="promo-list-item">
                    <strong>Regulatory filings from major authorities</strong>
                  </div>
                </li>
                <li className="d-flex align-items-start gap-3 mb-4">
                  <i className="fa-solid fa-check mt-1 promo-check"></i>
                  <div className="promo-list-item">
                    <strong>Sector-specific intelligence (Energy, Pharma, ETFs & more)</strong>
                  </div>
                </li>
              </ul>

              <div className="d-flex flex-wrap gap-3">
                <Link href="/get-market-intelligence" className="btn btn-premium-primary">
                  Get Market Intelligence
                  <i className="fa-solid fa-chevron-right ms-2 small"></i>
                </Link>
                <Link href="/coverage" className="btn btn-premium-link">
                  Explore Coverage
                </Link>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="position-relative aspect-video rounded overflow-hidden">
                <div className="w-100 h-100 bg-light d-flex align-items-center justify-content-center">
                  <i className="fa-solid fa-chart-column fa-5x text-primary opacity-25"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4️⃣ World News – List View */}
      <section className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="display-5 fw-bold mb-0">World News</h2>
          <Link href="/posts" className="text-primary text-decoration-none fw-semibold">
            View All
            <i className="fa-solid fa-chevron-right ms-2 small"></i>
          </Link>
        </div>

        <div className="row g-4">
          {/* Left: News List */}
          <div className="col-lg-8">
            {worldNewsPosts.length > 0 ? (
              worldNewsPosts.map((post, index) => (
                <NewsListItem key={post.id} post={post} index={index + 1} />
              ))
            ) : (
              posts.slice(0, 5).map((post, index) => (
                <NewsListItem key={post.id} post={post} index={index + 1} />
              ))
            )}
          </div>

          {/* Right: Market Overview */}
          <div className="col-lg-4">
            <MarketOverview />
          </div>
        </div>
      </section>

      {/* 5️⃣ World News – Card Grid */}
      <section className="container py-5">
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
          {worldNewsCards.map((post) => (
            <div key={post.id} className="col">
              <PostCard post={post} />
            </div>
          ))}
        </div>
      </section>

      {/* 6️⃣ Business Section */}
      <section className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="display-5 fw-bold mb-0">Business</h2>
          <Link href="/posts" className="text-primary text-decoration-none fw-semibold">
            View All
            <i className="fa-solid fa-chevron-right ms-2 small"></i>
          </Link>
        </div>

        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {(businessPosts.length > 0 ? businessPosts : posts.slice(0, 3)).map((post) => (
            <div key={post.id} className="col">
              <PostCard post={post} />
            </div>
          ))}
        </div>
      </section>

      {/* 7️⃣ Trust / Value Proposition Section */}
      <section className="container py-5">
        <div className="text-center mb-5">
          <p className="text-uppercase text-primary fw-bold small mb-2">FOR INVESTORS & ORGANIZATIONS</p>
          <h2 className="display-5 fw-bold mb-4">Trusted by Professionals Tracking Global Markets</h2>
          <p className="lead text-secondary mx-auto trust-description">
            Whether you're an investor, analyst, or organization, Markets Headlines delivers accurate, timely, and actionable market information.
          </p>
        </div>

        <div className="row row-cols-1 row-cols-md-3 g-4 mb-5">
          <div className="col">
            <div className="card h-100 text-center p-4 hover-lift border-0 shadow-sm">
              <div className="mb-4">
                <div className="d-inline-flex align-items-center justify-content-center rounded-circle trust-icon-container">
                  <i className="fa-solid fa-chart-line fa-2x"></i>
                </div>
              </div>
              <h3 className="h5 fw-bold mb-3 trust-card-title">Market-Moving News</h3>
              <p className="trust-card-text">Global coverage of equities, commodities, ETFs, and sectors.</p>
            </div>
          </div>
          <div className="col">
            <div className="card h-100 text-center p-4 hover-lift border-0 shadow-sm">
              <div className="mb-4">
                <div className="d-inline-flex align-items-center justify-content-center rounded-circle trust-icon-container">
                  <i className="fa-solid fa-file-invoice fa-2x"></i>
                </div>
              </div>
              <h3 className="h5 fw-bold mb-3 trust-card-title">Regulatory & Exchange Data</h3>
              <p className="trust-card-text">Access filings from SEC, FDA, SEDAR, and major exchanges.</p>
            </div>
          </div>
          <div className="col">
            <div className="card h-100 text-center p-4 hover-lift border-0 shadow-sm">
              <div className="mb-4">
                <div className="d-inline-flex align-items-center justify-content-center rounded-circle trust-icon-container">
                  <i className="fa-solid fa-earth-americas fa-2x"></i>
                </div>
              </div>
              <h3 className="h5 fw-bold mb-3 trust-card-title">Global Perspective</h3>
              <p className="trust-card-text">Insights across regions, industries, and asset classes.</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link href="/request-demo" className="btn btn-premium-primary btn-lg px-5 me-3">
            Request a Quote
          </Link>
          <Link href="/registration" className="btn btn-premium-link btn-lg px-4">
            Register for Access
          </Link>
        </div>
      </section>

      {/* 8️⃣ Newsletter Subscription Section */}
      <section className="container-fluid py-5 newsletter-section-main">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center text-white">
              <h2 className="display-5 fw-bold mb-3 newsletter-title">Stay Ahead of the Markets</h2>
              <p className="lead mb-4 opacity-80">
                Get expert insights, breaking news, and market analysis delivered directly to your inbox
              </p>

              <form className="mx-auto newsletter-form">
                <div className="mb-4">
                  <input
                    type="email"
                    className="form-control form-control-lg rounded-3 border-0 shadow-sm newsletter-input"
                    placeholder="Enter your email address"
                    required
                  />
                </div>

                <div className="d-flex flex-wrap justify-content-center gap-4 mb-4">
                  <div className="form-check text-white">
                    <input className="form-check-input" type="checkbox" id="daily" defaultChecked />
                    <label className="form-check-label newsletter-label" htmlFor="daily">
                      Daily Market Brief
                    </label>
                  </div>
                  <div className="form-check text-white">
                    <input className="form-check-input" type="checkbox" id="weekly" />
                    <label className="form-check-label newsletter-label" htmlFor="weekly">
                      Weekly Deep Dive
                    </label>
                  </div>
                  <div className="form-check text-white">
                    <input className="form-check-input" type="checkbox" id="breaking" defaultChecked />
                    <label className="form-check-label newsletter-label" htmlFor="breaking">
                      Breaking News Alerts
                    </label>
                  </div>
                </div>

                <button type="submit" className="btn btn-light btn-lg px-5 rounded-3 fw-bold shadow-sm transition-all">
                  Subscribe to Newsletter
                  <i className="fa-solid fa-paper-plane ms-2 small"></i>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
