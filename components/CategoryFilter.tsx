'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { WordPressCategory } from '@/types/wordpress';

interface CategoryFilterProps {
    categories: WordPressCategory[];
}

export default function CategoryFilter({ categories }: CategoryFilterProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentSearch = searchParams.get('search') || '';

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const slug = e.target.value;
        if (slug) {
            // If a category is selected, navigate to that category page.
            // Note: This often clears the search term as it switches context to a specific category.
            // If we wanted to keep search, we'd need filtering logic on the category page too.
            // For now, strict navigation behaving like a filter.
            router.push(`/category/${slug}${currentSearch ? `?search=${encodeURIComponent(currentSearch)}` : ''}`);
        } else {
            // "All Categories" selected -> Go to main World News / Posts page
            router.push(`/posts${currentSearch ? `?search=${encodeURIComponent(currentSearch)}` : ''}`);
        }
    };

    // Determine current selection based on path or props
    // This is a simplified check. A more robust one might check the path segment.
    const pathname = usePathname();
    const currentCategorySlug = pathname.startsWith('/category/') ? pathname.split('/')[2] : '';

    return (
        <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body p-4 d-flex align-items-center">
                <select
                    className="form-select border-0 bg-light rounded-pill py-2 ps-4 fw-medium text-secondary"
                    value={currentCategorySlug}
                    onChange={handleCategoryChange}
                    aria-label="Filter by category"
                >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.slug}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
