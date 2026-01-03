'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const closeNavbar = () => {
    setIsOpen(false);
  };

  return (
    <nav 
      className="navbar navbar-expand-lg navbar-light bg-white position-sticky top-0 shadow-sm"
      style={{ zIndex: 1030 }}
    >
      <div className="container">
        {/* Logo */}
        <Link 
          className="navbar-brand d-flex align-items-center" 
          href="/"
          onClick={closeNavbar}
          aria-label="Markets & Headlines Home"
        >
          <span className="fw-bold fs-4 text-dark">
            Markets & Headlines
          </span>
        </Link>

        {/* Hamburger Toggle Button */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleNavbar}
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
          aria-controls="navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible Navbar Content */}
        <div 
          className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`}
          id="navbarNav"
        >
          <ul className="navbar-nav ms-auto align-items-center gap-lg-3">
            {/* Home */}
            <li className="nav-item">
              <Link 
                className="nav-link fw-medium text-dark" 
                href="/"
                onClick={closeNavbar}
              >
                Home
              </Link>
            </li>

            {/* Advisory Services */}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle fw-medium text-dark"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                id="advisoryServicesDropdown"
                onClick={(e) => e.preventDefault()}
              >
                Advisory Services
              </a>
              <ul className="dropdown-menu" aria-labelledby="advisoryServicesDropdown">
                <li>
                  <Link 
                    className="dropdown-item" 
                    href="/advisory-services"
                    onClick={closeNavbar}
                  >
                    Overview
                  </Link>
                </li>
                <li>
                  <Link 
                    className="dropdown-item" 
                    href="/advisory-services/consulting"
                    onClick={closeNavbar}
                  >
                    Consulting
                  </Link>
                </li>
                <li>
                  <Link 
                    className="dropdown-item" 
                    href="/advisory-services/strategy"
                    onClick={closeNavbar}
                  >
                    Strategy
                  </Link>
                </li>
              </ul>
            </li>

            {/* Media Services */}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle fw-medium text-dark"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                id="mediaServicesDropdown"
                onClick={(e) => e.preventDefault()}
              >
                Media Services
              </a>
              <ul className="dropdown-menu" aria-labelledby="mediaServicesDropdown">
                <li>
                  <Link 
                    className="dropdown-item" 
                    href="/media-services"
                    onClick={closeNavbar}
                  >
                    Overview
                  </Link>
                </li>
                <li>
                  <Link 
                    className="dropdown-item" 
                    href="/media-services/press-releases"
                    onClick={closeNavbar}
                  >
                    Press Releases
                  </Link>
                </li>
                <li>
                  <Link 
                    className="dropdown-item" 
                    href="/media-services/content"
                    onClick={closeNavbar}
                  >
                    Content Creation
                  </Link>
                </li>
              </ul>
            </li>

            {/* Disclosure Services */}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle fw-medium text-dark"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                id="disclosureServicesDropdown"
                onClick={(e) => e.preventDefault()}
              >
                Disclosure Services
              </a>
              <ul className="dropdown-menu" aria-labelledby="disclosureServicesDropdown">
                <li>
                  <Link 
                    className="dropdown-item" 
                    href="/disclosure-services"
                    onClick={closeNavbar}
                  >
                    Overview
                  </Link>
                </li>
                <li>
                  <Link 
                    className="dropdown-item" 
                    href="/disclosure-services/compliance"
                    onClick={closeNavbar}
                  >
                    Compliance
                  </Link>
                </li>
                <li>
                  <Link 
                    className="dropdown-item" 
                    href="/disclosure-services/reporting"
                    onClick={closeNavbar}
                  >
                    Reporting
                  </Link>
                </li>
              </ul>
            </li>

            {/* Registration */}
            <li className="nav-item">
              <Link 
                className="nav-link fw-medium text-dark" 
                href="/registration"
                onClick={closeNavbar}
              >
                Registration
              </Link>
            </li>

            {/* Contact Us */}
            <li className="nav-item">
              <Link 
                className="nav-link fw-medium text-dark" 
                href="/contact"
                onClick={closeNavbar}
              >
                Contact Us
              </Link>
            </li>

            {/* CTA Button */}
            <li className="nav-item">
              <Link
                className="btn btn-primary rounded-pill px-4 py-2 fw-semibold"
                href="/get-market-intelligence"
                onClick={closeNavbar}
                style={{
                  backgroundColor: '#1e3a8a',
                  borderColor: '#1e3a8a',
                  whiteSpace: 'nowrap',
                }}
              >
                Get Market Intelligence
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

