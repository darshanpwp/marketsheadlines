
// Logic verification standalone
// Actually, I'll just update the existing test_feed_transform.js since I know it mirrors utils.ts logic
// to strictly test this "Override" case.

const logic = (itemXml) => {
    // ---------------------------------------------------------
    // COPY OF LOGIC FROM app/api/feed/utils.ts (Simplified)
    // ---------------------------------------------------------

    // 1. Check if tags already exist (The "Override" check)
    if (itemXml.includes('<company:symbol>')) {
        return "PASS_THROUGH_DETECTED"; // It should return original XML in reality
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
        return "NO_SYMBOLS_FOUND";
    }

    return "AUTO_DETECTED_SYMBOLS: " + Array.from(symbols).join(', ');
};

// TEST CASES
const testCase1 = `
<item>
    <content:encoded>Some text with (NASDAQ: AUTO) symbol.</content:encoded>
    <company:symbol>NASDAQ:MANUAL</company:symbol>
</item>
`;

const testCase2 = `
<item>
    <content:encoded>Some text with (NASDAQ: AUTO) symbol.</content:encoded>
</item>
`;

console.log("Test Case 1 (Has Manual Tags):", logic(testCase1));
console.log("Test Case 2 (No Tags):        ", logic(testCase2));
