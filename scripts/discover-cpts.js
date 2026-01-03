// Script to discover available Custom Post Types
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

function fetchEndpoint(path) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${WP_API_URL}${path}`);
    
    const options = {
      hostname: url.hostname,
      path: url.pathname + (url.search || ''),
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
            const json = JSON.parse(data);
            resolve({ data: json, statusCode: res.statusCode });
          } catch (error) {
            resolve({ data: data, statusCode: res.statusCode, raw: true });
          }
        } else {
          resolve({ error: true, statusCode: res.statusCode, message: data.substring(0, 200) });
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

async function discoverCPTs() {
  try {
    console.log('Discovering available Custom Post Types...\n');
    
    if (!WP_USERNAME || !WP_PASSWORD) {
      console.log('⚠️  WARNING: WP_USERNAME or WP_PASSWORD not found');
      console.log('Usage: node scripts/discover-cpts.js [username] [password]\n');
      return;
    }

    // Try to get types endpoint
    console.log('1. Checking /wp/v2/types endpoint...');
    const typesResult = await fetchEndpoint('/types');
    
    if (!typesResult.error && typesResult.data) {
      console.log('✅ Found post types:\n');
      Object.keys(typesResult.data).forEach(type => {
        const typeInfo = typesResult.data[type];
        console.log(`  📝 ${type}`);
        if (typeInfo.rest_base) {
          console.log(`     REST Base: ${typeInfo.rest_base}`);
        }
        if (typeInfo.name) {
          console.log(`     Name: ${typeInfo.name}`);
        }
        console.log('');
      });
    } else {
      console.log(`❌ Could not fetch types: ${typesResult.message || 'Unknown error'}\n`);
    }

    // Try common CPT slugs
    console.log('\n2. Testing common CPT endpoints...\n');
    const commonCPTs = [
      'news-release',
      'press-release',
      'article',
      'publication',
      'news',
      'release',
      'announcement',
      'update',
      'story',
      'content'
    ];

    for (const cpt of commonCPTs) {
      const result = await fetchEndpoint(`/${cpt}?per_page=1`);
      if (!result.error && result.statusCode === 200) {
        console.log(`✅ Found: /${cpt} (Status: ${result.statusCode})`);
        if (Array.isArray(result.data) && result.data.length > 0) {
          console.log(`   Sample item ID: ${result.data[0].id}`);
        }
      } else {
        console.log(`❌ Not found: /${cpt}`);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

discoverCPTs();

