'use client';

import Link from 'next/link';
import { GlobalThemeSettings } from '@/types/wordpress';
import { SITE_URL } from '@/lib/constants';

interface Props {
    settings: GlobalThemeSettings | null;
}

export default function GlobalCallToAction({ settings }: Props) {
    // Strictly use API data, no hardcoded defaults
    const heading = settings?.single_post_cta_heading;
    const description = settings?.single_post_cta_description;
    const subscribeText = settings?.subscribe_to_newsletter_button_text;
    const subscribeUrl = settings?.subscribe_to_newsletter_button_url;
    const registerText = settings?.register_for_market_access_button_text;
    const registerUrl = settings?.register_for_market_access_button_url;

    // Use 'Stay Ahead of the Markets' as default heading if missing, matching user request/screenshot
    const displayHeading = heading || 'Stay Ahead of the Markets';

    // Default description if missing
    const displayDescription = description || 'Get breaking news, expert insights, and market analysis delivered directly to your inbox.';

    // Helper to normalize URLs to frontend
    const normalizeUrl = (url: string | undefined) => {
        if (!url) return '#';
        // Replace backend domain with frontend SITE_URL
        let normalized = url.replace('https://news.marketsheadlines.com', SITE_URL);
        // Ensure we don't end up with just the domain if it was meant to be relative
        if (normalized === 'https://news.marketsheadlines.com/') return '/';
        return normalized;
    };

    const displaySubscribeUrl = normalizeUrl(subscribeUrl);
    const displayRegisterUrl = normalizeUrl(registerUrl);

    // Remove the entire section if no valid content is available (checking heading or buttons)
    if ((!displayHeading && !displayDescription) && (!subscribeText && !registerText)) {
        return null;
    }

    return (
        <section className="bg-gradient-c2 p-80 rounded-4">
            <div className="container">
                <div className="text-center mx-auto col-md-6 col-12">
                    {displayHeading && (
                        <h2 className="display-5 fw-bold mb-3 font-serif primary-text-blue">
                            {displayHeading}
                        </h2>
                    )}
                    {displayDescription && (
                        <p className="text-secondary mb-5 fs-18">
                            {displayDescription}
                        </p>
                    )}

                    <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
                        {subscribeText && (
                            <Link
                                href={displaySubscribeUrl}
                                className="btn btn-premium-primary py-3 px-4 d-inline-flex align-items-center justify-content-center"
                            >
                                {subscribeText}
                                <i className="fa-solid fa-arrow-right ms-2"></i>
                            </Link>
                        )}

                        {registerText && (
                            <Link
                                href={displayRegisterUrl}
                                className="btn btn-premium-outline py-3 px-4 d-inline-flex align-items-center justify-content-center"
                            >
                                {registerText}
                                <i className="fa-solid fa-arrow-right ms-2"></i>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
