# WordPress Posts Endpoint - Actual Data Analysis

## Endpoint
```
https://dev-new-marketsheadlines.pantheonsite.io/wp-json/wp/v2/posts
```

## Authentication Status
✅ **Successfully authenticated** and fetched data

## Actual Data Structure Analysis

### Sample Post Structure

Based on the actual API response, here's what a post object contains:

```typescript
{
  id: 3504615,
  date: "2025-12-24T12:35:14",
  date_gmt: "2025-12-24T17:35:14",
  guid: { rendered: "https://..." },
  modified: "2025-12-24T12:35:14",
  modified_gmt: "2025-12-24T17:35:14",
  slug: "tier-one-territory-5-gold-stocks-operating-in-the-land-of-giants",
  status: "publish",
  type: "post",
  link: "https://...",
  title: { rendered: "Post Title" },
  content: { rendered: "<div>...</div>", protected: false },
  excerpt: { rendered: "<p>...</p>", protected: false },
  author: 176,
  featured_media: 0,
  comment_status: "closed",
  ping_status: "closed",
  sticky: false,
  template: "",
  format: "standard",
  meta: {
    wprss_force_feed: "...",
    feed_custom_author: "",
    feed_company_symbol: "",
    footnotes: ""
  },
  categories: [1191],
  tags: [],
  class_list: [
    "post-3504615",
    "post",
    "type-post",
    "status-publish",
    "format-standard",
    "hentry",
    "category-usanewsgroup"
  ],
  _links: { ... },
  _embedded: {
    author: [{ id, name, url, description, link, slug, avatar_urls }],
    "wp:term": [
      [ // Categories array
        { id, link, name, slug, taxonomy: "category", _links }
      ],
      [ // Tags array (empty in this case)
      ]
    ]
  }
}
```

## Key Findings

### 1. Embedded Data Structure
- **`wp:term`** is an **array of arrays**: `[categories[], tags[]]`
  - First array contains category objects
  - Second array contains tag objects
  - Need to use `.flat()` to process them

### 2. Custom Meta Fields
The posts have custom meta fields:
- `wprss_force_feed` - RSS feed configuration
- `feed_custom_author` - Custom author for feeds
- `feed_company_symbol` - Company stock symbols
- `footnotes` - Footnotes

### 3. Post-Specific Fields
- `categories`: Array of category IDs (e.g., `[1191]`)
- `tags`: Array of tag IDs (can be empty `[]`)
- `format`: Post format (e.g., `"standard"`)
- `sticky`: Boolean indicating if post is pinned
- `comment_status`: `"closed"` or `"open"`
- `ping_status`: `"closed"` or `"open"`
- `class_list`: Array of CSS classes for styling

### 4. Featured Media
- Can be `0` if no featured image is set
- When present, embedded in `_embedded['wp:featuredmedia']`

### 5. Author Information
- Author ID is a number (e.g., `176`)
- Full author details available in `_embedded.author[0]`
- Includes avatar URLs in different sizes (24, 48, 96)

## Differences from Pages

| Feature | Pages | Posts |
|---------|-------|-------|
| Categories | ❌ | ✅ Array of IDs |
| Tags | ❌ | ✅ Array of IDs |
| Format | ❌ | ✅ (standard, aside, etc.) |
| Sticky | ❌ | ✅ Boolean |
| Parent | ✅ | ❌ |
| Menu Order | ✅ | ❌ |
| Class List | ❌ | ✅ Array of CSS classes |
| Custom Meta | Limited | ✅ Extended (RSS, feed fields) |

## Implementation Status

✅ **TypeScript Types Created**
- `WordPressPost` - Full WordPress post structure
- `Post` - Simplified post type
- `PostWithDetails` - Post with embedded data

✅ **API Functions Created**
- `getPosts()` - Fetch paginated posts
- `getPostsWithDetails()` - Fetch with embedded data
- `getPostBySlug()` - Fetch single post
- `getAllPostSlugs()` - Get all slugs for SSG
- `getPostsByCategory()` - Filter by category
- `getPostsByTag()` - Filter by tag

✅ **Data Transformation**
- Properly handles `wp:term` nested array structure
- Extracts categories and tags correctly
- Includes author and media details

## Sample Post Data

**Title**: "Tier-One Territory: 5 Gold Stocks Operating in the Land of Giants"

**Category**: USA News Group (ID: 1191)

**Author**: USA News Group (ID: 176)

**Format**: Standard

**Sticky**: No

**Featured Media**: None (0)

## Next Steps

1. ✅ Types and API functions are ready
2. ⏳ Create post listing page (`/posts/page.tsx`)
3. ⏳ Create post detail page (`/posts/[slug]/page.tsx`)
4. ⏳ Add category/tag filtering UI
5. ⏳ Add category and tag archive pages
6. ⏳ Integrate with existing news pages if needed

## Notes

- Posts endpoint requires authentication (unlike public pages)
- Posts have richer taxonomy support (categories + tags)
- Custom meta fields may need special handling for RSS/feed features
- `class_list` can be used for conditional styling
- Featured media can be 0, so always check before using

