// Script to fetch and analyze WordPress posts endpoint
const https = require('https');

const url = 'https://dev-new-marketsheadlines.pantheonsite.io/wp-json/wp/v2/posts?per_page=2&_embed';

https.get(url, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const posts = JSON.parse(data);
      
      if (Array.isArray(posts) && posts.length > 0) {
        console.log('=== POSTS ENDPOINT ANALYSIS ===\n');
        console.log(`Total posts fetched: ${posts.length}`);
        console.log('\n=== FIRST POST STRUCTURE ===\n');
        console.log(JSON.stringify(posts[0], null, 2));
        
        // Analyze structure
        console.log('\n=== KEY FIELDS ANALYSIS ===\n');
        const firstPost = posts[0];
        console.log('Available fields:');
        Object.keys(firstPost).forEach(key => {
          const value = firstPost[key];
          const type = Array.isArray(value) ? 'array' : typeof value;
          console.log(`  - ${key}: ${type}${typeof value === 'object' && value !== null && !Array.isArray(value) ? ` (${Object.keys(value).length} nested keys)` : ''}`);
        });
        
        // Check for embedded data
        if (firstPost._embedded) {
          console.log('\n=== EMBEDDED DATA ===\n');
          Object.keys(firstPost._embedded).forEach(key => {
            console.log(`  - ${key}: ${Array.isArray(firstPost._embedded[key]) ? `array (${firstPost._embedded[key].length} items)` : typeof firstPost._embedded[key]}`);
          });
        }
      } else {
        console.log('No posts found or empty response');
        console.log('Response:', data.substring(0, 500));
      }
    } catch (error) {
      console.error('Error parsing JSON:', error.message);
      console.log('Raw response:', data.substring(0, 1000));
    }
  });
}).on('error', (error) => {
  console.error('Error fetching posts:', error.message);
});

