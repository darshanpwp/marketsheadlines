"use client";

import { useState } from 'react';

import { useRouter } from 'next/navigation';

interface NewsletterFormProps {
    defaultDaily?: boolean;
    defaultWeekly?: boolean;
    defaultBreaking?: boolean;
}

export default function NewsletterForm({
    defaultDaily = true,
    defaultWeekly = false,
    defaultBreaking = true,
}: NewsletterFormProps) {
    const router = useRouter(); // Initialize router
    const [email, setEmail] = useState('');
    const [dailyBrief, setDailyBrief] = useState(defaultDaily);
    const [weeklyDeepDive, setWeeklyDeepDive] = useState(defaultWeekly);
    const [breakingNews, setBreakingNews] = useState(defaultBreaking);
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setMessage('');

        const payload = {
            email,
            daily_market_brief: dailyBrief,
            weekly_deep_dive: weeklyDeepDive,
            breaking_news_alerts: breakingNews,
        };

        try {
            const response = await fetch('https://dev-new-marketsheadlines.pantheonsite.io/wp-json/newsletter/v1/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            // Handle API-level errors even if HTTP status is 200
            // The API returns { status: false, message: '...' } for duplicates
            if (!response.ok || (result.status === false)) {

                const errorMsg = result.message || '';

                // Check specifically for duplicate email messages
                const isDuplicate = errorMsg.toLowerCase().includes('already subscribed') ||
                    errorMsg.toLowerCase().includes('already exists') ||
                    errorMsg.toLowerCase().includes('duplicate');

                if (isDuplicate) {
                    throw new Error('This email address is already subscribed.');
                }

                throw new Error(errorMsg || 'Subscription failed. Please try again.');
            }

            setStatus('success');
            setMessage('Thank you for subscribing!');
            setEmail('');

            // Redirect to Thank You page
            setTimeout(() => {
                router.push('/thank-you');
            }, 500); // Small delay to let the user see the "success" state briefly if needed, or ensuring state update processes.

        } catch (error: any) {
            // Only log unexpected errors
            // If it's a known validation error (like duplicates), we don't need to clog the console
            if (!error.message?.includes('already subscribed')) {
                console.error('Newsletter Error:', error);
            }

            setStatus('error');
            setMessage(error.message || 'An unexpected error occurred.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="newsletter-form mx-auto">
            {status === 'success' ? (
                <div className="alert alert-success text-center">{message}</div>
            ) : (
                <>
                    <div className="mb-4">
                        <input
                            type="email"
                            className="form-control newsletter-input w-100"
                            placeholder="Enter your email address"
                            aria-label="Email address"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={status === 'loading'}
                        />
                    </div>

                    <div className="mb-4">
                        <div className="d-flex flex-column gap-2">
                            <label className="newsletter-checkbox-wrapper" htmlFor="dailyBrief">
                                <input
                                    type="checkbox"
                                    id="dailyBrief"
                                    checked={dailyBrief}
                                    onChange={(e) => setDailyBrief(e.target.checked)}
                                />
                                <span className="custom-checkbox">
                                    <i className="fa-solid fa-check"></i>
                                </span>
                                <span className="newsletter-label">Daily Market Brief</span>
                            </label>

                            <label className="newsletter-checkbox-wrapper" htmlFor="weeklyDeepDive">
                                <input
                                    type="checkbox"
                                    id="weeklyDeepDive"
                                    checked={weeklyDeepDive}
                                    onChange={(e) => setWeeklyDeepDive(e.target.checked)}
                                />
                                <span className="custom-checkbox">
                                    <i className="fa-solid fa-check"></i>
                                </span>
                                <span className="newsletter-label">Weekly Deep Dive</span>
                            </label>

                            <label className="newsletter-checkbox-wrapper" htmlFor="breakingNews">
                                <input
                                    type="checkbox"
                                    id="breakingNews"
                                    checked={breakingNews}
                                    onChange={(e) => setBreakingNews(e.target.checked)}
                                />
                                <span className="custom-checkbox">
                                    <i className="fa-solid fa-check"></i>
                                </span>
                                <span className="newsletter-label">Breaking News Alerts</span>
                            </label>
                        </div>
                    </div>

                    <button
                        className="newsletter-submit-btn d-flex align-items-center justify-content-center gap-2"
                        type="submit"
                        disabled={status === 'loading'}
                    >
                        {status === 'loading' ? 'Subscribing...' : 'Subscribe to Newsletter'}
                        {!status.startsWith('loading') && <i className="fa-solid fa-arrow-right"></i>}
                    </button>

                    {status === 'error' && (
                        <div className="text-danger small mt-3 text-center bg-white p-2 rounded">{message}</div>
                    )}
                    <p className="text-white-50 small mb-0 mt-3 text-center">
                        By subscribing, you agree to our <a href="#" className="text-white text-decoration-underline">Privacy Policy</a> and <a href="#" className="text-white text-decoration-underline">Terms of Service</a>.
                    </p>
                </>
            )}
        </form>
    );
}
