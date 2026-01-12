const fs = require('fs');

const filePath = 'c:/wamp64/www/Marketheadlines/wp-next-headless/lib/wordpress/api.ts';
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

lines.forEach((line, index) => {
    if (line.includes('export async function getAllPosts')) {
        console.log(`Found at line ${index + 1}: ${line.trim()}`);
    }
});
