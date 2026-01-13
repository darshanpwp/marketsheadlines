const https = require('https');

const baseUrl = 'https://news.marketsheadlines.com/wp-json/marketheadlines/v1';

const endpoints = [
    { name: 'Search (Query=apple)', path: '/search?q=apple' },
    { name: 'Menu (Primary)', path: '/menu/primary' },
    { name: 'Menu (Header)', path: '/menu/header' },
    { name: 'Menu (Footer)', path: '/menu/footer' },
    { name: 'Site Info', path: '/site' }
];

console.log('--- Verifying Custom Endpoints ---\n');

endpoints.forEach(ep => {
    const url = `${baseUrl}${ep.path}`;
    console.log(`Checking: ${ep.name} -> ${url}`);

    https.get(url, (res) => {
        let data = '';
        res.on('data', c => data += c);
        res.on('end', () => {
            console.log(`\n[${res.statusCode}] ${ep.name}`);
            if (res.statusCode === 200) {
                try {
                    const json = JSON.parse(data);
                    const isArray = Array.isArray(json);
                    const count = isArray ? json.length : Object.keys(json).length;
                    console.log(`   Data: ${isArray ? 'Array' : 'Object'} with ${count} items/keys`);
                    if (isArray && count > 0) console.log(`   Sample: ${JSON.stringify(json[0]).substring(0, 100)}...`);
                    else if (!isArray) console.log(`   Sample: ${JSON.stringify(json).substring(0, 100)}...`);
                } catch (e) {
                    console.log('   Error parsing JSON');
                }
            } else {
                console.log(`   Failed: ${res.statusCode} ${res.statusMessage}`);
            }
        });
    }).on('error', e => console.error(`   Error: ${e.message}`));
});
