const fs = require('fs');

function findInFile(filePath, searchString) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n');
        lines.forEach((line, index) => {
            if (line.includes(searchString)) {
                console.log(`${filePath}:${index + 1}: ${line.trim()}`);
            }
        });
    } catch (err) {
        console.error(`Error reading ${filePath}: ${err.message}`);
    }
}

findInFile('c:/wamp64/www/Marketheadlines/wp-next-headless/types/wordpress.ts', 'GlobalThemeSettings');
findInFile('c:/wamp64/www/Marketheadlines/wp-next-headless/lib/wordpress/api.ts', 'getGlobalThemeSettings');
