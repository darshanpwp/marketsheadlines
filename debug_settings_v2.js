const https = require('https');

const API_URL = 'https://news.marketsheadlines.com/wp-json/custom/v1/global-pods-theme-settings/';

https.get(API_URL, (resp) => {
    let data = '';

    resp.on('data', (chunk) => {
        data += chunk;
    });

    resp.on('end', () => {
        try {
            const jsonData = JSON.parse(data);
            console.log('JSON_START');
            console.log(JSON.stringify({
                single_post_cta_heading: jsonData.single_post_cta_heading,
                single_post_cta_description: jsonData.single_post_cta_description,
                subscribe_to_newsletter_button_text: jsonData.subscribe_to_newsletter_button_text,
                register_for_market_access_button_text: jsonData.register_for_market_access_button_text
            }, null, 2));
            console.log('JSON_END');
        } catch (e) {
            console.error(e.message);
        }
    });

}).on("error", (err) => {
    console.log("Error: " + err.message);
});
