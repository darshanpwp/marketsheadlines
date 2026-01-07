import Link from 'next/link';
import { getAllCategories } from '@/lib/wordpress/api';

export default async function CategoryList() {
    const categories = await getAllCategories();

    if (categories.length === 0) {
        return null;
    }

    return (
        <div className="card bg-white border-0 shadow-sm rounded-4 mb-4">
            <div className="card-body p-4">
                <h4 className="font-serif fw-bold mb-3 primary-text-blue">Categories</h4>
                <div className="d-flex flex-column gap-2">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            href={`/category/${category.slug}`}
                            className="text-decoration-none text-secondary d-flex justify-content-between align-items-center py-2 border-bottom border-light hover-primary"
                        >
                            <span>{category.name}</span>
                            <span className="badge bg-light text-secondary rounded-pill">{category.count}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
