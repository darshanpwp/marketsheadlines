import Link from 'next/link';
import Image from 'next/image';
import {
  getPostsWithDetails, getPagesWithDetails, getHomePageData,
  getMarketTickers, getGlobalThemeSettings
} from '@/lib/wordpress/api';
import MarketOverview from '@/components/MarketOverview';
import TrendingListItem from '@/components/TrendingListItem';
import NewsListItem from '@/components/NewsListItem';
import PostCard from '@/components/PostCard';
import { calculateReadingTime } from '@/lib/utils';

import HeroCarousel from '@/components/HeroCarousel';
import NewsletterForm from '@/components/NewsletterForm';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  const [postsResponse, homePageData, marketTickers, globalSettings] = await Promise.all([
    getPostsWithDetails(10), // Fetch 10 posts
    getHomePageData(),
    getMarketTickers(),
    getGlobalThemeSettings()
  ]);

  const defaultImageUrl = globalSettings?.blog_default_image?.guid || 'https://dev-new-marketsheadlines.pantheonsite.io/wp-content/uploads/2026/01/thumbnail.png';

  const posts = postsResponse.items;
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
    <div className="bg-white min-vh-100">
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
              <div className="sticky-sidebar">
                <MarketOverview tickers={marketTickers} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3️⃣ Market Intelligence Promo Section */}
      <section className="p-60 promo-section bg-gradient-c">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <p className="text-uppercase primary-text-blue small mb-3 promo-tag fw-bold">
                {homePageData?.market_intelligence_heading || 'MARKET INTELLIGENCE'}
              </p>
              <h2 className="h1 mb-3 ">
                {homePageData?.market_intelligence_main_heading || 'Turn Headlines Into Market Intelligence'}
              </h2>
              <div
                className="mb-4 promo-description"
                dangerouslySetInnerHTML={{ __html: homePageData?.market_intelligence_description || '' }}
              />

              <ul className="list-unstyled mb-5">
                {(homePageData?.market_intelligence_features_text || []).map((feature: string, idx: number) => (
                  feature && (
                    <li key={idx} className="d-flex align-items-center gap-3 mb-3">
                      <i className="fa-solid fa-check promo-check d-flex align-items-center justify-content-center primary-bg-blue"></i>
                      <div className="promo-list-item">
                        <strong>{feature}</strong>
                      </div>
                    </li>
                  )
                ))}
                {/* Fallback if no data */}
                {!homePageData?.market_intelligence_features_text && (
                  <>
                    <li className="d-flex align-items-start gap-3 mb-3">
                      <i className="fa-solid fa-check mt-1 promo-check d-flex align-items-center justify-content-center  primary-bg-blue"></i>
                      <div className="promo-list-item"><strong>Real-time global market coverage</strong></div>
                    </li>
                    <li className="d-flex align-items-start gap-3 mb-3">
                      <i className="fa-solid fa-check mt-1 promo-check d-flex align-items-center justify-content-center primary-bg-blue"></i>
                      <div className="promo-list-item"><strong>Regulatory filings from major authorities</strong></div>
                    </li>
                    <li className="d-flex align-items-start gap-3 mb-4">
                      <i className="fa-solid fa-check mt-1 promo-check d-flex align-items-center justify-content-center primary-bg-blue"></i>
                      <div className="promo-list-item"><strong>Sector-specific intelligence</strong></div>
                    </li>
                  </>
                )}
              </ul>

              <div className="d-flex flex-wrap gap-3">
                <Link href={homePageData?.get_market_intelligence_button_url || '/get-market-intelligence'} className="btn btn-premium-primary">
                  {homePageData?.get_market_intelligence_button_text || 'Get Market Intelligence'}
                  <i className="fa-solid fa-chevron-right ms-2 small"></i>
                </Link>
                <Link href={homePageData?.explore_coverage_button_url || '/coverage'} className="btn btn-premium-link">
                  {homePageData?.explore_coverage_button_text || 'Explore Coverage'}
                </Link>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="position-relative aspect-video rounded overflow-hidden">
                {homePageData?.market_intelligence_image ? (
                  <Image
                    src={homePageData.market_intelligence_image}
                    alt="Market Intelligence"
                    fill
                    className="object-fit-cover"
                  />
                ) : (
                  <div className="w-100 h-100 bg-light-c d-flex align-items-center justify-content-center">
                    <i className="fa-solid fa-chart-column fa-5x text-primary opacity-25"></i>
                  </div>
                )}
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
            <div className="sticky-sidebar">
              <MarketOverview tickers={marketTickers} />
            </div>
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
                <PostCard post={post} defaultImageUrl={defaultImageUrl} />
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
              <PostCard post={post} showExcerpt={true} filterCategory="business" defaultImageUrl={defaultImageUrl} />
            </div>
          ))}
        </div>
      </section>

      {/* 7️⃣ Trust / Value Proposition Section */}
      <section className="hm-trust p-60">
        <div className="container">
          <div className="text-center col-10 m-auto mb-5">
            <p className="text-uppercase primary-text-blue fw-bold small mb-3">
              {homePageData?.for_investors_organizations_heading || 'FOR INVESTORS & ORGANIZATIONS'}
            </p>
            <h2 className="display-5 fw-bold mb-4">
              {homePageData?.for_investors_organizations_main_heading || 'Trusted by Professionals Tracking Global Markets'}
            </h2>
            <div
              className="text-secondary mx-auto col-12 col-sm-7"
              dangerouslySetInnerHTML={{ __html: homePageData?.for_investors_organizations_description || "Whether you're an investor, analyst, or organization, Markets Headlines delivers accurate, timely, and actionable market information." }}
            />
          </div>

          <div className="row row-cols-1 row-cols-md-3 g-4 mb-5">
            {(homePageData?.for_investors_organizations_features || []).map((feature, idx) => {
              // Icon mapping based on index to maintain design consistency since API doesn't return icons
              const icons = ['fa-chart-line', 'fa-file-invoice', 'fa-earth-americas'];
              const iconClass = icons[idx % icons.length];

              return (
                <div className="col" key={feature.id || idx}>
                  <div className="card h-100 text-center p-sm-5 p-3 hover-lift border-1 border-lighter">
                    <div className="mb-4">
                      <div className="d-inline-flex align-items-center bg-light-blue justify-content-center rounded-circle trust-icon-container overflow-hidden position-relative">
                        {feature.image ? (
                          <Image
                            src={feature.image}
                            alt={feature.title}
                            width={24}
                            height={24}
                            className="w-50 h-50 object-fit-contain"
                          />
                        ) : (
                          <i className={`fa - solid ${iconClass} fs - 5 primary - text - blue`}></i>
                        )}
                      </div>
                    </div>
                    <h3 className="h5 fw-bold mb-2 trust-card-title text-font-family ">{feature.title}</h3>
                    <p className="trust-card-text">{feature.description}</p>
                  </div>
                </div>
              );
            })}

            {/* Fallback if no features data */}
            {(!homePageData?.for_investors_organizations_features || homePageData.for_investors_organizations_features.length === 0) && (
              <>
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
                {/* ... other fallback items can be added here if strictly needed, but one is enough to show layout ... */}
              </>
            )}
          </div>

          <div className="text-center">
            <Link href={homePageData?.request_a_quote_button_url || '/request-demo'} className="btn btn-premium-primary btn-lg px-5 py-3 me-3 d-inline-flex align-items-center gap-2">
              {homePageData?.request_a_quote_button_text || 'Request a Quote'}
              <i className="fa-solid fa-arrow-right small"></i>
            </Link>
            <Link href={homePageData?.register_for_access_button_url || '/registration'} className="btn btn-premium-outline btn-lg px-5 py-3 d-inline-flex align-items-center gap-2">
              {homePageData?.register_for_access_button_text || 'Register for Access'}
              <i className="fa-solid fa-arrow-right small"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* 8️⃣ Newsletter Subscription Section */}
      {(homePageData?.show_newsletter_section !== '0') && (
        <section className="container-fluid p-80 newsletter-section-main">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8 text-center text-white">
                <h2 className="display-5 fw-semibold text-white mb-3 newsletter-title">
                  {homePageData?.newsletter_heading || 'Stay Ahead of the Markets'}
                </h2>
                <div
                  className="fs-18 mb-4 col-9 m-auto opacity-90"
                  dangerouslySetInnerHTML={{ __html: homePageData?.newsletter_description || 'Get expert insights, breaking news, and market analysis delivered directly to your inbox' }}
                />

                <NewsletterForm
                  defaultDaily={homePageData?.default_daily_market_brief === '1'}
                  defaultWeekly={homePageData?.default_weekly_deep_dive === '1'}
                  defaultBreaking={homePageData?.default_breaking_news_alerts === '1'}
                />
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
