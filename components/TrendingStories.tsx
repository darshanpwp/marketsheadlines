import Link from 'next/link';
import Image from 'next/image';
import { getPostsWithDetails } from '@/lib/wordpress/api';

export default async function TrendingStories() {
    const { items: posts } = await getPostsWithDetails(5, 1);

    if (posts.length === 0) return null;

    return (
        <div className="mb-5 bg-white rounded-4 border p-4 shadow-sm">
            <h3 className="h4 fw-bold mb-4" style={{ fontFamily: 'var(--bs-font-serif)', color: 'var(--text-dark)' }}>
                Trending Now
            </h3>
            <div className="d-flex flex-column gap-4">
                {posts.map((post, index) => (
                    <div key={post.id} className="d-flex gap-3 align-items-start last-child-no-border pb-3 border-bottom">
                        <span className="fw-bold h4 mb-0 opacity-20" style={{ minWidth: '1.5rem', fontFamily: 'var(--bs-font-serif)', color: 'var(--text-dark)' }}>
                            {index + 1}
                        </span>
                        <div className="flex-grow-1">
                            <div className="mb-1">
                                {post.categoryDetails?.[0] && (
                                    <Link href={`/category/${post.categoryDetails[0].slug}`} className="text-uppercase fw-bold text-decoration-none" style={{ fontSize: '0.65rem', letterSpacing: '0.05em', color: 'var(--primary-navy)' }}>
                                        {post.categoryDetails[0].name}
                                    </Link>
                                )}
                            </div>
                            <Link
                                href={`/posts/${post.slug}`}
                                className="text-decoration-none hover-primary transition-all line-clamp-2 fw-bold mb-1 d-block"
                                style={{ fontSize: '0.95rem', lineHeight: '1.4', color: 'var(--text-dark)' }}
                                dangerouslySetInnerHTML={{ __html: post.title }}
                            />
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
