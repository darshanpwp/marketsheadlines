import Link from 'next/link';
import Image from 'next/image';
import { getMenu, getMarketHeadlinesSettings } from '@/lib/wordpress/api';
import { WordPressMenu, WordPressMenuItem } from '@/types/wordpress';

/**
 * Footer component that dynamically fetches menus and settings from WordPress.
 */
export default async function Footer() {
  // Fetch menus and settings in parallel
  const [companyMenu, productsMenu, resourcesMenu, legalMenu, settings] = await Promise.all([
    getMenu('company'),
    getMenu('products'),
    getMenu('resources'),
    getMenu('legal'),
    getMarketHeadlinesSettings()
  ]);

  const footerSections = [
    {
      title: 'Company',
      items: companyMenu?.items || [],
      fallback: [
        { title: 'About Us', url: '/about' },
        { title: 'Careers', url: '/careers' },
        { title: 'Press', url: '/press' },
        { title: 'Contact', url: '/contact' }
      ]
    },
    {
      title: 'Products',
      items: productsMenu?.items || [],
      fallback: [
        { title: 'Market Intelligence', url: '/market-intelligence' },
        { title: 'Research Hub', url: '/research-hub' },
        { title: 'Newsletter', url: '/newsletter' },
        { title: 'Premium Access', url: '/premium-access' }
      ]
    },
    {
      title: 'Resources',
      items: resourcesMenu?.items || [],
      fallback: [
        { title: 'Help Center', url: '/help' },
        { title: 'API Documentation', url: '/api-docs' },
        { title: 'Blog', url: '/blog' },
        { title: 'Events', url: '/events' }
      ]
    },
    {
      title: 'Legal',
      items: legalMenu?.items || [],
      fallback: [
        { title: 'Terms of Use', url: '/terms' },
        { title: 'Privacy Policy', url: '/privacy' },
        { title: 'Cookie Policy', url: '/cookies' },
        { title: 'Accessibility', url: '/accessibility' }
      ]
    }
  ];

  // Helper to get icon class based on URL
  const getSocialIcon = (url: string) => {
    if (url.includes('twitter.com') || url.includes('x.com')) return 'fa-brands fa-x-twitter';
    if (url.includes('linkedin.com')) return 'fa-brands fa-linkedin-in';
    if (url.includes('facebook.com')) return 'fa-brands fa-facebook-f';
    if (url.includes('instagram.com')) return 'fa-brands fa-instagram';
    if (url.includes('youtube.com')) return 'fa-brands fa-youtube';
    return 'fa-solid fa-link';
  };

  return (
    <footer className="p-60 mt-auto site-footer">
      <div className="container">
        <div className="row g-4">
          {/* Logo & Tagline */}
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

          {/* Navigation Links */}
          <div className="col-lg-8">
            <div className="row g-4">
              {footerSections.map((section) => (
                <div key={section.title} className="col-6 col-md-3">
                  <h5 className="h6 fw-bold mb-3 text-uppercase text-white text-font-family small tracking-wider">{section.title}</h5>
                  <ul className="list-unstyled">
                    {(section.items.length > 0 ? section.items : section.fallback).map((item: any, idx) => (
                      <li key={item.ID || idx} className="mb-2">
                        <Link
                          href={(item.url || '').replace('https://dev-new-marketsheadlines.pantheonsite.io', '') || '/'}
                          className="color-menu-f text-decoration-none hover-white transition-all small footer-link"
                        >
                          {item.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        <hr className="my-4 border-secondary opacity-25" />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
          <p className="color-menu-f mb-2 mb-md-0 small">
            {settings?.footer_copyright || `© ${new Date().getFullYear()} Markets Headlines, Inc. All rights reserved.`}
          </p>
          <div className="d-flex gap-4">
            {settings?.social && settings.social.length > 0 ? (
              settings.social.map((url, index) => (
                <a key={index} href={url} target="_blank" rel="noopener noreferrer" className="color-menu-f text-decoration-none hover-white fs-5">
                  <i className={getSocialIcon(url)}></i>
                </a>
              ))
            ) : (
              // Fallback social links
              <>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="color-menu-f text-decoration-none hover-white fs-5">
                  <i className="fa-brands fa-x-twitter"></i>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="color-menu-f text-decoration-none hover-white fs-5">
                  <i className="fa-brands fa-linkedin-in"></i>
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="color-menu-f text-decoration-none hover-white fs-5">
                  <i className="fa-brands fa-facebook-f"></i>
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
