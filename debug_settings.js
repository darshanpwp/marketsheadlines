const https = require('https');

const API_URL = 'https://news.marketsheadlines.com/wp-json/custom/v1/global-pods-theme-settings/';
const HOME_DATA_URL = 'https://news.marketsheadlines.com/wp-json/marketheadlines/v1/home-page-data';

function fetchData(url, name) {
    https.get(url, (resp) => {
        let data = '';

        // A chunk of data has been received.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received.
        resp.on('end', () => {
            try {
                const jsonData = JSON.parse(data);
                console.log(`\n--- ${name} ---`);
                if (name === 'Global Settings') {
                    console.log('single_post_cta_heading:', jsonData.single_post_cta_heading);
                    console.log('single_post_cta_description:', jsonData.single_post_cta_description);
                    console.log('subscribe_to_newsletter_button_text:', jsonData.subscribe_to_newsletter_button_text);
                    console.log('register_for_market_access_button_text:', jsonData.register_for_market_access_button_text);
                } else {
                    console.log('show_newsletter_section:', jsonData.show_newsletter_section);
                    console.log('newsletter_heading:', jsonData.newsletter_heading);
                }
            } catch (e) {
                console.error(`Error parsing JSON for ${name}:`, e.message);
            }
        });

    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
}

fetchData(API_URL, 'Global Settings');
fetchData(HOME_DATA_URL, 'Home Page Data');
