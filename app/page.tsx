import Link from 'next/link';
import Image from 'next/image';
import {
  getPostsWithDetails, getHomePageData,
  getMarketTickers, getGlobalThemeSettings,
  WORDPRESS_URL
} from '@/lib/wordpress/api';
import MarketOverview from '@/components/MarketOverview';
import TrendingListItem from '@/components/TrendingListItem';
import NewsListItem from '@/components/NewsListItem';
import PostCard from '@/components/PostCard';

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

  const defaultImageUrl = globalSettings?.blog_default_image?.guid || `${WORDPRESS_URL}/wp-content/uploads/2026/01/thumbnail.png`;

  const posts = postsResponse.items;

  // Get featured/sticky posts for hero carousel (at least 3) - kept from standard API as Pods doesn't provide this yet
  const stickyPosts = posts.filter(post => post.sticky);
  const featuredPosts = stickyPosts.length >= 3
    ? stickyPosts.slice(0, 3)
    : [...stickyPosts, ...posts.slice(0, 3 - stickyPosts.length)].slice(0, 3);

  // Dynamic Data Sections
  const trendingSection = homePageData?.trending_now_section;
  const worldGridSection = homePageData?.world_news_grid_section;
  const worldListSection = homePageData?.world_news_list_section;
  const businessSection = homePageData?.business_section;

  const trendingPosts = trendingSection?.posts || [];
  const worldNewsPosts = worldListSection?.posts || [];
  const worldNewsCards = worldGridSection?.posts || [];
  const businessPosts = businessSection?.posts || [];

  return (
    <div className="bg-white min-vh-100">
      {/* 1️⃣ Hero / Featured News Carousel Section */}
      <HeroCarousel posts={featuredPosts} defaultImageUrl={defaultImageUrl} />

      {/* 2️⃣ Trending Now + Market Overview */}
      <section className="p-60 bg-light-c">
        <div className="container py-4">
          <div className="row g-5">
            {/* Left: Trending Now */}
            <div className="col-lg-8">
              <div className="d-flex align-items-center justify-content-between mb-4">
                <h2 className="primary-text-blue mb-0 font-serif">{trendingSection?.title || 'Trending Now'}</h2>
              </div>

              <div className="mb-5">
                {trendingPosts.map((post, index) => (
                  <TrendingListItem key={post.id} post={post} index={index + 1} />
                ))}
              </div>

              <Link href={trendingSection?.view_all_url || '/posts'} className="btn primary-text-blue px-4 fw-bold">
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
      {/* 3️⃣ Market Intelligence Promo Section */}
      {(homePageData?.market_intelligence_heading || homePageData?.market_intelligence_main_heading || homePageData?.market_intelligence_image) && (
        <section className="p-60 promo-section bg-gradient-c">
          <div className="container">
            <div className="row align-items-center g-5">
              <div className={homePageData?.market_intelligence_image ? "col-lg-6" : "col-lg-12"}>
                {homePageData?.market_intelligence_heading && (
                  <p className="text-uppercase primary-text-blue small mb-3 promo-tag fw-bold">
                    {homePageData.market_intelligence_heading}
                  </p>
                )}
                {homePageData?.market_intelligence_main_heading && (
                  <h2 className="h1 mb-3 ">
                    {homePageData.market_intelligence_main_heading}
                  </h2>
                )}
                {homePageData?.market_intelligence_description && (
                  <div
                    className="mb-4 promo-description"
                    dangerouslySetInnerHTML={{ __html: homePageData.market_intelligence_description }}
                  />
                )}

                {(homePageData?.market_intelligence_features_text && homePageData.market_intelligence_features_text.length > 0) && (
                  <ul className="list-unstyled mb-5">
                    {homePageData.market_intelligence_features_text.map((feature: string, idx: number) => (
                      feature && (
                        <li key={idx} className="d-flex align-items-center gap-3 mb-3">
                          <i className="fa-solid fa-check promo-check d-flex align-items-center justify-content-center primary-bg-blue"></i>
                          <div className="promo-list-item">
                            <strong>{feature}</strong>
                          </div>
                        </li>
                      )
                    ))}
                  </ul>
                )}

                {(homePageData?.get_market_intelligence_button_text || homePageData?.explore_coverage_button_text) && (
                  <div className="d-flex flex-wrap gap-3">
                    {homePageData?.get_market_intelligence_button_text && (
                      <Link href={homePageData?.get_market_intelligence_button_url || '#'} className="btn btn-premium-primary">
                        {homePageData.get_market_intelligence_button_text}
                        <i className="fa-solid fa-chevron-right ms-2 small"></i>
                      </Link>
                    )}
                    {homePageData?.explore_coverage_button_text && (
                      <Link href={homePageData?.explore_coverage_button_url || '#'} className="btn btn-premium-link">
                        {homePageData.explore_coverage_button_text}
                      </Link>
                    )}
                  </div>
                )}
              </div>

              {homePageData?.market_intelligence_image && (
                <div className="col-lg-6">
                  <div className="position-relative aspect-video rounded overflow-hidden">
                    <Image
                      src={homePageData.market_intelligence_image}
                      alt={homePageData.market_intelligence_main_heading || "Market Intelligence"}
                      fill
                      className="object-fit-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 4️⃣ World News – List View */}
      <section className="container p-60">
        <div className="d-flex justify-content-between align-items-center mb-5">
          <h2 className="primary-text-blue mb-0">{worldListSection?.title || 'World News'}</h2>
          <Link href={worldListSection?.view_all_url || '/posts'} className="primary-text-blue text-decoration-none fw-semibold">
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
            <h2 className="primary-text-blue mb-0">{worldGridSection?.title || 'World News'}</h2>
            <Link href={worldGridSection?.view_all_url || '/posts'} className="primary-text-blue text-decoration-none fw-semibold">
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
          <h2 className="primary-text-blue mb-0">{businessSection?.title || 'Business'}</h2>
          <Link href={businessSection?.view_all_url || '/posts'} className="primary-text-blue text-decoration-none fw-semibold">
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
      {(homePageData?.for_investors_organizations_heading || homePageData?.for_investors_organizations_main_heading || (homePageData?.for_investors_organizations_features && homePageData.for_investors_organizations_features.length > 0)) && (
        <section className="hm-trust p-60">
          <div className="container">
            <div className="text-center col-10 m-auto mb-5">
              {homePageData?.for_investors_organizations_heading && (
                <p className="text-uppercase primary-text-blue fw-bold small mb-3">
                  {homePageData.for_investors_organizations_heading}
                </p>
              )}
              {homePageData?.for_investors_organizations_main_heading && (
                <h2 className="display-5 fw-bold mb-4">
                  {homePageData.for_investors_organizations_main_heading}
                </h2>
              )}
              {homePageData?.for_investors_organizations_description && (
                <div
                  className="text-secondary mx-auto col-12 col-sm-7"
                  dangerouslySetInnerHTML={{ __html: homePageData.for_investors_organizations_description }}
                />
              )}
            </div>

            {(homePageData?.for_investors_organizations_features && homePageData.for_investors_organizations_features.length > 0) && (
              <div className="row row-cols-1 row-cols-md-3 g-4 mb-5">
                {homePageData.for_investors_organizations_features.map((feature, idx) => {
                  if (!feature.title && !feature.description && !feature.image) return null;
                  const icons = ['fa-chart-line', 'fa-file-invoice', 'fa-earth-americas'];
                  const iconClass = icons[idx % icons.length];

                  return (
                    <div className="col" key={feature.id || idx}>
                      <div className="card bg-white h-100 text-center p-sm-5 p-3 hover-lift border-1 border-lighter bg-white">
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
                              <i className={`fa-solid ${iconClass} fs-5 primary-text-blue`}></i>
                            )}
                          </div>
                        </div>
                        {feature.title && <h3 className="h5 fw-bold mb-2 trust-card-title text-font-family ">{feature.title}</h3>}
                        {feature.description && <p className="trust-card-text">{feature.description}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {(homePageData?.request_a_quote_button_text || homePageData?.register_for_access_button_text) && (
              <div className="text-center">
                {homePageData?.request_a_quote_button_text && (
                  <Link href={homePageData?.request_a_quote_button_url || '#'} className="btn btn-premium-primary btn-lg px-5 py-3 me-3 d-inline-flex align-items-center gap-2">
                    {homePageData.request_a_quote_button_text}
                    <i className="fa-solid fa-arrow-right small"></i>
                  </Link>
                )}
                {homePageData?.register_for_access_button_text && (
                  <Link href={homePageData?.register_for_access_button_url || '#'} className="btn btn-premium-outline btn-lg px-5 py-3 d-inline-flex align-items-center gap-2">
                    {homePageData.register_for_access_button_text}
                    <i className="fa-solid fa-arrow-right small"></i>
                  </Link>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* 8️⃣ Newsletter Subscription Section */}
      {(homePageData?.show_newsletter_section !== '0') && (
        <section className="container-fluid p-80 newsletter-section-main" id="newsletter-section">
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
