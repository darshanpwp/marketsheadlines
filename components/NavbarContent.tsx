'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { WordPressMenuItem, SiteIdentity } from '@/types/wordpress';

interface NavbarContentProps {
    menuItems: WordPressMenuItem[];
    siteIdentity?: SiteIdentity;
}

export default function NavbarContent({ menuItems, siteIdentity }: NavbarContentProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

    // Default values if API fails
    const siteTitle = siteIdentity?.title || 'Market Headlines';
    const logoUrl = siteIdentity?.logoUrl;

    const toggleMenu = () => setIsOpen(!isOpen);
    const toggleDropdown = (id: number) => {
        setActiveDropdown(activeDropdown === id ? null : id);
    };
    const closeMenu = () => {
        setIsOpen(false);
        setActiveDropdown(null);
    };

    // Lock scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    return (
        <nav className="navbar navbar-expand-lg navbar-light py-3">
            <div className="container">
                {/* Logo */}
                <Link
                    href="/"
                    className="navbar-brand d-flex align-items-center logo-link"
                    onClick={closeMenu}
                    aria-label={siteTitle}
                >
                    {logoUrl ? (
                        <div className="position-relative" style={{ width: '154px', height: '33px' }}>
                            <Image
                                src={logoUrl}
                                alt={siteTitle}
                                fill
                                className="object-fit-contain"
                                sizes="180px"
                                priority
                            />
                        </div>
                    ) : (
                        <span className="fs-3 fw-bold navbar-brand-text">{siteTitle}</span>
                    )}
                </Link>

                {/* Mobile Toggle (Hamburger) */}
                <div
                    className={`hamburger d-lg-none ${isOpen ? 'open' : ''} mobile-toggle`}
                    onClick={toggleMenu}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </div>

                {/* Navbar Links & Overlay */}
                <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarNav">
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                        {menuItems.map((item: WordPressMenuItem) => {
                            const hasChildren = item.child_items && item.child_items.length > 0;
                            const href = item.url.replace('https://dev-new-marketsheadlines.pantheonsite.io', '') || '/';

                            if (hasChildren) {
                                const isDropdownActive = activeDropdown === item.ID;
                                return (
                                    <li key={item.ID} className={`nav-item dropdown ${isDropdownActive ? 'show' : ''}`}>
                                        <a
                                            className="nav-link dropdown-toggle fw-semibold px-lg-3 nav-link-central"
                                            href="#"
                                            role="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                toggleDropdown(item.ID);
                                            }}
                                            aria-expanded={isDropdownActive}
                                        >
                                            {item.title}
                                            <i className={`fa-solid fa-chevron-down ms-1 transition-all d-none d-lg-inline-block chevron-icon-nav ${isDropdownActive ? 'rotate-180' : ''}`}></i>
                                        </a>
                                        <ul className={`dropdown-menu border-0 shadow-lg p-3 premium-dropdown ${isDropdownActive ? 'show' : ''}`}>
                                            {item.child_items?.map((child: WordPressMenuItem) => (
                                                <li key={child.ID}>
                                                    <Link
                                                        className="dropdown-item py-2 px-3 fw-medium"
                                                        href={child.url.replace('https://dev-new-marketsheadlines.pantheonsite.io', '') || '/'}
                                                        onClick={closeMenu}
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
                                        className="nav-link fw-semibold px-lg-3 nav-link-central"
                                        href={href}
                                        onClick={closeMenu}
                                    >
                                        {item.title}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>


                </div>
            </div>
        </nav>
    );
}
