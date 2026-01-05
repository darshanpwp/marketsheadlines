import Link from 'next/link';
import { PostWithDetails } from '@/types/wordpress';
import { calculateReadingTime } from '@/lib/utils';

interface NewsListItemProps {
  post: PostWithDetails;
  index: number;
}

export default function NewsListItem({ post, index }: NewsListItemProps) {
  const readingTime = calculateReadingTime(post.content);

  return (
    <Link
      href={`/posts/${post.slug}`}
      className="text-decoration-none text-dark"
    >
      <div className="card border-0 shadow-sm mb-3 hover-lift">
        <div className="card-body">
          <div className="d-flex align-items-start gap-3">
            <span className="badge rounded-circle d-flex align-items-center justify-content-center fw-bold trending-index-badge">
              {index}
            </span>
            <div className="flex-grow-1">
              <h4
                className="h6 fw-bold mb-2 trending-title"
                dangerouslySetInnerHTML={{ __html: post.title }}
              />
              <div className="d-flex align-items-center gap-2 small trending-meta">
                <span>{readingTime} min read</span>
              </div>
            </div>
            <i className="fa-solid fa-chevron-right opacity-30 trending-chevron"></i>
          </div>
        </div>
      </div>
    </Link>
  );
}

