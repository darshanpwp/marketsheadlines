const https = require('https');

const url = 'https://news.marketsheadlines.com/wp-json/custom-market/v1/tickers';
console.log(`Target URL: ${url}`);

function test(headers, label) {
    const opts = {
        headers: headers
    };

    console.log(`\nTesting with headers [${label}]:`, JSON.stringify(headers));

    https.get(url, opts, (res) => {
        let data = '';
        res.on('data', c => data += c);
        res.on('end', () => {
            console.log(`[${label}] Status: ${res.statusCode}`);
            if (res.statusCode !== 200) {
                console.log(`[${label}] Body:`, data.substring(0, 100));
            }
        });
    }).on('error', (e) => {
        console.error(`[${label}] Error:`, e.message);
    });
}

// Test 1: No headers (Simulate direct fetch)
test({}, 'No Headers');

// Test 2: With Accept: application/json
test({ 'Accept': 'application/json' }, 'With Accept-JSON');
