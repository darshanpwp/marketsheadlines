import Link from 'next/link';
import Image from 'next/image';
import { getMenu, getMarketHeadlinesSettings, WORDPRESS_URL } from '@/lib/wordpress/api';
import { WordPressMenu, WordPressMenuItem } from '@/types/wordpress';

/**
 * Footer component that dynamically fetches menus and settings from WordPress.
 */
export default async function Footer() {
  // Fetch settings and the single 'quick-links' menu
  const [quickLinksMenu, settings] = await Promise.all([
    getMenu('quick-links'),
    getMarketHeadlinesSettings()
  ]);

  const quickLinksItems = quickLinksMenu?.items || [];



  return (
    <footer className="p-60 mt-auto site-footer">
      <div className="container">
        <div className="row g-5">
          {/* Logo & Tagline (Left Column) */}
          <div className="col-lg-4 mb-4 mb-lg-0">
            {settings?.footer_logo || settings?.logo ? (
              <div className="mb-3 position-relative" style={{ width: '180px', height: '60px' }}>
                <Link href="/" className="d-block w-100 h-100 position-relative">
                  <Image
                    src={settings?.footer_logo || settings?.logo || ''}
                    alt={settings?.name || 'Market Headlines'}
                    fill
                    className="object-fit-contain object-position-left"
                    sizes="(max-width: 768px) 150px, 180px"
                  />
                </Link>
              </div>
            ) : (
              <h3 className="h4 fw-bold mb-3 text-white">
                <Link href="/" className="text-white text-decoration-none">
                  {settings?.footer_title || 'M|H MARKETS & HEADLINES'}
                </Link>
              </h3>
            )}
            <p className="color-menu-f opacity-75">
              {settings?.footer_sub_title || 'Your trusted source for global financial news and market intelligence.'}
            </p>
          </div>

          {/* Quick Links (Right Column) */}
          <div className="col-lg-8">
            <div className="mb-4">
              <h5 className="h6 fw-bold mb-4 fw-semibold text-white text-font-family small tracking-wider">Quick Links</h5>

              {/* Responsive 3-column grid for links */}
              <ul className="list-unstyled row row-cols-1 row-cols-sm-2 row-cols-md-3 g-2">
                {quickLinksItems.map((item: WordPressMenuItem, idx: number) => (
                  <li key={item.ID || idx} className="col">
                    <Link
                      href={(item.url || '').replace('https://dev-new-marketsheadlines.pantheonsite.io', '').replace(WORDPRESS_URL, '') || '/'}
                      className="color-menu-f text-decoration-none hover-white transition-all small footer-link d-inline-block py-1"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <hr className="my-4 border-secondary opacity-25" />

        <div className="text-center">
          <p className="color-menu-f mb-0 small">
            {settings?.footer_copyright || `© ${new Date().getFullYear()} Markets Headlines, Inc. All rights reserved.`}
          </p>
        </div>
      </div>
    </footer>
  );
}
