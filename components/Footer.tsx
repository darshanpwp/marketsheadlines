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
    <footer className="bg-dark text-white py-5 mt-auto">
      <div className="container">
        <div className="row g-4">
          {/* Logo & Tagline */}
          <div className="col-lg-4 mb-4 mb-lg-0">
            <h3 className="h4 fw-bold mb-3 text-white">M|H MARKETS & HEADLINES</h3>
            <p className="text-secondary opacity-75">
              Your trusted source for global financial news and market intelligence.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="col-lg-8">
            <div className="row g-4">
              {footerSections.map((section) => (
                <div key={section.title} className="col-6 col-md-3">
                  <h5 className="h6 fw-bold mb-3 text-uppercase small tracking-wider">{section.title}</h5>
                  <ul className="list-unstyled">
                    {(section.items.length > 0 ? section.items : section.fallback).map((item: any, idx) => (
                      <li key={item.ID || idx} className="mb-2">
                        <Link
                          href={(item.url || '').replace('https://dev-new-marketsheadlines.pantheonsite.io', '') || '/'}
                          className="text-secondary text-decoration-none hover-white transition-all small"
                          style={{ transition: 'color 0.2s' }}
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
          <p className="text-secondary mb-2 mb-md-0 small">
            © {new Date().getFullYear()} Markets Headlines, Inc. All rights reserved.
          </p>
          <div className="d-flex gap-3">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-secondary text-decoration-none hover-white">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
              </svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-secondary text-decoration-none hover-white">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-secondary text-decoration-none hover-white">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
