import Link from 'next/link';
import { getMenu } from '@/lib/wordpress/api';
import { WordPressMenu, WordPressMenuItem } from '@/types/wordpress';

/**
 * Header component that fetches and displays the main navigation menu from WordPress.
 */
export default async function Header() {
  const menu: WordPressMenu | null = await getMenu('main_menu');
  const menuItems = menu?.items || [];

  return (
    <header className="fixed-top w-100 bg-white border-bottom shadow-sm">
      <nav className="navbar navbar-expand-lg navbar-light py-2">
        <div className="container">
          {/* Logo */}
          <Link
            href="/"
            className="navbar-brand d-flex align-items-center"
          >
            <span className="fs-4 fw-bold text-primary">Market Headlines</span>
          </Link>

          {/* Mobile Toggle */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Navbar Links */}
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
              {menuItems.map((item: WordPressMenuItem) => {
                const hasChildren = item.child_items && item.child_items.length > 0;
                const href = item.url.replace('https://dev-new-marketsheadlines.pantheonsite.io', '') || '/';

                if (hasChildren) {
                  return (
                    <li key={item.ID} className="nav-item dropdown">
                      <a
                        className="nav-link dropdown-toggle fw-medium text-dark"
                        href="#"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        id={`dropdown-${item.ID}`}
                      >
                        {item.title}
                      </a>
                      <ul className="dropdown-menu border-0 shadow-sm" aria-labelledby={`dropdown-${item.ID}`}>
                        {item.child_items?.map((child: WordPressMenuItem) => (
                          <li key={child.ID}>
                            <Link
                              className="dropdown-item py-2"
                              href={child.url.replace('https://dev-new-marketsheadlines.pantheonsite.io', '') || '/'}
                            >
                              {child.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  );
                }

                return (
                  <li key={item.ID} className="nav-item">
                    <Link
                      className="nav-link fw-medium text-dark"
                      href={href}
                    >
                      {item.title}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Auth Buttons */}
            <div className="d-flex align-items-center gap-2">
              <Link
                href="/login"
                className="btn btn-link text-decoration-none text-dark fw-medium"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="btn btn-primary px-4 fw-medium shadow-sm"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
