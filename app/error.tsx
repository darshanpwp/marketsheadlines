'use client'; // Error components must be Client Components

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Application Error:', error);
    }, [error]);

    return (
        <div className="container min-vh-100 d-flex flex-column align-items-center justify-content-center text-center">
            <div className="alert alert-danger p-5 shadow-sm rounded-4">
                <h2 className="h4 fw-bold mb-3">Something went wrong!</h2>
                <p className="mb-4 text-muted">
                    We encountered an unexpected error. Please try again later.
                </p>
                <p className="small text-danger mb-4 bg-light p-2 rounded">
                    {error.message || 'Unknown error'}
                </p>
                <button
                    onClick={
                        // Attempt to recover by trying to re-render the segment
                        () => reset()
                    }
                    className="btn btn-primary rounded-pill px-4"
                >
                    Try again
                </button>
            </div>
        </div>
    );
}
