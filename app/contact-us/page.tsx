import { getPageBySlug, getGlobalThemeSettings, normalizeWpUrl } from '@/lib/wordpress/api';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import ContactForm from '@/components/ContactForm';
import { SITE_URL, DEFAULT_POST_IMAGE } from '@/lib/constants';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
    const page = await getPageBySlug('contact-us');

    if (!page) {
        return {
            title: 'Contact Us - Market Headlines',
        };
    }

    return {
        title: page.seo?.title || `${page.title} - Market Headlines`,
        description: page.seo?.description || 'Get in touch with Market Headlines.',
        openGraph: {
            title: page.seo?.og_title || page.title,
            description: page.seo?.og_description || page.seo?.description,
            url: `${SITE_URL}/contact-us`,
            type: 'website',
        },
    };
}

export default async function ContactPage() {
    const page = await getPageBySlug('contact-us');
    const globalSettings = await getGlobalThemeSettings();

    const defaultImageUrl = normalizeWpUrl(globalSettings?.blog_default_image?.guid) || DEFAULT_POST_IMAGE;

    if (!page) {
        notFound();
    }

    return (
        <main className="min-vh-100 bg-white" suppressHydrationWarning>
            {/* Hero Section */}
            <section className="position-relative page-hero" style={{ height: '300px' }}>
                <div
                    className="position-absolute top-0 start-0 w-100 h-100 overflow-hidden"
                    suppressHydrationWarning
                >
                    <Image
                        src={page.featuredMediaDetails?.source_url || defaultImageUrl}
                        alt={page.title}
                        fill
                        className="object-fit-cover"
                        priority
                    />
                    {/* Brand Overlay - using existing gradients */}
                    <div className="hero-overlay" suppressHydrationWarning></div>
                </div>

                <div className="container position-relative h-100 z-1" suppressHydrationWarning>
                    <div className="row h-100 align-items-center justify-content-center" suppressHydrationWarning>
                        <div className="col-lg-10 text-center animate-fade-in-up" suppressHydrationWarning>
                            <h1 className="display-3 fw-bold text-white font-serif mb-0">
                                {page.title}
                            </h1>
                        </div>
                    </div>
                </div>
            </section>

            {/* Intro Content */}
            {page.content && (
                <section className="pt-5 bg-white">
                    <div className="container">
                        <div className="row justify-content-center text-center">
                            <div className="col-lg-8">
                                <div
                                    className="lead text-secondary"
                                    dangerouslySetInnerHTML={{ __html: page.content }}
                                />
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Contact Form Section */}
            <section className="py-5">
                <div className="container" suppressHydrationWarning>
                    <div className="row justify-content-center" suppressHydrationWarning>
                        <div className="col-lg-8 col-xl-7" suppressHydrationWarning>
                            <div className="bg-white p-4 p-md-5 rounded-4 shadow-sm border" suppressHydrationWarning>
                                <ContactForm
                                    formId="3504950"
                                    title="Send us a Message"
                                    description="Have a question, comment, or suggestion? We're here to help."
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Additional Contact Info (Optional - fetched from Global Settings if available) */}
            {(globalSettings?.social_media_urls && globalSettings.social_media_urls.length > 0) && (
                <section className="py-5">
                    <div className="container text-center">
                        <h3 className="h5 fw-bold mb-4">Connect With Us</h3>
                        <div className="d-flex justify-content-center gap-3">
                            {/* Placeholder for social icons */}
                        </div>
                    </div>
                </section>
            )}
        </main>
    );
}
