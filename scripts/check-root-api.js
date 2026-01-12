const https = require('https');
const url = 'https://news.marketsheadlines.com/wp-json/';

console.log(`Fetching ${url}...`);

https.get(url, (res) => {
    let data = '';
    res.on('data', (c) => data += c);
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            console.log('site_icon_url:', json.site_icon_url);
            console.log('name:', json.name);
        } catch (e) {
            console.error('Error parsing JSON:', e.message);
        }
    });
}).on('error', (e) => console.error(e.message));
