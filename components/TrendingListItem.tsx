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
      <div className="card border-0 shadow-sm mb-4 hover-lift transition-all">
        <div className="card-body p-4">
          <div className="d-flex align-items-center">
            {/* Prominent Number */}
            <div className="trending-number bg-light-blue primary-text-blue title-font-family rounded-circle">
              {index}
            </div>

            <div className="flex-grow-1 border-0">
              <div className="d-flex justify-start align-items-center mb-2 gap-2">
                {category && (
                  <span className="badge bg-light-blue primary-text-blue border-0 rounded-pill px-3 py-2 small fw-bold">
                    {category.name}
                  </span>
                )}
                <small className="text-muted ">{readingTime} min read</small>
              </div>

              <h4
                className="h6 mb-0 text-dark text-font-family hover-primary transition-all lh-base"
                style={{ fontSize: '1.1rem' }}
                dangerouslySetInnerHTML={{ __html: post.title }}
              />
            </div>

            <div className="ms-3">
              <i className="fa-solid fa-chevron-right text-muted opacity-50"></i>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

