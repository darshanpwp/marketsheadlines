const https = require('https');
const url = 'https://news.marketsheadlines.com/wp-json/custom/v1/page-pods/3504679/';

console.log(`Fetching ${url}...`);

https.get(url, (res) => {
    let data = '';
    res.on('data', (c) => data += c);
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            console.log('--- ROOT KEYS ---');
            console.log(Object.keys(json));

            console.log('\n--- ALL TITLES FOUND ---');
            Object.keys(json).forEach(key => {
                if (json[key]?.title) {
                    console.log(`[${key}].title = "${json[key].title}"`);
                }
                // Check for other potential heading fields
                if (json[key]?.heading) {
                    console.log(`[${key}].heading = "${json[key].heading}"`);
                }
                // Check if there are posts
                if (Array.isArray(json[key]?.posts)) {
                    console.log(`[${key}].posts count = ${json[key].posts.length}`);
                }
            });

        } catch (e) {
            console.error('Error parsing JSON:', e.message);
        }
    });
}).on('error', (e) => console.error(e.message));
