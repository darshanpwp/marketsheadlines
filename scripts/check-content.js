const https = require('https');
const url = 'https://news.marketsheadlines.com/wp-json/custom/v1/page-pods/3504679/';

// Colors for console output
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const RESET = '\x1b[0m';

console.log(`Fetching Home Page Data from: ${url}...\n`);

https.get(url, (res) => {
    let data = '';
    res.on('data', (c) => data += c);
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            let hasErrors = false;

            // Helper to check fields
            const checkField = (path, name, isArray = false) => {
                const value = path ? path[name] : undefined;
                if (!value || (isArray && !Array.isArray(value))) {
                    console.error(`${RED}[MISSING] ${name}${RESET}`);
                    hasErrors = true;
                } else {
                    console.log(`${GREEN}[OK] ${name}${RESET} (${isArray ? value.length + ' items' : 'Present'})`);
                }
            };

            console.log('--- Verifying Data Structure ---\n');

            // 1. Trending Section
            console.log('Checking "Trending Now"...');
            const trending = json['Trending Now'];
            if (!trending) {
                console.error(`${RED}[MISSING] Section: Trending Now${RESET}`);
                hasErrors = true;
            } else {
                checkField(trending, 'title');
                checkField(trending, 'posts', true);
            }

            // 2. World News Grid
            console.log('\nChecking "World News Grid"...');
            const worldGrid = json['World News Grid'];
            if (!worldGrid) {
                console.error(`${RED}[MISSING] Section: World News Grid${RESET}`);
                hasErrors = true;
            } else {
                checkField(worldGrid, 'title');
                checkField(worldGrid, 'posts', true);
            }

            // 3. Market Intelligence
            console.log('\nChecking "Market Intelligence Section"...');
            const marketInt = json['Market Intelligence Section'];
            if (!marketInt) {
                console.error(`${RED}[MISSING] Section: Market Intelligence Section${RESET}`);
                hasErrors = true;
            } else {
                checkField(marketInt, 'market_intelligence_main_heading');
            }

            // 4. Investors Section
            console.log('\nChecking "For Investors & Organizations"...');
            const investors = json['For Investors & Organizations'];
            if (!investors) {
                console.error(`${RED}[MISSING] Section: For Investors & Organizations${RESET}`);
                hasErrors = true;
            } else {
                checkField(investors, 'for_investors_organizations_main_heading');
                // Check features array
                const features = investors.for_investors_organizations_features;
                if (Array.isArray(features) && features.length > 0) {
                    console.log(`${GREEN}[OK] Features${RESET} (${features.length} items)`);
                } else {
                    console.warn(`${RED}[WARNING] No features found in Investors section.${RESET}`);
                }
            }

            console.log('\n-----------------------------------');
            if (hasErrors) {
                console.error(`${RED}❌ Validation Failed. Some required fields/sections are missing.${RESET}`);
                console.error('Please check the WordPress Pods configuration matches the expected frontend contract.');
                process.exit(1);
            } else {
                console.log(`${GREEN}✅ Validation Passed. Home Page Data structure appears correct.${RESET}`);
                process.exit(0);
            }

        } catch (e) {
            console.error(`${RED}Error parsing JSON:${RESET}`, e.message);
            process.exit(1);
        }
    });
}).on('error', (e) => {
    console.error(`${RED}Network Error:${RESET}`, e.message);
    process.exit(1);
});
