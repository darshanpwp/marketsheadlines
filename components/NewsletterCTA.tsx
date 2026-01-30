'use client';

import Link from 'next/link';

export default function NewsletterCTA() {
    return (
        <div className="p-32 my-5 border border-lighter light-blue-bg newsletter-cta-card">
            <div className="newsletter-cta-content-wrapper">
                <h2 className="fw-semibold mb-2 newsletter-cta-title">
                    Get Deeper Market Intelligence
                </h2>
                <p className="mb-4 newsletter-cta-body fs-6">
                    Access regulatory filings, exchange updates, and curated market insights beyond the headlines.
                </p>
                <Link
                    href="#newsletter-section"
                    className="btn btn-premium-primary d-inline-flex align-items-center gap-2 fw-bold px-4 py-3"
                >
                    <span>Get Market Intelligence</span>
                    <i className="fa-solid fa-chevron-right ms-2 small"></i>
                </Link>
            </div>
        </div>
    );
}
