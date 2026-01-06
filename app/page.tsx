import Link from 'next/link';
import Image from 'next/image';
import { getPostsWithDetails, getPagesWithDetails } from '@/lib/wordpress/api';
import MarketOverview from '@/components/MarketOverview';
import TrendingListItem from '@/components/TrendingListItem';
import NewsListItem from '@/components/NewsListItem';
import PostCard from '@/components/PostCard';
import { calculateReadingTime } from '@/lib/utils';

import HeroCarousel from '@/components/HeroCarousel';

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
      <HeroCarousel posts={featuredPosts} />

      {/* 2️⃣ Trending Now + Market Overview */}
      <section className="p-60 bg-light-c">
        <div className="container py-4">
          <div className="row g-5">
            {/* Left: Trending Now */}
            <div className="col-lg-8">
              <div className="d-flex align-items-center justify-content-between mb-4">
                <h2 className="primary-text-blue mb-0 font-serif">Trending Now</h2>
                <span className="badge bg-light-c text-secondary border px-3 py-2 rounded-pill">Top 5 Stories</span>
              </div>

              <div className="mb-5">
                {trendingPosts.map((post, index) => (
                  <TrendingListItem key={post.id} post={post} index={index + 1} />
                ))}
              </div>

              <Link href="/posts" className="btn primary-text-blue px-4 fw-bold">
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
      <section className="p-60 promo-section bg-gradient-c">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <p className="text-uppercase primary-text-blue small mb-3 promo-tag fw-bold">MARKET INTELLIGENCE</p>
              <h2 className="h1 mb-3 ">Turn Headlines Into Market Intelligence</h2>
              <p className="mb-4 promo-description">
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
                <div className="w-100 h-100 bg-light-c d-flex align-items-center justify-content-center">
                  <i className="fa-solid fa-chart-column fa-5x text-primary opacity-25"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4️⃣ World News – List View */}
      <section className="container p-60">
        <div className="d-flex justify-content-between align-items-center mb-5">
          <h2 className="primary-text-blue mb-0">World News</h2>
          <Link href="/posts" className="primary-text-blue text-decoration-none fw-semibold">
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
      <section className="world-news-card-grid p-60 bg-light-c">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-5">
            <h2 className="primary-text-blue mb-0">World News</h2>
            <Link href="/posts" className="primary-text-blue text-decoration-none fw-semibold">
              View All
              <i className="fa-solid fa-chevron-right ms-2 small"></i>
            </Link>
          </div>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
            {worldNewsCards.map((post) => (
              <div key={post.id} className="col">
                <PostCard post={post} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6️⃣ Business Section */}
      <section className="container p-60">
        <div className="d-flex justify-content-between align-items-center mb-5">
          <h2 className="primary-text-blue mb-0">Business</h2>
          <Link href="/posts" className="primary-text-blue text-decoration-none fw-semibold">
            View All
            <i className="fa-solid fa-chevron-right ms-2 small"></i>
          </Link>
        </div>

        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {(businessPosts.length > 0 ? businessPosts : posts.slice(0, 3)).map((post) => (
            <div key={post.id} className="col">
              <PostCard post={post} showExcerpt={true} filterCategory="business" />
            </div>
          ))}
        </div>
      </section>

      {/* 7️⃣ Trust / Value Proposition Section */}
      <section className="hm-trust p-60">
        <div className="container">
          <div className="text-center col-10 m-auto mb-5">
            <p className="text-uppercase primary-text-blue fw-bold small mb-3">FOR INVESTORS & ORGANIZATIONS</p>
            <h2 className="display-5 fw-bold mb-4">Trusted by Professionals Tracking Global Markets</h2>
            <p className="text-secondary mx-auto col-12 col-sm-7" >
              Whether you're an investor, analyst, or organization, Markets Headlines delivers accurate, timely, and actionable market information.
            </p>
          </div>

          <div className="row row-cols-1 row-cols-md-3 g-4 mb-5">
            <div className="col">
              <div className="card h-100 text-center p-sm-5 p-3 hover-lift border-1 border-lighter">
                <div className="mb-4">
                  <div className="d-inline-flex align-items-center bg-light-blue justify-content-center rounded-circle trust-icon-container">
                    <i className="fa-solid fa-chart-line fs-5 primary-text-blue"></i>
                  </div>
                </div>
                <h3 className="h5 fw-bold mb-2 trust-card-title text-font-family ">Market-Moving News</h3>
                <p className="trust-card-text">Global coverage of equities, commodities, ETFs, and sectors.</p>
              </div>
            </div>
            <div className="col">
              <div className="card h-100 text-center p-sm-5 p-3 hover-lift border-1 border-lighter">
                <div className="mb-4">
                  <div className="d-inline-flex align-items-center bg-light-blue  justify-content-center rounded-circle trust-icon-container">
                    <i className="fa-solid fa-file-invoice fs-5 primary-text-blue"></i>
                  </div>
                </div>
                <h3 className="h5 fw-bold mb-2 text-font-family  trust-card-title">Regulatory & Exchange Data</h3>
                <p className="trust-card-text">Access filings from SEC, FDA, SEDAR, and major exchanges.</p>
              </div>
            </div>
            <div className="col">
              <div className="card h-100 text-center p-sm-5 p-3 hover-lift border-1 border-lighter">
                <div className="mb-4">
                  <div className="d-inline-flex bg-light-blue align-items-center justify-content-center rounded-circle trust-icon-container">
                    <i className="fa-solid fa-earth-americas fs-5 primary-text-blue"></i>
                  </div>
                </div>
                <h3 className="h5 fw-bold mb-2 trust-card-title text-font-family ">Global Perspective</h3>
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
        </div>
      </section>

      {/* 8️⃣ Newsletter Subscription Section */}
      <section className="container-fluid p-80 newsletter-section-main">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center text-white">
              <h2 className="display-5 fw-semibold text-white mb-3 newsletter-title">Stay Ahead of the Markets</h2>
              <p className="fs-18 mb-4 col-9 m-auto opacity-90">
                Get expert insights, breaking news, and market analysis delivered directly to your inbox
              </p>

              <form className="mx-auto newsletter-form">
                <div className="mb-4">
                  <input
                    type="email"
                    className="form-control rounded-3 shadow-sm newsletter-input"
                    placeholder="Enter your email address"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="newsletter-checkbox-wrapper">
                    <input type="checkbox" defaultChecked />
                    <span className="custom-checkbox">
                      <i className="fa-solid fa-check"></i>
                    </span>
                    <span className="newsletter-label text-white">Daily Market Brief</span>
                  </label>

                  <label className="newsletter-checkbox-wrapper">
                    <input type="checkbox" />
                    <span className="custom-checkbox">
                      <i className="fa-solid fa-check"></i>
                    </span>
                    <span className="newsletter-label text-white">Weekly Deep Dive</span>
                  </label>

                  <label className="newsletter-checkbox-wrapper">
                    <input type="checkbox" defaultChecked />
                    <span className="custom-checkbox">
                      <i className="fa-solid fa-check"></i>
                    </span>
                    <span className="newsletter-label text-white">Breaking News Alerts</span>
                  </label>
                </div>

                <button type="submit" className="btn btn-white-primary fw-bold rounded-2 w-100 btn-lg rounded-3 justify-content-center shadow-sm transition-all">
                  Subscribe to Newsletter
                  <i className="fa-solid fa-arrow-right ms-2 small"></i>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
