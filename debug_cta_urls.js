const https = require('https');

const API_URL = 'https://news.marketsheadlines.com/wp-json/custom/v1/page-pods/3504679/';

https.get(API_URL, (resp) => {
    let data = '';

    resp.on('data', (chunk) => {
        data += chunk;
    });

    resp.on('end', () => {
        try {
            const jsonData = JSON.parse(data);
            console.log('Trending View All:', jsonData['Trending Now Section']?.view_all_url);
            console.log('World List View All:', jsonData['World News List Section']?.view_all_url);
        } catch (e) {
            console.error(e.message);
        }
    });

}).on("error", (err) => {
    console.log("Error: " + err.message);
});
