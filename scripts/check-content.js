const https = require('https');
const url = 'https://news.marketsheadlines.com/wp-json/custom/v1/page-pods/3504679/';

console.log(`Fetching ${url}...`);

https.get(url, (res) => {
    let data = '';
    res.on('data', (c) => data += c);
    res.on('end', () => {
        try {
            const json = JSON.parse(data);

            console.log('\n--- World News (Section Title: ' + (json['World News']?.title || 'N/A') + ') ---');
            const world = json['World News']?.posts || [];
            if (world.length === 0) console.log('No posts in World News.');
            world.forEach(p => console.log(`[${p.id}] ${p.title}`));

            console.log('\n--- Trending Now ---');
            const trending = json['Trending Now']?.posts || [];
            if (trending.length === 0) console.log('No posts in Trending.');
            trending.forEach(p => console.log(`[${p.id}] ${p.title}`));

        } catch (e) {
            console.error('Error parsing JSON:', e.message);
        }
    });
}).on('error', (e) => console.error(e.message));
