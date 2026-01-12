'use client';

import Link from 'next/link';
import { GlobalThemeSettings } from '@/types/wordpress';

interface Props {
    settings: GlobalThemeSettings | null;
}

export default function GlobalCallToAction({ settings }: Props) {
    // Falls back to design defaults if API returns null
    const heading = settings?.single_post_cta_heading || "Stay Ahead of the Markets";
    const description = settings?.single_post_cta_description || "Get breaking news, expert insights, and market analysis delivered directly to your inbox.";

    // Only hide if we really have no content and no defaults (unlikely with hardcoded defaults)
    if (!heading && !settings?.subscribe_to_newsletter_button_text) {
        return null;
    }

    return (
        <section className="bg-gradient-c2 p-80 rounded-4">
            <div className="container">
                <div className="text-center mx-auto col-md-6 col-12">
                    <h2 className="display-5 fw-bold mb-3 font-serif text-dark">
                        {heading}
                    </h2>
                    <p className="text-secondary mb-5 fs-18">
                        {description}
                    </p>

                    <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
                        <Link
                            href={settings?.subscribe_to_newsletter_button_url || '#'}
                            className="btn btn-premium-primary py-3 px-4 d-inline-flex align-items-center justify-content-center"
                        >
                            {settings?.subscribe_to_newsletter_button_text || "Subscribe to Newsletter"}
                            <i className="fa-solid fa-arrow-right ms-2"></i>
                        </Link>

                        <Link
                            href={settings?.register_for_market_access_button_url || '#'}
                            className="btn btn-premium-outline py-3 px-4 d-inline-flex align-items-center justify-content-center"
                        >
                            {settings?.register_for_market_access_button_text || "Register for Market Access"}
                            <i className="fa-solid fa-arrow-right ms-2"></i>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
