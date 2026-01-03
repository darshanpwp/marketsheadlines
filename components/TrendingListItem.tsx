import Link from 'next/link';
import { PostWithDetails } from '@/types/wordpress';
import { calculateReadingTime } from '@/lib/utils';

interface TrendingListItemProps {
  post: PostWithDetails;
  index: number;
}

export default function TrendingListItem({ post, index }: TrendingListItemProps) {
  const readingTime = calculateReadingTime(post.content);
  const category = post.categoryDetails?.[0];

  return (
    <Link 
      href={`/posts/${post.slug}`}
      className="text-decoration-none text-dark"
    >
      <div className="card border-0 shadow-sm mb-3 hover-lift">
        <div className="card-body">
          <div className="d-flex align-items-start gap-3">
            <span className="badge bg-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px', minWidth: '32px' }}>
              {index}
            </span>
            <div className="flex-grow-1">
              {category && (
                <span className="badge bg-light text-dark mb-2">{category.name}</span>
              )}
              <h4 className="h6 fw-semibold mb-2">{post.title}</h4>
              <div className="d-flex align-items-center gap-2 text-secondary small">
                <span>{readingTime} min read</span>
              </div>
            </div>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-primary">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}

