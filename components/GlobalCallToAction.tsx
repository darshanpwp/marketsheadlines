'use client';

import Link from 'next/link';
import { GlobalThemeSettings } from '@/types/wordpress';

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

    // Remove the entire section if no valid content is available (checking heading as minimum)
    if (!heading || !settings) {
        return null;
    }

    return (
        <section className="bg-gradient-c2 p-80 rounded-4">
            <div className="container">
                <div className="text-center mx-auto col-md-6 col-12">
                    {heading && (
                        <h2 className="display-5 fw-bold mb-3 font-serif text-dark">
                            {heading}
                        </h2>
                    )}
                    {description && (
                        <p className="text-secondary mb-5 fs-18">
                            {description}
                        </p>
                    )}

                    <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
                        {subscribeText && subscribeUrl && (
                            <Link
                                href={subscribeUrl}
                                className="btn btn-premium-primary py-3 px-4 d-inline-flex align-items-center justify-content-center"
                            >
                                {subscribeText}
                                <i className="fa-solid fa-arrow-right ms-2"></i>
                            </Link>
                        )}

                        {registerText && registerUrl && (
                            <Link
                                href={registerUrl}
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
