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

    // Generate page numbers to show with ellipses
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5; // Number of pages valid around current page

        if (totalPages <= maxVisiblePages + 2) {
            // Total pages less than max visible, show all
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Complex case with ellipses
            const startPage = Math.max(2, currentPage - 1);
            const endPage = Math.min(totalPages - 1, currentPage + 1);

            pages.push(1); // Always show first page

            if (startPage > 2) {
                pages.push('...');
            }

            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }

            if (endPage < totalPages - 1) {
                pages.push('...');
            }

            if (totalPages > 1) {
                pages.push(totalPages); // Always show last page
            }
        }
        return pages;
    };

    return (
        <nav aria-label="Page navigation" className="mt-5">
            <ul className="pagination justify-content-center gap-2 border-0 align-items-center">
                {/* Previous Button */}
                <li className={`page-item ${currentPage <= 1 ? 'disabled' : ''}`}>
                    <Link
                        href={currentPage <= 1 ? '#' : createPageURL(currentPage - 1)}
                        className={`page-link rounded-circle border-0 shadow-sm transition-all hover-lift d-flex align-items-center justify-content-center p-0 ${currentPage <= 1 ? 'bg-light text-muted' : 'bg-white text-dark'}`}
                        style={{ width: '40px', height: '40px' }}
                        aria-disabled={currentPage <= 1}
                        tabIndex={currentPage <= 1 ? -1 : undefined}
                    >
                        <i className="fa-solid fa-chevron-left small"></i>
                    </Link>
                </li>

                {/* Page Numbers */}
                {getPageNumbers().map((page, index) => (
                    <li key={index} className={`page-item ${page === currentPage ? 'active' : ''} ${page === '...' ? 'disabled' : ''}`}>
                        {page === '...' ? (
                            <span className="page-link border-0 bg-transparent text-secondary fw-bold">...</span>
                        ) : (
                            <Link
                                href={createPageURL(page)}
                                className={`page-link rounded-circle border-0 shadow-sm transition-all hover-lift d-flex align-items-center justify-content-center p-0 fw-medium ${currentPage === page ? 'primary-bg-blue text-white' : 'bg-white text-dark'
                                    }`}
                                style={{ width: '40px', height: '40px' }}
                            >
                                {page}
                            </Link>
                        )}
                    </li>
                ))}

                {/* Next Button */}
                <li className={`page-item ${currentPage >= totalPages ? 'disabled' : ''}`}>
                    <Link
                        href={currentPage >= totalPages ? '#' : createPageURL(currentPage + 1)}
                        className={`page-link rounded-circle border-0 shadow-sm transition-all hover-lift d-flex align-items-center justify-content-center p-0 ${currentPage >= totalPages ? 'bg-light text-muted' : 'bg-white text-dark'}`}
                        style={{ width: '40px', height: '40px' }}
                        aria-disabled={currentPage >= totalPages}
                        tabIndex={currentPage >= totalPages ? -1 : undefined}
                    >
                        <i className="fa-solid fa-chevron-right small"></i>
                    </Link>
                </li>
            </ul>
        </nav>
    );
}
