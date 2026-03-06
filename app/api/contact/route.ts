import { NextRequest, NextResponse } from 'next/server';
import { WORDPRESS_URL } from '@/lib/wordpress/api';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { formId, firstName, lastName, companyName, position, companyEmail, enquiryDetails } = body;

        if (!formId) {
            return NextResponse.json(
                { status: 'error', message: 'Form ID is missing.' },
                { status: 400 }
            );
        }

        // Construct the Contact Form 7 API URL
        const endpoint = `${WORDPRESS_URL}/wp-json/contact-form-7/v1/contact-forms/${formId}/feedback`;

        // Create FormData as expected by CF7
        const formData = new FormData();
        formData.append('first-name', firstName);
        formData.append('last-name', lastName);
        formData.append('company-name', companyName);
        formData.append('position', position);
        formData.append('company-email', companyEmail);
        formData.append('enquiry-details', enquiryDetails);

        // Add unit tag stub
        formData.append('_wpcf7_unit_tag', `wpcf7-f${formId}-p1-o1`);

        // Fetch options
        const options: RequestInit = {
            method: 'POST',
            body: formData,
            headers: {},
        };

        // Add Basic Auth if configured
        const authUser = process.env.WORDPRESS_AUTH_USER;
        const authPass = process.env.WORDPRESS_AUTH_PASS;
        if (authUser && authPass) {
            options.headers = {
                ...options.headers,
                'Authorization': `Basic ${Buffer.from(`${authUser}:${authPass}`).toString('base64')}`,
            };
        }

        const response = await fetch(endpoint, options);
        const result = await response.json();

        if (result.status === 'mail_sent') {
            return NextResponse.json({
                status: 'success',
                message: result.message
            });
        } else {
            return NextResponse.json({
                status: result.status,
                message: result.message,
                invalid_fields: result.invalid_fields
            }, { status: 400 });
        }

    } catch (error) {
        console.error('Contact API Error:', error);
        return NextResponse.json(
            { status: 'error', message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
