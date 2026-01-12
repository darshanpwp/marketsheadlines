const https = require('https');
const url = 'https://news.marketsheadlines.com/wp-json/custom/v1/global-pods-theme-settings/';

console.log(`Fetching ${url}...`);

https.get(url, (res) => {
    let data = '';
    res.on('data', (c) => data += c);
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            console.log('Keys:', Object.keys(json));
            // Check for potential icon fields
            console.log('site_icon:', json.site_icon);
            console.log('favicon:', json.favicon);
            // Dump full object to be sure
            console.log(JSON.stringify(json, null, 2));
        } catch (e) {
            console.error('Error parsing JSON:', e.message);
        }
    });
}).on('error', (e) => console.error(e.message));
