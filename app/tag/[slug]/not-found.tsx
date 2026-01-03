import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-white">
      <div className="text-center">
        <h1 className="display-1 fw-bold">404</h1>
        <h2 className="h3 fw-semibold mb-3">
          Tag Not Found
        </h2>
        <p className="text-secondary mb-4">
          The tag you're looking for doesn't exist.
        </p>
        <Link
          href="/posts"
          className="btn btn-dark btn-lg px-4"
        >
          Back to Posts
        </Link>
      </div>
    </div>
  );
}

