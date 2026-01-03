import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-zinc-950">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-zinc-900 dark:text-zinc-50">404</h1>
        <h2 className="mt-4 text-2xl font-semibold text-zinc-700 dark:text-zinc-300">
          Article Not Found
        </h2>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          The article you're looking for doesn't exist or has been removed.
        </p>
        <Link
          href="/news"
          className="mt-8 inline-block rounded-lg bg-zinc-900 px-6 py-3 font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Back to News
        </Link>
      </div>
    </div>
  );
}