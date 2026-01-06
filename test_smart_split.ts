
function smartSplit(text: string): string[] {
    const results: string[] = [];
    let current = '';
    let parenDepth = 0;

    // Handle the "and " before the last item if it exists in a comma list
    // E.g. "A, B, and C" -> "A, B, C" before splitting? 
    // Actually, "and" might be part of the item. "Regulatory... authorities, and Test 123".
    // The "and" acts as a conjunction. We usually want to strip it if it's strictly separating.

    for (let i = 0; i < text.length; i++) {
        const char = text[i];

        if (char === '(') {
            parenDepth++;
            current += char;
        } else if (char === ')') {
            if (parenDepth > 0) parenDepth--;
            current += char;
        } else if (char === ',' && parenDepth === 0) {
            // Found a separator
            results.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    if (current.trim()) {
        results.push(current.trim());
    }

    // Clean up "and" from the start of items if it looks like a list conjunction
    return results.map(item => {
        // If item starts with "and " (case-insensitive) and it's likely a list connector
        if (/^and\s+/i.test(item)) {
            return item.replace(/^and\s+/i, '');
        }
        return item;
    });
}

const raw = "Real-time global market coverage, Regulatory filings from major authorities, Sector-specific intelligence (Energy, Pharma, ETFs & more), and Test 123";

const features = smartSplit(raw);
console.log('Features:', JSON.stringify(features, null, 2));
