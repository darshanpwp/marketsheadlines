'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { WordPressCategory } from '@/types/wordpress';

interface ArchiveToolbarProps {
    categories: WordPressCategory[];
}

export default function ArchiveToolbar({ categories }: ArchiveToolbarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    // State for search term
    const initialSearch = searchParams.get('search') || '';
    const [searchTerm, setSearchTerm] = useState(initialSearch);

    // Sync state with URL params
    useEffect(() => {
        setSearchTerm(searchParams.get('search') || '');
    }, [searchParams]);

    // Determine current category slug from pathname
    const currentCategorySlug = pathname.startsWith('/category/') ? pathname.split('/')[2] : '';

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const query = searchTerm.trim() ? `?search=${encodeURIComponent(searchTerm.trim())}` : '';

        // If we are on a category page, keep the category? 
        // The previous implementation of SearchWidget redirected to /posts regardless using router.push('/posts?search=...')
        // But if we are merging, users might expect to search WITHIN the category.
        // However, the API logic for category pages doesn' not strictly support search filtering yet (we only enabled it for getPostsWithDetails).
        // Let's stick to the previous behavior: Search resets to "All Posts" view (global search).
        // OR, better: Redirect to /posts with the search term. 
        // If the user wants to filter by category, they use the dropdown.
        router.push(`/posts${query}`);
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const slug = e.target.value;
        const query = searchTerm.trim() ? `?search=${encodeURIComponent(searchTerm.trim())}` : '';

        if (slug) {
            router.push(`/category/${slug}${query}`);
        } else {
            router.push(`/posts${query}`);
        }
    };

    return (
        <div className="card bg-white border-0 shadow-sm rounded-4 mb-5">
            <div className="card-body p-4">
                <div className="row g-3 align-items-center">
                    {/* Search Input */}
                    <div className="col-md-7 col-lg-8">
                        <form onSubmit={handleSearch} className="position-relative">
                            <input
                                type="text"
                                className="form-control rounded-pill py-2 ps-4 pe-5 bg-light border-0"
                                placeholder="Search articles..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="btn position-absolute top-50 end-0 translate-middle-y text-secondary border-0 pe-3"
                                aria-label="Search"
                            >
                                <i className="fa-solid fa-magnifying-glass"></i>
                            </button>
                        </form>
                    </div>

                    {/* Category Dropdown */}
                    <div className="col-md-5 col-lg-4">
                        <select
                            className="form-select border-0 bg-light rounded-pill py-2 ps-4 fw-medium text-secondary h-100"
                            value={currentCategorySlug}
                            onChange={handleCategoryChange}
                            aria-label="Filter by category"
                        >
                            <option value="">All Categories</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.slug}>
                                    {category.name} ({category.count})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}
