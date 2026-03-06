const https = require('https');

const data = JSON.stringify({
    'first-name': 'Test',
    'last-name': 'User',
    'company-name': 'TestCorp',
    'position': 'Developer',
    'company-email': 'test@example.com',
    'enquiry-details': 'This is a test message checking API connectivity.',
    '_wpcf7_unit_tag': 'wpcf7-f3504950-p1-o1'
});

// Since CF7 checks for FormData usually, we might need to send as FormData or x-www-form-urlencoded
// But passing JSON to CF7 REST API usually works if Content-Type is application/json? Actually CF7 expects FormData.
// Let's use `fetch` if available (Node 18+) or use the native request. 
// Given the environment might not have `fetch` enabled in older Node, I'll use `FormData` via `form-data` package if available, OR just construct a multipart body manually.
// Actually, the previous `curl` command used `-F` which sends multipart/form-data.
// So let's write a script that uses `fetch` (available in Node 18+ which is likely what the user has) to send FormData.

async function run() {
    try {
        const formData = new FormData();
        formData.append('first-name', 'Test');
        formData.append('last-name', 'User');
        formData.append('company-name', 'TestCorp');
        formData.append('position', 'Developer');
        formData.append('company-email', 'test@example.com');
        formData.append('enquiry-details', 'This is a test message checking API connectivity.');
        formData.append('_wpcf7_unit_tag', 'wpcf7-f3504950-p1-o1');

        const response = await fetch('https://news.marketsheadlines.com/wp-json/contact-form-7/v1/contact-forms/3504950/feedback', {
            method: 'POST',
            body: formData
        });

        const json = await response.json();
        console.log(JSON.stringify(json, null, 2));
    } catch (e) {
        console.error(e);
    }
}

run();
