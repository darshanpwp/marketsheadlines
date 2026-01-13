const https = require('https');

const url = 'https://news.marketsheadlines.com/wp-json/marketheadlines/v1/site';
console.log(`Fetching: ${url}`);

https.get(url, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            console.log(`\n--- Response for Site Settings ---`);
            console.log(`Status: ${res.statusCode}`);
            if (res.statusCode === 200) {
                const json = JSON.parse(data);
                console.log('footer_logo:', JSON.stringify(json.footer_logo, null, 2));
                console.log('Full Response Keys:', Object.keys(json));
            } else {
                console.log('Error: Non-200 status code');
            }
        } catch (e) {
            console.error('Error parsing JSON:', e);
            console.log('Raw data:', data);
        }
    });

}).on('error', (err) => {
    console.error('Error:', err.message);
});
