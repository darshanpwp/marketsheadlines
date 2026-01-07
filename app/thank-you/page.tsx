import Link from 'next/link';
import { getMenu, getSiteIdentity } from '@/lib/wordpress/api';

export const metadata = {
    title: 'Thank You - Markets Headlines',
    description: 'Thank you for subscribing to our newsletter.',
};

export default async function ThankYouPage() {
    return (
        <main className="bg-white min-vh-100 d-flex flex-column">
            <section className="flex-grow-1 d-flex align-items-center justify-content-center py-5">
                <div className="container text-center">
                    <div className="mb-4">
                        <div className="d-inline-flex align-items-center justify-content-center bg-light-blue rounded-circle" style={{ width: '80px', height: '80px' }}>
                            <i className="fa-solid fa-envelope-open-text fs-1 primary-text-blue"></i>
                        </div>
                    </div>
                    <h1 className="display-4 fw-bold mb-3 text-dark font-serif">Thank You for Subscribing!</h1>
                    <p className="fs-5 text-muted mb-5 col-lg-6 mx-auto">
                        You've successfully joined our subscriber list. Get ready for expert insights, detailed market analysis, and breaking news delivered straight to your inbox.
                    </p>
                    <div className="d-flex justify-content-center gap-3">
                        <Link href="/" className="btn btn-premium-primary btn-lg px-5">
                            Return to Home
                        </Link>
                        <Link href="/posts" className="btn btn-premium-primary btn-lg px-5">
                            Read Latest News
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
