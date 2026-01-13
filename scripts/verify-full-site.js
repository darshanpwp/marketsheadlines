const https = require('https');

const BASE_URL = 'https://news.marketsheadlines.com/wp-json';
const CUSTOM_BASE = 'https://news.marketsheadlines.com/wp-json/custom/v1';

// Helper to fetch and validate
function check(url, label, validator) {
    return new Promise((resolve) => {
        console.log(`\n[CHECKING] ${label}...`);
        console.log(`URL: ${url}`);

        // Simple fetch without headers to match public access (and avoid 415/401)
        https.get(url, (res) => {
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        const json = JSON.parse(data);
                        const result = validator(json);
                        if (result === true) {
                            console.log(`[PASS] ${label}`);
                            resolve({ success: true, label });
                        } else {
                            console.error(`[FAIL] ${label}: ${result}`);
                            resolve({ success: false, label, error: result });
                        }
                    } catch (e) {
                        console.error(`[FAIL] ${label}: Invalid JSON`);
                        resolve({ success: false, label, error: 'Invalid JSON' });
                    }
                } else {
                    console.error(`[FAIL] ${label}: HTTP ${res.statusCode}`);
                    resolve({ success: false, label, error: `HTTP ${res.statusCode}` });
                }
            });
        }).on('error', (e) => {
            console.error(`[FAIL] ${label}: Network Error ${e.message}`);
            resolve({ success: false, label, error: e.message });
        });
    });
}

async function run() {
    console.log('Starting Full Site Verification...');
    const results = [];

    // 1. Home Page Pods
    results.push(await check(
        `${CUSTOM_BASE}/page-pods/3504679/`,
        'Home Page Data',
        (json) => {
            if (!json['Trending Now']) return 'Missing "Trending Now" section';
            if (!json['World News Grid']) return 'Missing "World News Grid" section';
            return true;
        }
    ));

    // 2. Global Settings (Pods)
    results.push(await check(
        `${CUSTOM_BASE}/global-pods-theme-settings/`,
        'Global Settings (Pods)',
        (json) => {
            if (!json.footer_logo) return 'Missing footer_logo';
            return true;
        }
    ));

    // 3. Menus (Standard)
    results.push(await check(
        `${BASE_URL}/menus/v1/menus/main_menu`,
        'Main Menu',
        (json) => {
            if (!json.items || !Array.isArray(json.items)) return 'Invalid menu structure';
            if (json.items.length === 0) return 'Menu is empty';
            return true;
        }
    ));

    // 4. Latest Posts
    let testPostSlug = '';
    results.push(await check(
        `${BASE_URL}/wp/v2/posts?per_page=5&_embed`,
        'Latest Posts',
        (json) => {
            if (!Array.isArray(json)) return 'Response is not an array';
            if (json.length === 0) return 'No posts found';
            testPostSlug = json[0].slug;
            return true;
        }
    ));

    // 5. Single Post (using slug found above)
    if (testPostSlug) {
        results.push(await check(
            `${BASE_URL}/wp/v2/posts?slug=${testPostSlug}&_embed`,
            'Single Post Fetch',
            (json) => {
                if (!json[0] || !json[0].title || !json[0].content) return 'Invalid post structure';
                return true;
            }
        ));
    }

    // 6. Categories
    results.push(await check(
        `${BASE_URL}/wp/v2/categories?per_page=1`,
        'Categories',
        (json) => {
            if (!Array.isArray(json) || json.length === 0) return 'No categories found';
            return true;
        }
    ));

    // 7. Tickers
    results.push(await check(
        `${BASE_URL}/custom-market/v1/tickers`,
        'Market Tickers',
        (json) => {
            if (!Array.isArray(json)) return 'Not an array';
            // Note: Empty array is valid technically, but suspicious for a live site
            return true;
        }
    ));

    // 8. Search
    results.push(await check(
        `${BASE_URL}/wp/v2/search?search=market&per_page=1`,
        'Search Functionality',
        (json) => {
            if (!Array.isArray(json)) return 'Search response not array';
            return true;
        }
    ));

    console.log('\n--- SUMMARY ---');
    const failures = results.filter(r => !r.success);
    if (failures.length === 0) {
        console.log('ALL CHECKS PASSED ✅');
    } else {
        console.log(`${failures.length} CHECKS FAILED ❌`);
        failures.forEach(f => console.log(`- ${f.label}: ${f.error}`));
    }
}

run();
