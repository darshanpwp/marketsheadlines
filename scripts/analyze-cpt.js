// Script to analyze WordPress Custom Post Type endpoint
const https = require('https');

const WP_API_URL = process.env.NEXT_PUBLIC_WP_API_URL || 'https://dev-new-marketsheadlines.pantheonsite.io/wp-json/wp/v2';
const WP_USERNAME = process.argv[2] || process.env.WP_USERNAME;
const WP_PASSWORD = process.argv[3] || process.env.WP_PASSWORD;
const CPT_SLUG = process.argv[4] || 'news-release'; // Default or pass as 4th argument

function getAuthHeader() {
  if (!WP_USERNAME || !WP_PASSWORD) {
    return null;
  }
  return 'Basic ' + Buffer.from(`${WP_USERNAME}:${WP_PASSWORD}`).toString('base64');
}

function fetchCPT(cptSlug) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${WP_API_URL}/${cptSlug}?per_page=2&_embed`);
    
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
            const items = JSON.parse(data);
            resolve({ items, statusCode: res.statusCode });
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

async function analyzeCPT() {
  try {
    console.log(`Analyzing Custom Post Type: ${CPT_SLUG}\n`);
    console.log(`Endpoint: ${WP_API_URL}/${CPT_SLUG}\n`);
    
    if (!WP_USERNAME || !WP_PASSWORD) {
      console.log('⚠️  WARNING: WP_USERNAME or WP_PASSWORD not found');
      console.log('Usage: node scripts/analyze-cpt.js [username] [password] [cpt-slug]\n');
      return;
    }

    const { items, statusCode } = await fetchCPT(CPT_SLUG);
    
    if (Array.isArray(items) && items.length > 0) {
      console.log('✅ Successfully fetched CPT data!\n');
      console.log('=== CPT ENDPOINT ANALYSIS ===\n');
      console.log(`Total items in response: ${items.length}\n`);
      
      const firstItem = items[0];
      
      console.log('=== FIRST ITEM STRUCTURE ===\n');
      console.log(JSON.stringify(firstItem, null, 2));
      
      console.log('\n\n=== KEY FIELDS ANALYSIS ===\n');
      console.log('Top-level fields:');
      Object.keys(firstItem).forEach(key => {
        const value = firstItem[key];
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
      if (firstItem._embedded) {
        console.log('\n=== EMBEDDED DATA (_embed parameter) ===\n');
        Object.keys(firstItem._embedded).forEach(key => {
          const embedded = firstItem._embedded[key];
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
      
      // Compare with standard posts
      console.log('\n=== COMPARISON WITH STANDARD POSTS ===\n');
      const standardPostFields = ['id', 'date', 'slug', 'title', 'content', 'excerpt', 'author', 'featured_media', 'categories', 'tags'];
      const cptFields = Object.keys(firstItem);
      
      const commonFields = standardPostFields.filter(field => cptFields.includes(field));
      const uniqueFields = cptFields.filter(field => !standardPostFields.includes(field));
      
      console.log(`Common fields with posts: ${commonFields.length}`);
      commonFields.forEach(field => console.log(`  ✓ ${field}`));
      
      if (uniqueFields.length > 0) {
        console.log(`\nUnique CPT fields: ${uniqueFields.length}`);
        uniqueFields.forEach(field => console.log(`  ⭐ ${field}`));
      }
      
    } else if (Array.isArray(items) && items.length === 0) {
      console.log('⚠️  CPT endpoint exists but no items found');
      console.log('This might be a valid CPT with no published items.\n');
    } else {
      console.log('⚠️  Unexpected response format');
      console.log('Response:', JSON.stringify(items, null, 2).substring(0, 500));
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.message.includes('404')) {
      console.log('\n💡 The CPT slug might not exist. Common CPT slugs:');
      console.log('  - news-release');
      console.log('  - press-release');
      console.log('  - article');
      console.log('  - publication');
      console.log('\nTry: node scripts/analyze-cpt.js [username] [password] [cpt-slug]');
    } else if (error.message.includes('401') || error.message.includes('403')) {
      console.log('\n💡 Authentication failed. Please check:');
      console.log('  1. WP_USERNAME is correct');
      console.log('  2. WP_PASSWORD is the application password');
      console.log('  3. User has proper permissions');
    }
  }
}

analyzeCPT();

