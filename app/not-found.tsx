import Link from 'next/link';
import { Metadata } from 'next';
import { getAllCategories } from '@/lib/wordpress/api';

export const metadata: Metadata = {
    title: 'Page Not Found - Market Headlines',
    description: 'The page you are looking for does not exist.',
};

export default async function NotFound() {
    const categories = await getAllCategories();
    // Sort by count descending and take top 3
    const topCategories = categories
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);

    return (
        <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center bg-light-c p-60 text-center">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-8 col-md-10">
                        {/* Visual Element / Large 404 */}
                        <h1
                            className="display-1 fw-bold primary-text-blue mb-4 text-font-family"
                            style={{ fontSize: '120px', letterSpacing: '-5px', lineHeight: '1' }}
                        >
                            404
                        </h1>

                        <h2 className="h2 mb-4 title-font-family text-dark">
                            Page Not Found
                        </h2>

                        <p className="lead text-secondary mb-5 mx-auto col-lg-10">
                            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                        </p>

                        <Link href="/" className="btn btn-premium-primary btn-lg px-5 py-3 d-inline-flex align-items-center gap-2">
                            <i className="fa-solid fa-arrow-left small"></i>
                            Back to Home
                        </Link>

                        {/* Top Categories Help Links */}
                        <div className="mt-5 pt-4 border-top border-light">
                            <p className="small text-muted mb-3">Or explore our top topics:</p>
                            <div className="d-flex justify-content-center gap-4 flex-wrap">
                                {topCategories.map((category) => (
                                    <Link
                                        key={category.id}
                                        href={`/category/${category.slug}`}
                                        className="text-decoration-none fw-semibold primary-text-blue small hover-lift text-capitalize"
                                    >
                                        {category.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
