const https = require('https');

const url = 'https://news.marketsheadlines.com/wp-json/wp/v2/pages?per_page=100';

console.log(`Fetching ${url}...`);

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        try {
            const pages = JSON.parse(data);
            if (!Array.isArray(pages)) {
                console.log('Response is not an array.');
                console.log(data.substring(0, 500));
                return;
            }
            console.log('Found ' + pages.length + ' pages.');
            pages.forEach(p => {
                console.log(`ID: ${p.id}, Slug: ${p.slug}, Title: ${p.title.rendered}`);
            });
        } catch (e) {
            console.error('Error parsing JSON:', e.message);
            console.log('Raw data preview:', data.substring(0, 500));
        }
    });
}).on('error', (err) => {
    console.error('Error:', err.message);
});
