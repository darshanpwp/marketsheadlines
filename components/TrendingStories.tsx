import Link from 'next/link';
import Image from 'next/image';
import { getPostsWithDetails } from '@/lib/wordpress/api';

export default async function TrendingStories() {
    const { items: posts } = await getPostsWithDetails(5, 1);

    if (posts.length === 0) return null;

    return (
        <div className="mb-5 bg-white rounded-4 border p-4 shadow-sm">
            <h3 className="h4 fw-semibold mb-4 font-serif primary-text-blue">
                Trending Now
            </h3>
            <div className="d-flex flex-column gap-3">
                {posts.map((post, index) => (
                    <div key={post.id} className="d-flex gap-3 align-items-start border-0">
                        <div className="flex-grow-1">
                            <div className="mb-2 badge ligh-blue-hover primary-text-blue border-0 rounded-2 px-3 py-2 small fw-semibold">
                                {post.categoryDetails?.[0] && (
                                    <Link href={`/category/${post.categoryDetails[0].slug}`} className="text-capitalize primary-text-blue fw-bold text-decoration-none" style={{ fontSize: '0.65rem', letterSpacing: '0.05em', color: 'var(--primary-navy)' }}>
                                        {post.categoryDetails[0].name}
                                    </Link>
                                )}
                            </div>
                            <Link
                                href={`/posts/${post.slug}`}
                                className="text-decoration-none hover-primary transition-all line-clamp-2 fw-bold mb-3 d-block"
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
