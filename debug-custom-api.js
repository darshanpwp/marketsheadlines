const https = require('https');

async function run() {
    try {
        const payload = {
            firstName: 'Test',
            lastName: 'User',
            companyName: 'TestCorp',
            position: 'Developer',
            companyEmail: 'test@example.com',
            enquiryDetails: 'This is a test message checking Custom API connectivity.'
        };

        console.log('Testing custom endpoint with JSON payload...');

        const response = await fetch('https://news.marketsheadlines.com/wp-json/custom/v1/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const status = response.status;
        console.log(`Response Status: ${status}`);

        const text = await response.text();
        try {
            const json = JSON.parse(text);
            console.log('Response JSON:', JSON.stringify(json, null, 2));
        } catch (e) {
            console.log('Response Text:', text);
        }
    } catch (e) {
        console.error('Error:', e);
    }
}

run();
