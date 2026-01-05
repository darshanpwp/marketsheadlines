import Image from 'next/image';
import Link from 'next/link';
import { WordPressUser } from '@/types/wordpress';

interface AuthorBoxProps {
    author: WordPressUser;
}

export default function AuthorBox({ author }: AuthorBoxProps) {
    return (
        <div className="bg-white rounded-4 p-4 border shadow-sm transition-all h-100">
            <div className="d-flex flex-column flex-md-row align-items-center align-items-md-start gap-4">
                <div className="flex-shrink-0">
                    {author.avatar_urls?.['96'] ? (
                        <Image
                            src={author.avatar_urls['96']}
                            alt={author.name}
                            width={80}
                            height={80}
                            className="rounded-circle shadow-sm"
                        />
                    ) : (
                        <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center shadow-sm" style={{ width: '80px', height: '80px' }}>
                            <span className="h2 mb-0 text-white fw-bold" style={{ fontFamily: 'var(--bs-font-serif)' }}>{author.name.charAt(0)}</span>
                        </div>
                    )}
                </div>
                <div className="flex-grow-1 text-center text-md-start">
                    <div className="mb-2">
                        <h4 className="fw-bold mb-1" style={{ fontFamily: 'var(--bs-font-serif)', fontSize: '1.25rem', color: 'var(--primary-navy)' }}>{author.name}</h4>
                    </div>
                    <p className="text-secondary mb-3 small" style={{ lineHeight: '1.6' }}>
                        {author.description || `${author.name} is a senior financial markets correspondent with over 15 years of experience covering global economic developments.`}
                    </p>
                    <div className="d-flex justify-content-center justify-content-md-start align-items-center">
                        <Link href="#" className="fw-bold text-primary text-decoration-none small text-uppercase" style={{ fontSize: '0.7rem' }}>
                            View all articles <i className="fa-solid fa-chevron-right ms-1"></i>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
