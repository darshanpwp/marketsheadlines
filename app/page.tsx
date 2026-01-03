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
  const posts = await getPostsWithDetails();
  const pages = await getPagesWithDetails();
  
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
                  className={`carousel-item ${index === 0 ? 'active' : ''} position-relative`}
                  style={{ minHeight: '600px' }}
                >
                  {/* Background Image */}
                  <div 
                    className="position-absolute top-0 start-0 w-100 h-100"
                    style={{
                      backgroundImage: post.featuredMediaDetails?.source_url 
                        ? `url(${post.featuredMediaDetails.source_url})`
                        : 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      zIndex: 0,
                    }}
                  >
                    {/* Dark Overlay */}
                    <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark" style={{ opacity: 0.6 }}></div>
                  </div>

                  {/* Content Overlay */}
                  <div className="container position-relative h-100" style={{ zIndex: 1 }}>
                    <div className="row align-items-center h-100">
                      <div className="col-lg-6 col-md-8 text-white py-5 hero-content">
                        {post.categoryDetails?.[0] && (
                          <span className="badge bg-primary mb-3 px-3 py-2">
                            {post.categoryDetails[0].name}
                          </span>
                        )}
                        <h1 className="display-4 fw-bold mb-4 hero-headline">
                          {post.title}
                        </h1>
                        <p className="lead mb-4 hero-excerpt">
                          {post.excerpt?.replace(/<[^>]*>/g, '').substring(0, 150) || 
                           'Stay informed with the latest market insights and financial news.'}
                        </p>
                        {post.authorDetails && (
                          <div className="d-flex align-items-center gap-2 mb-4 hero-meta">
                            <span className="small">{post.authorDetails.name}</span>
                            <span className="small">•</span>
                            <span className="small">{calculateReadingTime(post.content)} min read</span>
                          </div>
                        )}
                        <Link 
                          href={`/posts/${post.slug}`}
                          className="btn btn-light btn-lg px-4 hero-cta"
                        >
                          Read Full Story
                          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="ms-2">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
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
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>

            {/* Carousel Controls - Next */}
            <button 
              className="carousel-control-next" 
              type="button" 
              data-bs-target="#heroCarousel" 
              data-bs-slide="next"
            >
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        ) : (
          // Fallback if no posts available
          <div 
            className="position-relative"
            style={{ 
              minHeight: '600px',
              background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
            }}
          >
            <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark" style={{ opacity: 0.6 }}></div>
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
                  <Link href="/posts" className="btn btn-light btn-lg px-4">
                    Read Full Story
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="ms-2">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 2️⃣ Trending Now + Market Overview */}
      <section className="container py-5">
        <div className="row g-4">
          {/* Left: Trending Now */}
          <div className="col-lg-8">
            <h2 className="display-5 fw-bold mb-4">Trending Now</h2>
            <div className="mb-4">
              {trendingPosts.map((post, index) => (
                <TrendingListItem key={post.id} post={post} index={index + 1} />
              ))}
            </div>
            <Link href="/posts" className="text-primary text-decoration-none fw-semibold">
              View All Trending Stories
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="ms-2">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          {/* Right: Market Overview */}
          <div className="col-lg-4">
            <MarketOverview />
          </div>
        </div>
      </section>

      {/* 3️⃣ Market Intelligence Promo Section */}
      <section className="container py-5">
        <div className="row align-items-center g-5">
          <div className="col-lg-6">
            <p className="text-uppercase text-primary fw-bold small mb-2">MARKET INTELLIGENCE</p>
            <h2 className="display-5 fw-bold mb-4">Turn Headlines Into Market Intelligence</h2>
            <p className="lead text-secondary mb-4">
              Markets move fast. We help you stay ahead with curated global news, regulatory disclosures, and market-moving insights — all in one place.
            </p>
            
            <ul className="list-unstyled mb-4">
              <li className="d-flex align-items-start gap-3 mb-3">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#1e3a8a" className="mt-1">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <strong>Real-time global market coverage</strong>
                </div>
              </li>
              <li className="d-flex align-items-start gap-3 mb-3">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#1e3a8a" className="mt-1">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <strong>Regulatory filings from major authorities</strong>
                </div>
              </li>
              <li className="d-flex align-items-start gap-3 mb-3">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#1e3a8a" className="mt-1">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <strong>Sector-specific intelligence (Energy, Pharma, ETFs & more)</strong>
                </div>
              </li>
            </ul>
            
            <div className="d-flex flex-wrap gap-3">
              <Link href="/get-market-intelligence" className="btn btn-primary btn-lg px-4">
                Get Market Intelligence
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="ms-2">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link href="/coverage" className="btn btn-outline-primary btn-lg px-4">
                Explore Coverage
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="ms-2">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
          
          <div className="col-lg-6">
            <div className="position-relative aspect-video rounded overflow-hidden">
              <div className="w-100 h-100 bg-light d-flex align-items-center justify-content-center">
                <svg width="120" height="120" fill="none" viewBox="0 0 24 24" stroke="#1e3a8a" opacity="0.3">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
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
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="ms-2">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
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
              <div className="card border-0 shadow-sm h-100 hover-lift">
                <Link href={`/posts/${post.slug}`} className="text-decoration-none">
                  {post.featuredMediaDetails?.source_url ? (
                    <div className="position-relative aspect-video overflow-hidden">
                      <Image
                        src={post.featuredMediaDetails.source_url}
                        alt={post.featuredMediaDetails.alt_text || post.title}
                        fill
                        className="object-fit-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                    </div>
                  ) : (
                    <div className="position-relative aspect-video bg-light"></div>
                  )}
                  <div className="card-body">
                    {post.categoryDetails?.[0] && (
                      <span className="badge bg-primary mb-2">{post.categoryDetails[0].name}</span>
                    )}
                    <h3 className="h6 fw-semibold mb-2 text-dark">{post.title}</h3>
                    {post.authorDetails && (
                      <div className="d-flex align-items-center gap-2 text-secondary small">
                        <span>{post.authorDetails.name}</span>
                        <span>•</span>
                        <span>{calculateReadingTime(post.content)} min read</span>
                      </div>
                    )}
                  </div>
                </Link>
              </div>
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
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="ms-2">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {(businessPosts.length > 0 ? businessPosts : posts.slice(0, 3)).map((post) => (
            <div key={post.id} className="col">
              <div className="card border-0 shadow-sm h-100 hover-lift">
                <Link href={`/posts/${post.slug}`} className="text-decoration-none">
                  {post.featuredMediaDetails?.source_url ? (
                    <div className="position-relative" style={{ height: '200px' }}>
                      <Image
                        src={post.featuredMediaDetails.source_url}
                        alt={post.featuredMediaDetails.alt_text || post.title}
                        fill
                        className="object-fit-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  ) : (
                    <div className="bg-light" style={{ height: '200px' }}></div>
                  )}
                  <div className="card-body">
                    <h3 className="h5 fw-semibold mb-3 text-dark">{post.title}</h3>
                    <p className="text-secondary small mb-3 line-clamp-3">
                      {post.excerpt?.replace(/<[^>]*>/g, '').substring(0, 120) || 'Read more...'}
                    </p>
                    {post.authorDetails && (
                      <div className="d-flex align-items-center gap-2 text-secondary small">
                        <span>{post.authorDetails.name}</span>
                        <span>•</span>
                        <span>{calculateReadingTime(post.content)} min read</span>
                      </div>
                    )}
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7️⃣ Trust / Value Proposition Section */}
      <section className="container py-5">
        <div className="text-center mb-5">
          <p className="text-uppercase text-primary fw-bold small mb-2">FOR INVESTORS & ORGANIZATIONS</p>
          <h2 className="display-5 fw-bold mb-4">Trusted by Professionals Tracking Global Markets</h2>
          <p className="lead text-secondary mx-auto" style={{ maxWidth: '700px' }}>
            Whether you're an investor, analyst, or organization, Markets Headlines delivers accurate, timely, and actionable market information.
          </p>
        </div>
        
        <div className="row row-cols-1 row-cols-md-3 g-4 mb-5">
          <div className="col">
            <div className="card border-0 shadow-sm h-100 text-center p-4">
              <div className="mb-3">
                <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="#1e3a8a" className="mx-auto">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="h5 fw-bold mb-3">Market-Moving News</h3>
              <p className="text-secondary">Global coverage of equities, commodities, ETFs, and sectors.</p>
            </div>
          </div>
          <div className="col">
            <div className="card border-0 shadow-sm h-100 text-center p-4">
              <div className="mb-3">
                <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="#1e3a8a" className="mx-auto">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="h5 fw-bold mb-3">Regulatory & Exchange Data</h3>
              <p className="text-secondary">Access filings from SEC, FDA, SEDAR, and major exchanges.</p>
            </div>
          </div>
          <div className="col">
            <div className="card border-0 shadow-sm h-100 text-center p-4">
              <div className="mb-3">
                <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="#1e3a8a" className="mx-auto">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="h5 fw-bold mb-3">Global Perspective</h3>
              <p className="text-secondary">Insights across regions, industries, and asset classes.</p>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <Link href="/request-demo" className="btn btn-primary btn-lg px-4 me-3">
            Request a Quote
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="ms-2">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <Link href="/registration" className="btn btn-outline-primary btn-lg px-4">
            Register for Access
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="ms-2">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* 8️⃣ Newsletter Subscription Section */}
      <section className="container-fluid py-5" style={{ backgroundColor: '#1e3a8a' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center text-white">
              <h2 className="display-5 fw-bold mb-3">Stay Ahead of the Markets</h2>
              <p className="lead mb-4">
                Get expert insights, breaking news, and market analysis delivered directly to your inbox
              </p>
              
              <form className="mx-auto" style={{ maxWidth: '600px' }}>
                <div className="mb-4">
                  <input
                    type="email"
                    className="form-control form-control-lg rounded-pill"
                    placeholder="Enter your email address"
                    required
                  />
                </div>
                
                <div className="d-flex flex-wrap justify-content-center gap-4 mb-4">
                  <div className="form-check text-white">
                    <input className="form-check-input" type="checkbox" id="daily" defaultChecked />
                    <label className="form-check-label" htmlFor="daily">
                      Daily Market Brief
                    </label>
                  </div>
                  <div className="form-check text-white">
                    <input className="form-check-input" type="checkbox" id="weekly" />
                    <label className="form-check-label" htmlFor="weekly">
                      Weekly Deep Dive
                    </label>
                  </div>
                  <div className="form-check text-white">
                    <input className="form-check-input" type="checkbox" id="breaking" defaultChecked />
                    <label className="form-check-label" htmlFor="breaking">
                      Breaking News Alerts
                    </label>
                  </div>
                </div>
                
                <button type="submit" className="btn btn-light btn-lg px-5 rounded-pill">
                  Subscribe to Newsletter
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="ms-2">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
