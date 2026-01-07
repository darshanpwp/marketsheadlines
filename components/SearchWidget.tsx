'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SearchWidget() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            router.push(`/posts?search=${encodeURIComponent(searchTerm.trim())}`);
        }
    };

    return (
        <div className="card bg-white border-0 shadow-sm rounded-4 mb-4">
            <div className="card-body p-4">
                <h4 className="font-serif fw-bold mb-3 primary-text-blue">Search</h4>
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
        </div>
    );
}
