'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

interface PaginationProps {
    totalPages: number;
    currentPage: number;
}

export default function Pagination({ totalPages, currentPage }: PaginationProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    if (totalPages <= 1) return null;

    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', pageNumber.toString());
        return `${pathname}?${params.toString()}`;
    };

    // Generate page numbers to show
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            let startPage = Math.max(1, currentPage - 2);
            let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

            if (endPage === totalPages) {
                startPage = Math.max(1, endPage - maxVisiblePages + 1);
            }

            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }
        }
        return pages;
    };

    return (
        <nav aria-label="Page navigation" className="mt-5">
            <ul className="pagination justify-content-center gap-2 border-0">
                {/* Previous Button */}
                <li className={`page-item ${currentPage <= 1 ? 'disabled' : ''}`}>
                    <Link
                        href={createPageURL(currentPage - 1)}
                        className="page-link rounded-circle border-0 shadow-sm transition-all hover-lift d-flex align-items-center justify-content-center p-0"
                        style={{ width: '40px', height: '40px' }}
                        aria-disabled={currentPage <= 1}
                    >
                        <i className="fa-solid fa-chevron-left me-2 small"></i>
                    </Link>
                </li>

                {/* Page Numbers */}
                {getPageNumbers().map((page) => (
                    <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                        <Link
                            href={createPageURL(page)}
                            className={`page-link rounded-circle border-0 shadow-sm transition-all hover-lift d-flex align-items-center justify-content-center p-0 fw-medium ${currentPage === page ? 'bg-primary text-white' : 'bg-white text-dark'
                                }`}
                            style={{ width: '40px', height: '40px' }}
                        >
                            {page}
                        </Link>
                    </li>
                ))}

                {/* Next Button */}
                <li className={`page-item ${currentPage >= totalPages ? 'disabled' : ''}`}>
                    <Link
                        href={createPageURL(currentPage + 1)}
                        className="page-link rounded-circle border-0 shadow-sm transition-all hover-lift d-flex align-items-center justify-content-center p-0"
                        style={{ width: '40px', height: '40px' }}
                        aria-disabled={currentPage >= totalPages}
                    >
                        <i className="fa-solid fa-chevron-right ms-2 small"></i>
                    </Link>
                </li>
            </ul>
        </nav>
    );
}
