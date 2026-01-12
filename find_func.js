const fs = require('fs');

const filePath = 'c:/wamp64/www/Marketheadlines/wp-next-headless/lib/wordpress/api.ts';
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

let found = false;
lines.forEach((line, index) => {
    if (line.includes('export async function getGlobalThemeSettings')) {
        console.log(`Found at line ${index + 1}: ${line.trim()}`);
        found = true;
        // Print context
        for (let i = 0; i < 30; i++) {
            if (lines[index + i]) console.log(`${index + 1 + i}: ${lines[index + i].trim()}`);
        }
    }
});

if (!found) console.log('Function NOT found.');
