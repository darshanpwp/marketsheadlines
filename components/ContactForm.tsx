"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ContactFormProps {
    formId: string | number; // Support both ID types
    title?: string;
    description?: string;
    className?: string;
}

export default function ContactForm({ formId, title, description, className = "" }: ContactFormProps) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        companyName: '',
        position: '',
        companyEmail: '',
        enquiryDetails: ''
    });

    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setMessage('');

        // Basic Client-side Validation
        if (!formData.firstName || !formData.lastName || !formData.companyName || !formData.position || !formData.companyEmail || !formData.enquiryDetails) {
            setStatus('error');
            setMessage('Please fill in all required fields.');
            return;
        }

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    formId,
                    ...formData
                }),
            });

            const result = await response.json();

            if (!response.ok || result.status === 'mail_failed' || result.status === 'validation_failed' || result.status === 'spam') {
                let errorMessage = result.message || 'Failed to send message.';

                // Append validation errors if available
                if (result.invalid_fields && Array.isArray(result.invalid_fields)) {
                    const fieldErrors = result.invalid_fields.map((f: any) => `${f.field}: ${f.message}`).join(', ');
                    errorMessage += ` (Validation Errors: ${fieldErrors})`;
                }

                // Append detailed status for debugging
                errorMessage += ` [Status: ${result.status}]`;

                throw new Error(errorMessage);
            }

            setStatus('success');
            setMessage(result.message || 'Thank you! Your message has been sent.');

            // Clear form on success
            setFormData({
                firstName: '',
                lastName: '',
                companyName: '',
                position: '',
                companyEmail: '',
                enquiryDetails: ''
            });

        } catch (error: any) {
            console.error('Contact Form Error:', error);
            setStatus('error');
            setMessage(error.message || 'An unexpected error occurred. Please try again later.');
        }
    };

    return (
        <div className={`contact-form-wrapper ${className}`} suppressHydrationWarning>
            {(title || description) && (
                <div className="mb-4 text-center">
                    {title && <h2 className="mb-3 font-serif fw-bold text-dark">{title}</h2>}
                    {description && <p className="text-secondary">{description}</p>}
                </div>
            )}

            <form onSubmit={handleSubmit} className="needs-validation" noValidate suppressHydrationWarning>
                {status === 'success' ? (
                    <div className="alert alert-success text-center p-4 rounded-3 shadow-sm" suppressHydrationWarning>
                        <i className="fa-solid fa-check-circle fs-1 mb-3 text-success"></i>
                        <h4 className="alert-heading h5 fw-bold">Message Sent!</h4>
                        <p className="mb-0">{message}</p>
                    </div>
                ) : (
                    <>
                        <div className="row g-3" suppressHydrationWarning>
                            <div className="col-md-6" suppressHydrationWarning>
                                <div className="form-floating mb-3" suppressHydrationWarning>
                                    <input
                                        type="text"
                                        className="form-control bg-light border-0"
                                        id="firstName"
                                        name="firstName"
                                        placeholder="First Name"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                        disabled={status === 'loading'}
                                        suppressHydrationWarning
                                    />
                                    <label htmlFor="firstName" className="text-muted">Your First Name *</label>
                                </div>
                            </div>
                            <div className="col-md-6" suppressHydrationWarning>
                                <div className="form-floating mb-3" suppressHydrationWarning>
                                    <input
                                        type="text"
                                        className="form-control bg-light border-0"
                                        id="lastName"
                                        name="lastName"
                                        placeholder="Last Name"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                        disabled={status === 'loading'}
                                        suppressHydrationWarning
                                    />
                                    <label htmlFor="lastName" className="text-muted">Your Last Name *</label>
                                </div>
                            </div>
                        </div>

                        <div className="form-floating mb-3" suppressHydrationWarning>
                            <input
                                type="text"
                                className="form-control bg-light border-0"
                                id="companyName"
                                name="companyName"
                                placeholder="Company Name"
                                value={formData.companyName}
                                onChange={handleChange}
                                required
                                disabled={status === 'loading'}
                                suppressHydrationWarning
                            />
                            <label htmlFor="companyName" className="text-muted">Company Name *</label>
                        </div>

                        <div className="form-floating mb-3" suppressHydrationWarning>
                            <input
                                type="text"
                                className="form-control bg-light border-0"
                                id="position"
                                name="position"
                                placeholder="Investor Relations, PR, Marketing"
                                value={formData.position}
                                onChange={handleChange}
                                required
                                disabled={status === 'loading'}
                                suppressHydrationWarning
                            />
                            <label htmlFor="position" className="text-muted">Position *</label>
                        </div>

                        <div className="form-floating mb-3" suppressHydrationWarning>
                            <input
                                type="email"
                                className="form-control bg-light border-0"
                                id="companyEmail"
                                name="companyEmail"
                                placeholder="name@example.com"
                                value={formData.companyEmail}
                                onChange={handleChange}
                                required
                                disabled={status === 'loading'}
                                suppressHydrationWarning
                            />
                            <label htmlFor="companyEmail" className="text-muted">Company Email *</label>
                        </div>

                        <div className="form-floating mb-4" suppressHydrationWarning>
                            <textarea
                                className="form-control bg-light border-0"
                                id="enquiryDetails"
                                name="enquiryDetails"
                                placeholder="Enquiry Details"
                                style={{ height: '150px' }}
                                value={formData.enquiryDetails}
                                onChange={handleChange}
                                required
                                disabled={status === 'loading'}
                                suppressHydrationWarning
                            ></textarea>
                            <label htmlFor="enquiryDetails" className="text-muted">Enquiry Details *</label>
                        </div>

                        {status === 'error' && (
                            <div className="alert alert-danger mb-4 d-flex align-items-center" role="alert">
                                <i className="fa-solid fa-circle-exclamation me-2"></i>
                                <div>{message}</div>
                            </div>
                        )}

                        <div className="d-grid">
                            <button
                                type="submit"
                                className="btn btn-premium-primary btn-lg py-3 fw-bold shadow-sm"
                                disabled={status === 'loading'}
                            >
                                {status === 'loading' ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        Submit
                                        <i className="fa-solid fa-paper-plane ms-2"></i>
                                    </>
                                )}
                            </button>
                        </div>
                    </>
                )}
            </form>
        </div>
    );
}
