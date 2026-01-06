import Link from 'next/link';
import { getMenu } from '@/lib/wordpress/api';
import { WordPressMenu, WordPressMenuItem } from '@/types/wordpress';

/**
 * Footer component that dynamically fetches menus from WordPress with static fallbacks.
 */
export default async function Footer() {
  // Fetch menus in parallel
  const [companyMenu, productsMenu, resourcesMenu, legalMenu] = await Promise.all([
    getMenu('company'),
    getMenu('products'),
    getMenu('resources'),
    getMenu('legal')
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

  return (
    <footer className="p-60 mt-auto site-footer">
      <div className="container">
        <div className="row g-4">
          {/* Logo & Tagline */}
          <div className="col-lg-4 mb-4 mb-lg-0">
            <h3 className="h4 fw-bold mb-3 text-white">M|H MARKETS & HEADLINES</h3>
            <p className="color-menu-f opacity-75">
              Your trusted source for global financial news and market intelligence.
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
            © {new Date().getFullYear()} Markets Headlines, Inc. All rights reserved.
          </p>
          <div className="d-flex gap-4">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="color-menu-f text-decoration-none hover-white fs-5">
              <i className="fa-brands fa-x-twitter"></i>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="color-menu-f text-decoration-none hover-white fs-5">
              <i className="fa-brands fa-linkedin-in"></i>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="color-menu-f text-decoration-none hover-white fs-5">
              <i className="fa-brands fa-facebook-f"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
