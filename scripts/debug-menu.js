const https = require('https');

const slugs = ['main_menu', 'quick-links'];

slugs.forEach(slug => {
    const url = `https://news.marketsheadlines.com/wp-json/marketheadlines/v1/menu/${slug}`;
    console.log(`Fetching: ${url}`);

    https.get(url, (res) => {
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            try {
                console.log(`\n--- Response for ${slug} ---`);
                console.log(`Status: ${res.statusCode}`);
                if (res.statusCode === 200) {
                    const json = JSON.parse(data);
                    console.log(JSON.stringify(json, null, 2).substring(0, 2000)); // Print first 2000 chars
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
});
