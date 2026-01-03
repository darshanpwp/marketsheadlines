# WordPress Posts Endpoint Review

## Endpoint URL
```
https://dev-new-marketsheadlines.pantheonsite.io/wp-json/wp/v2/posts
```

## Authentication Required
✅ **Yes** - This endpoint requires authentication (401 error without credentials)

## Expected Structure

Based on WordPress REST API standards, the `/wp/v2/posts` endpoint returns an array of post objects with the following structure:

### Core Fields (Similar to Pages)
- `id` (number) - Post ID
- `date` (string) - Publication date (ISO 8601)
- `date_gmt` (string) - Publication date GMT
- `guid` (object) - Global unique identifier
- `modified` (string) - Last modified date
- `modified_gmt` (string) - Last modified date GMT
- `slug` (string) - URL-friendly post slug
- `status` (string) - Post status (publish, draft, etc.)
- `type` (string) - Post type (usually "post")
- `link` (string) - Full URL to the post
- `title` (object) - Post title with `rendered` property
- `content` (object) - Post content with `rendered` and `protected` properties
- `excerpt` (object) - Post excerpt with `rendered` and `protected` properties
- `author` (number) - Author user ID
- `featured_media` (number) - Featured image media ID
- `comment_status` (string) - Comment status (open, closed)
- `ping_status` (string) - Pingback status
- `sticky` (boolean) - Whether post is sticky
- `template` (string) - Post template
- `format` (string) - Post format (standard, aside, etc.)
- `meta` (object) - Custom meta fields
- `categories` (array) - Array of category IDs
- `tags` (array) - Array of tag IDs
- `_links` (object) - HATEOAS links
- `_embedded` (object) - Embedded resources (when `_embed` parameter is used)

### Post-Specific Fields (Not in Pages)
- `categories` (array) - Category IDs
- `tags` (array) - Tag IDs
- `format` (string) - Post format
- `sticky` (boolean) - Whether post is sticky/pinned
- `comment_status` (string) - Comment status
- `ping_status` (string) - Pingback/trackback status

### Embedded Data (with `_embed` parameter)
- `author` (array) - Author user objects
- `wp:featuredmedia` (array) - Featured media objects
- `wp:term` (array) - Categories and tags
- `replies` (array) - Comment objects

## Differences from Pages Endpoint

| Feature | Pages | Posts |
|---------|-------|-------|
| Categories | ❌ | ✅ |
| Tags | ❌ | ✅ |
| Format | ❌ | ✅ |
| Sticky | ❌ | ✅ |
| Parent | ✅ | ❌ |
| Menu Order | ✅ | ❌ |

## Recommended Implementation

### 1. Create TypeScript Types
Add `WordPressPost` interface to `types/wordpress.ts`

### 2. Create API Functions
Add functions to `lib/wordpress/api.ts`:
- `getPosts()` - Fetch all posts
- `getPostsWithDetails()` - Fetch posts with embedded data
- `getPostBySlug()` - Fetch single post by slug
- `getAllPostSlugs()` - Get all post slugs for static generation
- `getPostsByCategory()` - Filter posts by category
- `getPostsByTag()` - Filter posts by tag

### 3. Create Post Pages
- `/posts/page.tsx` - Posts listing page
- `/posts/[slug]/page.tsx` - Individual post page

## Next Steps

1. **Provide Credentials** - Need WP_USERNAME and WP_PASSWORD to fetch actual data
2. **Analyze Real Data** - Once authenticated, analyze actual response structure
3. **Create Types** - Generate TypeScript interfaces based on real data
4. **Implement API Functions** - Create reusable functions for fetching posts
5. **Build UI Components** - Create post listing and detail pages

## Authentication

The endpoint requires Basic Authentication:
```
Authorization: Basic base64(username:password)
```

Use WordPress Application Password (not regular password):
1. Go to WordPress Admin → Users → Profile
2. Scroll to "Application Passwords"
3. Create new application password
4. Use username and application password for authentication

