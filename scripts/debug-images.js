const https = require('https');

const url = 'https://news.marketsheadlines.com/wp-json/custom/v1/page-pods/3504679/';

console.log(`Fetching: ${url}`);

https.get(url, (res) => {
    let data = '';
    res.on('data', c => data += c);
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            const marketSection = json['Market Intelligence Section'] || {};
            const investorsSection = json['For Investors & Organizations'] || {};

            console.log('\n--- Market Intelligence Image ---');
            console.log(JSON.stringify(marketSection.market_intelligence_image, null, 2));

            console.log('\n--- Investors Features Images ---');
            if (investorsSection.for_investors_organizations_features) {
                console.log(JSON.stringify(investorsSection.for_investors_organizations_features, null, 2));
            } else {
                console.log('No investors features found');
            }

        } catch (e) {
            console.error('Error parsing JSON:', e);
        }
    });
});
