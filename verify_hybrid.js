const fs = require('fs');

// Mock Transformation Logic (Same as utils.ts)
function transformXml(xml) {
    let modifiedXml = xml;
    // 1. Add Namespace
    if (!modifiedXml.includes('xmlns:company')) {
        modifiedXml = modifiedXml.replace(
            /<rss version="2.0"/,
            '<rss version="2.0" xmlns:company="http://www.marketsheadlines.com/company"'
        );
    }

    // 4. Inject <company:symbol> tags
    const itemRegex = /<item>[\s\S]*?<\/item>/g;
    modifiedXml = modifiedXml.replace(itemRegex, (itemXml) => {
        // SAFETY CHECK: If tags exist, DO NOT touch.
        if (itemXml.includes('<company:symbol>')) {
            return itemXml;
        }

        const symbols = new Set();
        const symbolRegex = /\((NASDAQ|NYSE|TSX|TSXV|CSE|OTC[A-Z]*):\s*([A-Z0-9]+)\)/gi;
        let match;
        while ((match = symbolRegex.exec(itemXml)) !== null) {
            symbols.add(`${match[1].toUpperCase()}:${match[2].toUpperCase()}`);
        }

        if (symbols.size === 0) {
            return itemXml;
        }

        const tags = Array.from(symbols)
            .map(s => `<company:symbol>${s}</company:symbol>`)
            .join('\n\t\t');

        if (itemXml.includes('<guid')) {
            // Insert before guid
            return itemXml.replace('<guid', `${tags}\n\t\t<guid`);
        } else {
            return itemXml.replace('</item>', `\t${tags}\n</item>`);
        }
    });

    return modifiedXml;
}

// TEST CASES
const testCase1_NoTags = `
<item>
    <title>Auto Gen Test</title>
    <description>Text with (NASDAQ: AUTO).</description>
    <guid>1</guid>
</item>
`;

const testCase2_WithTags = `
<item>
    <title>Manual Tag Test</title>
    <description>Text with (NASDAQ: AUTO) but I have manual tags.</description>
    <company:symbol>NYSE:MANUAL</company:symbol>
    <guid>2</guid>
</item>
`;

const inputXml = `
<rss version="2.0">
<channel>
    ${testCase1_NoTags}
    ${testCase2_WithTags}
</channel>
</rss>
`;

console.log('Running Hybrid Verification...');
const output = transformXml(inputXml);

const pass1 = output.includes('<company:symbol>NASDAQ:AUTO</company:symbol>');
const pass2 = output.includes('<company:symbol>NYSE:MANUAL</company:symbol>');
// Case 2 should NOT have generated NASDAQ:AUTO because tags existed
// Wait, my logic is: "if includes <company:symbol>, return itemXml". 
// So it scans the WHOLE itemXml. If it finds the manual tag, it returns PRECISELY the itemXml.
// So for Case 2, it should contain ONLY NYSE:MANUAL, and NOT NASDAQ:AUTO (even though the text is there).
const pass2_exclusion = !output.includes('NASDAQ:AUTO</company:symbol>') || output.indexOf('NASDAQ:AUTO') < output.indexOf('Manual Tag Test');
// Actually, pass1 will find NASDAQ:AUTO in the *first* item.
// I need to be careful with global string checks.

if (pass1) console.log('[PASS] Case 1: Auto-generated tag for item without tags.');
else console.log('[FAIL] Case 1: Did not generate tag.');

if (pass2) console.log('[PASS] Case 2: Preserved manual tag.');
else console.log('[FAIL] Case 2: Lost manual tag.');

// Check if Case 2 got auto-generated tag (it shouldn't)
// We extract the second item from output
const item2 = output.split('<item>')[2];
if (item2 && !item2.includes('NASDAQ:AUTO')) {
    console.log('[PASS] Case 2: Correctly skipped auto-generation because manual tag existed.');
} else {
    console.log('[FAIL] Case 2: Auto-generated tag despite manual tag presence (or parsing error).');
    console.log('Item 2 Content:\n', item2);
}
