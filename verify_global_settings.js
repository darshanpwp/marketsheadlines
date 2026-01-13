const https = require('https');

const url = 'https://news.marketsheadlines.com/wp-json/custom/v1/global-pods-theme-settings/';

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            console.log('Keys:', Object.keys(json));
            if (json.blog_default_image) {
                console.log('blog_default_image:', JSON.stringify(json.blog_default_image, null, 2));
            } else {
                console.log('blog_default_image is MISSING or NULL');
            }
        } catch (e) {
            console.error('Error parsing JSON:', e.message);
        }
    });
}).on('error', (e) => {
    console.error('Error:', e.message);
});
