// Script to analyze WordPress posts endpoint with authentication
// Usage: node scripts/analyze-posts.js [username] [password]
// Or set environment variables: WP_USERNAME and WP_PASSWORD

const https = require('https');

const WP_API_URL = process.env.NEXT_PUBLIC_WP_API_URL || 'https://dev-new-marketsheadlines.pantheonsite.io/wp-json/wp/v2';
const WP_USERNAME = process.argv[2] || process.env.WP_USERNAME;
const WP_PASSWORD = process.argv[3] || process.env.WP_PASSWORD;

function getAuthHeader() {
  if (!WP_USERNAME || !WP_PASSWORD) {
    return null;
  }
  return 'Basic ' + Buffer.from(`${WP_USERNAME}:${WP_PASSWORD}`).toString('base64');
}

function fetchPosts() {
  return new Promise((resolve, reject) => {
    const url = new URL(`${WP_API_URL}/posts?per_page=2&_embed`);
    
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const authHeader = getAuthHeader();
    if (authHeader) {
      options.headers['Authorization'] = authHeader;
    }

    https.get(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          try {
            const posts = JSON.parse(data);
            resolve(posts);
          } catch (error) {
            reject(new Error(`JSON Parse Error: ${error.message}`));
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data.substring(0, 500)}`));
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

async function analyzePosts() {
  try {
    console.log('Fetching posts from WordPress API...\n');
    
    if (!WP_USERNAME || !WP_PASSWORD) {
      console.log('⚠️  WARNING: WP_USERNAME or WP_PASSWORD not found in .env.local');
      console.log('Please provide credentials to access the posts endpoint.\n');
      console.log('Expected environment variables:');
      console.log('  - WP_USERNAME');
      console.log('  - WP_PASSWORD');
      console.log('\nYou can add them to .env.local file.\n');
      return;
    }

    const posts = await fetchPosts();
    
    if (Array.isArray(posts) && posts.length > 0) {
      console.log('✅ Successfully fetched posts!\n');
      console.log('=== POSTS ENDPOINT ANALYSIS ===\n');
      console.log(`Total posts in response: ${posts.length}\n`);
      
      const firstPost = posts[0];
      
      console.log('=== FIRST POST STRUCTURE ===\n');
      console.log(JSON.stringify(firstPost, null, 2));
      
      console.log('\n\n=== KEY FIELDS ANALYSIS ===\n');
      console.log('Top-level fields:');
      Object.keys(firstPost).forEach(key => {
        const value = firstPost[key];
        let type = Array.isArray(value) ? 'array' : typeof value;
        let details = '';
        
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          const keys = Object.keys(value);
          details = ` (${keys.length} keys: ${keys.slice(0, 3).join(', ')}${keys.length > 3 ? '...' : ''})`;
        } else if (Array.isArray(value)) {
          details = ` (${value.length} items)`;
        }
        
        console.log(`  ✓ ${key}: ${type}${details}`);
      });
      
      // Analyze embedded data
      if (firstPost._embedded) {
        console.log('\n=== EMBEDDED DATA (_embed parameter) ===\n');
        Object.keys(firstPost._embedded).forEach(key => {
          const embedded = firstPost._embedded[key];
          if (Array.isArray(embedded)) {
            console.log(`  ✓ ${key}: array (${embedded.length} items)`);
            if (embedded.length > 0 && typeof embedded[0] === 'object') {
              console.log(`    Sample keys: ${Object.keys(embedded[0]).slice(0, 5).join(', ')}`);
            }
          } else {
            console.log(`  ✓ ${key}: ${typeof embedded}`);
          }
        });
      }
      
      // Compare with pages structure
      console.log('\n=== DIFFERENCES FROM PAGES ===\n');
      const postSpecificFields = ['categories', 'tags', 'format', 'sticky', 'comment_status', 'ping_status'];
      postSpecificFields.forEach(field => {
        if (firstPost.hasOwnProperty(field)) {
          console.log(`  ✓ ${field}: ${typeof firstPost[field]}${Array.isArray(firstPost[field]) ? ` (${firstPost[field].length} items)` : ''}`);
        }
      });
      
    } else {
      console.log('⚠️  No posts found in response');
      console.log('Response:', JSON.stringify(posts, null, 2));
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.message.includes('401') || error.message.includes('403')) {
      console.log('\n💡 Authentication failed. Please check:');
      console.log('  1. WP_USERNAME is correct');
      console.log('  2. WP_PASSWORD is the application password (not regular password)');
      console.log('  3. User has proper permissions in WordPress');
    }
  }
}

analyzePosts();

