import { getAuthorBySlug, getPostsByAuthor, getAllCategories, getGlobalThemeSettings } from '@/lib/wordpress/api';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import PostCard from '@/components/PostCard';
import Pagination from '@/components/Pagination';
import ArchiveToolbar from '@/components/ArchiveToolbar';

type Props = {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ page?: string; search?: string }>;
};

export const revalidate = 60; // Revalidate every 60 seconds

// Generate metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const author = await getAuthorBySlug(slug);

    if (!author) {
        return {
            title: 'Author Not Found',
        };
    }

    return {
        title: `${author.name} - Market Headlines`,
        description: author.description || `Articles by ${author.name}`,
        openGraph: {
            title: `${author.name} - Market Headlines`,
            description: author.description || `Read the latest articles by ${author.name} on Market Headlines.`,
            images: author.avatar_urls?.['96'] ? [author.avatar_urls['96']] : [],
        },
    };
}

export default async function AuthorArchivePage({ params, searchParams }: Props) {
    const { slug } = await params;
    const resolvedSearchParams = await searchParams;
    const currentPage = parseInt(resolvedSearchParams.page || '1', 10);
    const perPage = 16;

    const author = await getAuthorBySlug(slug);

    if (!author) {
        notFound();
    }

    const [postsData, categories, globalSettings] = await Promise.all([
        getPostsByAuthor(author.id, perPage, currentPage),
        getAllCategories(),
        getGlobalThemeSettings()
    ]);

    const { items: posts, totalItems, totalPages } = postsData;
    const defaultImageUrl = globalSettings?.blog_default_image?.guid || 'https://dev-new-marketsheadlines.pantheonsite.io/wp-content/uploads/2026/01/thumbnail.png';

    return (
        <div className="min-vh-100 bg-white">
            {/* Author Header */}
            <div className="archive-header mb-5 bg-gradient-c py-5">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-auto mb-3 mb-md-0">
                            {author.avatar_urls?.['96'] ? (
                                <Image
                                    src={author.avatar_urls['96']}
                                    alt={author.name}
                                    width={120}
                                    height={120}
                                    className="rounded-circle shadow"
                                />
                            ) : (
                                <div className="rounded-circle primary-bg-blue d-flex align-items-center justify-content-center shadow" style={{ width: '120px', height: '120px' }}>
                                    <span className="display-4 text-white fw-bold" style={{ fontFamily: 'var(--bs-font-serif)' }}>{(author?.name || 'A').charAt(0)}</span>
                                </div>
                            )}
                        </div>
                        <div className="col">
                            <span className="text-uppercase fw-bold text-secondary small mb-2 d-block">Author Archive</span>
                            <h1 className="archive-title mb-3 h2 primary-text-blue fw-bold">
                                {author.name}
                            </h1>
                            <p className="lead mb-0 text-secondary" style={{ maxWidth: '800px' }}>
                                {author.description || `${author.name} is a contributor to Market Headlines.`}
                            </p>
                        </div>
                        <div className="col-auto mt-3 mt-md-0 text-end">
                            <div className="primary-text-blue fw-medium">
                                {totalItems} {totalItems === 1 ? 'Article' : 'Articles'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container pb-5">

                {/* Archive Toolbar */}
                <div className="row mb-4">
                    <div className="col-12">
                        <ArchiveToolbar categories={categories} />
                    </div>
                </div>

                {/* Posts Grid - 4 columns on desktop */}
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
                    {posts.map((post) => (
                        <div key={post.id} className="col">
                            <PostCard post={post} />
                        </div>
                    ))}
                </div>

                {posts.length === 0 && (
                    <div className="card bg-white border-0 bg-light text-center p-5 mt-4">
                        <p className="text-secondary mb-0">
                            No posts found for this author.
                        </p>
                    </div>
                )}

                {/* Pagination UI */}
                <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                />
            </div>
        </div>
    );
}
