
const rawFeatures = "12 Real-time global market coverage, 12 Regulatory filings from major authorities, and 12 Sector-specific intelligence (Energy, Pharma, ETFs & more)";

let features: string[] = [];

// 1. Try split by newline first (preferred)
const newlineSplit = rawFeatures.split(/\r?\n/).filter(Boolean);
console.log('Newline split length:', newlineSplit.length);

// 2. If newline split failed (still 1 item) and we detect the "12 " pattern, try splitting by that.
if (newlineSplit.length <= 1 && rawFeatures.includes('12 ')) {
    console.log('Detecting 12 pattern...');
    features = rawFeatures
        .split(/(?:^|,\s*(?:and\s*)?)12\s+/) // Split by "12 " with optional preceding comma/and
        .map(s => s.trim()) // Trim the split parts
        .filter(s => s.length > 0 && s !== ','); // Filter empty or just comma left-overs
} else {
    features = newlineSplit;
}

console.log('Final features:', features);
