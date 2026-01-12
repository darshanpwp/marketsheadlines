const https = require('https');
// Use the WP_API_URL logic approximately
const url = 'https://news.marketsheadlines.com/wp-json/wp/v2/settings';

console.log(`Fetching ${url}...`);

https.get(url, (res) => {
    let data = '';
    res.on('data', (c) => data += c);
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            // Site icon is often just an ID in standard API
            console.log('site_icon:', json.site_icon_url || json.site_icon);
            console.log('Keys:', Object.keys(json));
        } catch (e) {
            console.error('Error parsing JSON:', e.message);
        }
    });
}).on('error', (e) => console.error(e.message));
