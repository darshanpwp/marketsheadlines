const https = require('https');

const id = 3504679;
const base = 'https://news.marketsheadlines.com/wp-json';

const paths = [
    `/custom/v1/page-pods/${id}/`,       // Current code
    `/custom-market/v1/page-pods/${id}/` // Suspected correct path
];

paths.forEach(path => {
    const url = base + path;
    console.log(`Testing: ${url}`);
    https.get(url, (res) => {
        console.log(`[${res.statusCode}] ${url}`);
        if (res.statusCode === 200) {
            console.log('>>> FOUND VALID ENDPOINT!');
        }
    }).on('error', (e) => console.error(e.message));
});
