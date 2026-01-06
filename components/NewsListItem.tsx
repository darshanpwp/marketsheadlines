import Link from 'next/link';
import { PostWithDetails } from '@/types/wordpress';
import { calculateReadingTime } from '@/lib/utils';

interface NewsListItemProps {
  post: PostWithDetails;
  index: number;
}

export default function NewsListItem({ post, index }: NewsListItemProps) {
  const readingTime = calculateReadingTime(post.content);
  const category = post.categoryDetails?.[0];

  return (
    <Link
      href={`/posts/${post.slug}`}
      className="text-decoration-none text-dark"
    >
      <div className="card border-1 border-lighter border-radius-2 p-4 mb-3 hover-lift">
        <div className="card-body p-0">
          <div className="d-flex align-top gap-4">
            {/* Index Badge */}
            <div className="news-index-badge d-flex align-items-center justify-content-center rounded-3 flex-shrink-0">
              {index}
            </div>

            {/* Content */}
            <div className="flex-grow-1 min-w-0">
              <div className="d-flex align-items-center gap-2 mb-2">
                {category && (
                  <span className="badge news-category-pill">
                    {category.name}
                  </span>
                )}
                <span className="text-muted small">{readingTime} min read</span>
              </div>
              <h4
                className="h6 mb-0 text-font-family text-dark text-short-truncate fs-6 lh-base"
                dangerouslySetInnerHTML={{ __html: post.title }}
              />
            </div>

            {/* Chevron */}
            <div className="flex-shrink-0 ms-3 d-flex align-items-center">
              <i className="fa-solid fa-chevron-right text-muted"></i>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

