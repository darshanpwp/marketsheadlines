const fs = require('fs');
const path = require('path');

// Mock Environment and Request
const WP_URL = 'https://news.marketsheadlines.com';
const SITE_URL = 'https://marketsheadlines.vercel.app';

// Mock the transformation logic from utils.ts (since we can't easily import the TS file in node directly without setup)
function transformXml(xml) {
    let modifiedXml = xml;

    // 1. Add Namespace Definition if missing
    if (!modifiedXml.includes('xmlns:company')) {
        modifiedXml = modifiedXml.replace(
            /<rss version="2.0"/,
            '<rss version="2.0" xmlns:company="http://www.marketsheadlines.com/company"'
        );
    }

    // 2. Fix Empty Links logic
    modifiedXml = modifiedXml.replace(/<link><\/link>/g, `<link>${SITE_URL}</link>`);

    // 3. Global URL Replacement (Backend -> Frontend)
    const wpHostname = WP_URL.replace(/^https?:\/\//, '');
    const escapedWpHostname = wpHostname.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regexUrl = new RegExp(`https?://${escapedWpHostname}`, 'gi');
    modifiedXml = modifiedXml.replace(regexUrl, SITE_URL);

    // 4. Inject <company:symbol> tags
    const itemRegex = /<item>[\s\S]*?<\/item>/g;

    modifiedXml = modifiedXml.replace(itemRegex, (itemXml) => {
        if (itemXml.includes('<company:symbol>')) {
            return itemXml;
        }

        const symbols = new Set();
        const symbolRegex = /\((NASDAQ|NYSE|TSX|TSXV|CSE|OTC[A-Z]*):\s*([A-Z0-9]+)\)/gi;

        let match;
        while ((match = symbolRegex.exec(itemXml)) !== null) {
            const exchange = match[1].toUpperCase();
            const ticker = match[2].toUpperCase();
            symbols.add(`${exchange}:${ticker}`);
        }

        if (symbols.size === 0) {
            return itemXml;
        }

        const tags = Array.from(symbols)
            .map(s => `<company:symbol>${s}</company:symbol>`)
            .join('\n\t\t');

        // Insert after <category> tags
        if (itemXml.includes('</category>')) {
            const lastCategoryIndex = itemXml.lastIndexOf('</category>');

            // Inspect indentation
            const lineStart = itemXml.lastIndexOf('\n', lastCategoryIndex);
            let indentation = '\t\t';
            if (lineStart !== -1) {
                const indentationMatch = itemXml.substring(lineStart + 1, lastCategoryIndex).match(/^\s+/);
                if (indentationMatch) {
                    indentation = indentationMatch[0];
                }
            }

            const indentedTags = symbols
                .map(s => `${indentation}<company:symbol>${s}</company:symbol>`)
                .join('\n');

            return itemXml.slice(0, lastCategoryIndex + 11) + `\n${indentedTags}` + itemXml.slice(lastCategoryIndex + 11);
        } else if (itemXml.includes('<guid')) {
            return itemXml.replace('<guid', `${tags}\n\t\t<guid`);
        } else {
            return itemXml.replace('</item>', `\t${tags}\n</item>`);
        }
    });

    return modifiedXml;
}

// 1. Read the XML file
const xmlPath = path.join(process.cwd(), 'backend_feed_verification.xml');
// Check if the input file exists
if (!fs.existsSync(xmlPath)) {
    console.error(`Error: Input file not found at ${xmlPath}`);
    process.exit(1);
}
const xml = fs.readFileSync(xmlPath, 'utf8');

// 2. Transform
const outputXml = transformXml(xml);

// 3. Write output
const outputPath = path.join(process.cwd(), 'verification_output.xml');
fs.writeFileSync(outputPath, outputXml, 'utf8');
const resultXml = outputXml; // Renamed for consistency with validation section

// Validation
console.log('--- Verification Report ---');

// Check Namespace
if (resultXml.includes('xmlns:company="http://www.marketsheadlines.com/company"')) {
    console.log('[PASS] Namespace added.');
} else {
    console.log('[FAIL] Namespace missing.');
}

// Check Empty Links
if (!resultXml.includes('<link></link>')) {
    console.log('[PASS] No empty <link> tags found.');
} else {
    console.log('[FAIL] Empty <link> tags still present.');
}

// Check for specific symbols known to be in the feed
// From backend_feed.xml: VisionWave (NASDAQ: VWAV), Lockheed Martin (NYSE: LMT)
if (resultXml.includes('<company:symbol>NASDAQ:VWAV</company:symbol>')) {
    console.log('[PASS] Found NASDAQ:VWAV tag.');
} else {
    console.log('[FAIL] Missing NASDAQ:VWAV tag.');
}

if (resultXml.includes('<company:symbol>NYSE:LMT</company:symbol>')) {
    console.log('[PASS] Found NYSE:LMT tag.');
} else {
    console.log('[FAIL] Missing NYSE:LMT tag.');
}

// Write the output to a file for inspection
fs.writeFileSync(path.join(__dirname, 'test_output_feed.xml'), resultXml);
console.log('--- End Report ---');
console.log('Output written to test_output_feed.xml');
