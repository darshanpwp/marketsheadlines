import { getPageBySlug, normalizeWpUrl, getGlobalThemeSettings } from '@/lib/wordpress/api';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import { DEFAULT_POST_IMAGE, SITE_URL } from '@/lib/constants';
import Link from 'next/link';
import NewsletterForm from '@/components/NewsletterForm';

export const revalidate = 60; // Revalidate every 60 seconds

export async function generateMetadata(): Promise<Metadata> {
    const page = await getPageBySlug('about-us');

    if (!page) {
        return {
            title: 'About Us - Market Headlines',
            description: 'Learn more about Market Headlines, your source for global financial news.',
        };
    }

    return {
        title: page.seo?.title || `${page.title} - Market Headlines`,
        description: page.seo?.description || page.excerpt?.replace(/<[^>]*>/g, '').slice(0, 160),
        openGraph: {
            title: page.seo?.og_title || page.title,
            description: page.seo?.og_description,
            images: page.seo?.og_image ? page.seo.og_image.map(img => img.url) : [],
        },
        alternates: {
            canonical: `${SITE_URL}/about-us`,
        },
    };
}

export default async function AboutUsPage() {
    const page = await getPageBySlug('about-us');
    const globalSettings = await getGlobalThemeSettings();
    const defaultImageUrl = normalizeWpUrl(globalSettings?.blog_default_image?.guid) || DEFAULT_POST_IMAGE;

    if (!page) {
        notFound();
    }

    return (
        <main className="min-vh-100 bg-white">
            {/* Hero Section */}
            <section className="position-relative page-hero" style={{ height: '300px' }}>
                <div className="position-absolute top-0 start-0 w-100 h-100 overflow-hidden">
                    <Image
                        src={page.featuredMediaDetails?.source_url || defaultImageUrl}
                        alt={page.title}
                        fill
                        className="object-fit-cover"
                        priority
                    />
                    {/* Brand Overlay - using existing gradients */}
                    <div className="hero-overlay"></div>
                </div>

                <div className="container position-relative h-100 z-1">
                    <div className="row h-100 align-items-center justify-content-center">
                        <div className="col-lg-10 text-center animate-fade-in-up">
                            <h1 className="display-3 fw-bold text-white font-serif mb-0">
                                {page.title}
                            </h1>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            {/* Main Content */}
            <section className="p-80 bg-white">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-10 col-xl-8">
                            <div
                                className="article-content standard-page-content"
                                dangerouslySetInnerHTML={{ __html: page.content }}
                            />


                        </div>
                    </div>
                </div>
            </section>

            {/* Newsletter Subscription Section */}
            <section className="container-fluid p-80 newsletter-section-main" id="newsletter-section">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8 text-center text-white">
                            <h2 className="display-5 fw-semibold text-white mb-3 newsletter-title">
                                Stay Ahead of the Markets
                            </h2>
                            <div className="fs-18 mb-4 col-9 m-auto opacity-90">
                                Get expert insights, breaking news, and market analysis delivered directly to your inbox
                            </div>

                            <NewsletterForm />
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
