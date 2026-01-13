const https = require('https');

const endpoints = [
    'https://news.marketsheadlines.com/wp-json/wp/v2/posts?per_page=1',
    'https://news.marketsheadlines.com/wp-json/marketheadlines/v1/site', // New site endpoint
    'https://news.marketsheadlines.com/wp-json/custom/v1/global-pods-theme-settings/', // Old site endpoint
    'https://news.marketsheadlines.com/wp-json/custom/v1/page-pods/3504679/',
    'https://news.marketsheadlines.com/wp-json/custom-market/v1/tickers',
    'https://news.marketsheadlines.com/wp-json/menus/v1/menus/main_menu'
];

endpoints.forEach(url => {
    console.log(`Checking: ${url}`);
    const opts = {
        headers: {
            'Accept': 'application/json' // Add header as we did in fixes
        }
    };
    https.get(url, opts, (res) => {
        console.log(`[${res.statusCode}] ${url}`);
        if (res.statusCode >= 500) {
            console.error('!!! 500 ERROR FOUND !!!');
            res.on('data', d => console.log('Body:', d.toString()));
        }
    }).on('error', e => console.error(`Error fetching ${url}:`, e.message));
});
