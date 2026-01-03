# Custom Post Type (CPT) Endpoint Analysis

## Endpoint Pattern
```
https://dev-new-marketsheadlines.pantheonsite.io/wp-json/wp/v2/{cpt-slug}
```

## Discovered CPTs

### Available Custom Post Types
1. **popupbuilder** - REST Base: `popupbuilder`
   - Used for popup builder content
   - Example: "Global Markets Live"

### Standard Post Types (for reference)
- `posts` - Standard blog posts
- `pages` - Static pages
- `media` - Media attachments
- `menu-items` - Navigation menu items
- `blocks` - WordPress blocks/patterns
- `templates` - Page templates
- `template-parts` - Template parts
- `global-styles` - Global styles
- `navigation` - Navigation menus
- `font-families` - Font families
- `font-faces` - Font faces

## CPT Structure Analysis

Based on the `popupbuilder` CPT analysis:

### Core Fields
- `id` (number) - Item ID
- `date` (string) - Publication date (ISO 8601)
- `date_gmt` (string) - Publication date GMT
- `guid` (object) - Global unique identifier
- `modified` (string) - Last modified date
- `modified_gmt` (string) - Last modified date GMT
- `slug` (string) - URL-friendly slug
- `status` (string) - Status (publish, draft, etc.)
- `type` (string) - Post type (e.g., "popupbuilder")
- `link` (string) - Full URL to the item
- `title` (object) - Title with `rendered` property
- `content` (object) - Content with `rendered` and `protected` properties
- `template` (string) - Template name
- `class_list` (array) - CSS classes
- `_links` (object) - HATEOAS links

### Optional Fields (may vary by CPT)
- `excerpt` (object) - Excerpt with `rendered` and `protected` properties
- `author` (number) - Author user ID
- `featured_media` (number) - Featured image media ID
- `_embedded` (object) - Embedded resources (when `_embed` parameter is used)

### Differences from Standard Posts
- **No categories/tags** - Most CPTs don't have taxonomies
- **No excerpt** - Some CPTs don't have excerpts
- **No author** - Some CPTs don't have authors
- **No featured media** - Some CPTs don't have featured images
- **Custom fields** - CPTs may have custom fields specific to their purpose

## Implementation

### TypeScript Types Created
- `WordPressCPT` - Full WordPress CPT structure
- `CPT` - Simplified CPT type
- `CPTWithDetails` - CPT with embedded data

### API Functions Created
- `getCPTItems(cptSlug, perPage?, page?)` - Fetch paginated CPT items
- `getCPTItemsWithDetails(cptSlug)` - Fetch with embedded data
- `getCPTItemBySlug(cptSlug, slug)` - Fetch single item by slug
- `getAllCPTItemSlugs(cptSlug)` - Get all slugs for SSG

## Usage Examples

### Fetch All Popup Builder Items
```typescript
import { getCPTItemsWithDetails } from '@/lib/wordpress/api';

const popups = await getCPTItemsWithDetails('popupbuilder');
```

### Fetch Single Item
```typescript
import { getCPTItemBySlug } from '@/lib/wordpress/api';

const popup = await getCPTItemBySlug('popupbuilder', 'global-markets-live');
```

### Generic Usage (Any CPT)
```typescript
// Works with any CPT slug
const items = await getCPTItemsWithDetails('your-cpt-slug');
```

## Sample Data Structure

```json
{
  "id": 3059994,
  "date": "2023-05-24T09:36:08",
  "date_gmt": "2023-05-24T14:36:08",
  "slug": "global-markets-live",
  "status": "publish",
  "type": "popupbuilder",
  "link": "https://...",
  "title": {
    "rendered": "Global Markets Live"
  },
  "content": {
    "rendered": "<h1>...</h1>",
    "protected": false
  },
  "template": "",
  "class_list": [
    "post-3059994",
    "popupbuilder",
    "type-popupbuilder",
    "status-publish",
    "hentry"
  ]
}
```

## Custom Fields Support

The implementation automatically extracts custom fields that aren't part of the standard WordPress structure. These are stored in the `customFields` property of the `CPT` type.

## Next Steps

1. ✅ Types and API functions are ready
2. ⏳ Create CPT listing pages (e.g., `/popupbuilder/page.tsx`)
3. ⏳ Create CPT detail pages (e.g., `/popupbuilder/[slug]/page.tsx`)
4. ⏳ Add CPT-specific components if needed
5. ⏳ Handle custom fields in UI if required

## Notes

- CPT endpoints require authentication (same as posts)
- Not all CPTs support all features (excerpt, author, featured media, taxonomies)
- Custom fields are preserved in the `customFields` object
- The solution is generic and works with any CPT slug
- Use `getCPTItemsWithDetails()` to get embedded data (author, media, etc.) if the CPT supports it

