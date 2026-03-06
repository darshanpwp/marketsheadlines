const https = require('https');

async function run() {
    try {
        console.log('Testing custom endpoint with FormData payload...');

        const formData = new FormData();
        formData.append('first-name', 'Test');
        formData.append('last-name', 'User');
        formData.append('company-name', 'TestCorp');
        formData.append('position', 'Developer');
        formData.append('company-email', 'test@example.com');
        formData.append('enquiry-details', 'This is a test message checking Custom API connectivity.');

        const response = await fetch('https://news.marketsheadlines.com/wp-json/custom/v1/contact', {
            method: 'POST',
            body: formData
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
