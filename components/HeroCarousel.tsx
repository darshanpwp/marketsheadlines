'use client';

import Link from 'next/link';
import Image from 'next/image';
import { PostWithDetails } from '@/types/wordpress';
import { calculateReadingTime } from '@/lib/utils';
import { useEffect } from 'react';

interface HeroCarouselProps {
    posts: PostWithDetails[];
}

export default function HeroCarousel({ posts }: HeroCarouselProps) {
    // Initialize bootstrap carousel if needed, though data-bs attributes usually handle it.
    // We can add a simple useEffect to ensure it initializes properly if dynamic.

    return (
        <section className="container-fluid px-0">
            {posts.length > 0 ? (
                <div
                    id="heroCarousel"
                    className="carousel slide carousel-fade"
                    data-bs-ride="carousel"
                    data-bs-interval="5000"
                    data-bs-pause="hover"
                >
                    {/* Carousel Indicators */}
                    <div className="carousel-indicators">
                        {posts.map((_, index) => (
                            <button
                                key={index}
                                type="button"
                                data-bs-target="#heroCarousel"
                                data-bs-slide-to={index}
                                className={index === 0 ? 'active' : ''}
                                aria-current={index === 0 ? 'true' : undefined}
                                aria-label={`Slide ${index + 1}`}
                            ></button>
                        ))}
                    </div>

                    {/* Carousel Inner */}
                    <div className="carousel-inner">
                        {posts.map((post, index) => (
                            <div
                                key={post.id}
                                className={`carousel-item ${index === 0 ? 'active' : ''} position-relative hero-item`}
                            >
                                {/* Background Image */}
                                <div className="hero-bg position-absolute w-100 h-100 top-0 start-0 overflow-hidden z-0">
                                    {post.featuredMediaDetails?.source_url ? (
                                        <Image
                                            src={post.featuredMediaDetails.source_url}
                                            alt={post.title}
                                            fill
                                            className="object-fit-cover transition-transform duration-700 hover-scale"
                                            priority={index === 0}
                                        />
                                    ) : (
                                        <div className="w-100 h-100 bg-secondary"></div>
                                    )}

                                    {/* Brand Navy Overlay with Gradient */}
                                    <div className="hero-overlay position-absolute w-100 h-100 top-0 start-0 hero-gradient-overlay z-1"></div>
                                </div>

                                {/* Content Overlay */}
                                <div className="container hero-content-container position-relative z-3">
                                    <div className="row align-items-center h-100">
                                        <div className="col-lg-7 col-md-9 text-white py-5 hero-content">
                                            {post.categoryDetails?.[0] && (
                                                <span className="badge primary-bg-blue text-white rounded-pill px-3 py-2 mb-4 fw-bold shadow-sm">
                                                    {post.categoryDetails[0].name}
                                                </span>
                                            )}
                                            <h2
                                                className="display-4 text-white fw-bold mb-4 hero-headline font-serif leading-1-1"
                                                dangerouslySetInnerHTML={{ __html: post.title }}
                                            />
                                            <div
                                                className="lead hero-excerpt opacity-90 fw-light text-truncate max-w-100"
                                                dangerouslySetInnerHTML={{
                                                    __html: post.excerpt || 'Stay informed with the latest market insights and financial news.'
                                                }}
                                            />
                                            {post.authorDetails && (
                                                <div className="d-flex align-items-center gap-3 mb-4 pt-4 max-w-fit">
                                                    <span className="fw-bold text-uppercase small tracking-wider">By {post.authorDetails.name}</span>
                                                    <span className="text-white opacity-50">•</span>
                                                    <span className="small opacity-75">{calculateReadingTime(post.content)} min read</span>
                                                </div>
                                            )}
                                            <Link
                                                href={`/posts/${post.slug}`}
                                                className="btn btn-white-primary rounded-2"
                                            >
                                                Read Full Story
                                                <i className="fa-solid fa-chevron-right ms-2"></i>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Custom Carousel Controls (Bottom Right) */}
                    <div className="carousel-custom-controls d-none d-md-flex gap-2">
                        <button
                            className="btn-custom-control prev"
                            type="button"
                            data-bs-target="#heroCarousel"
                            data-bs-slide="prev"
                            aria-label="Previous"
                        >
                            <i className="fa-solid fa-chevron-left"></i>
                        </button>
                        <button
                            className="btn-custom-control next"
                            type="button"
                            data-bs-target="#heroCarousel"
                            data-bs-slide="next"
                            aria-label="Next"
                        >
                            <i className="fa-solid fa-chevron-right"></i>
                        </button>
                    </div>
                </div>
            ) : (
                // Fallback if no posts available
                <div className="position-relative hero-item newsletter-section-main">
                    <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-80"></div>
                    <div className="container position-relative h-100">
                        <div className="row align-items-center h-100">
                            <div className="col-lg-6 col-md-8 text-white py-5 text-center text-md-start">
                                <span className="badge bg-primary mb-3 px-3 py-2">World News</span>
                                <h1 className="display-4 fw-bold mb-4">
                                    Global Markets React to Emerging Trade Agreement Framework
                                </h1>
                                <p className="lead mb-4">
                                    Asian and European indices surge on news of multilateral trade negotiations
                                </p>
                                <Link href="/posts" className="btn btn-white-primary btn-lg px-4">
                                    Read Full Story
                                    <i className="fa-solid fa-chevron-right ms-2 small"></i>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
