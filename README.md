# WP Next Headless - Market Headlines

A modern headless WordPress implementation using Next.js 16, React 19, and Tailwind CSS v4.

## Features

- ✅ **Headless WordPress Integration** - Fetch content from WordPress REST API
- ✅ **Next.js 16 App Router** - Modern routing with server components
- ✅ **TypeScript** - Full type safety for WordPress API responses
- ✅ **Incremental Static Regeneration (ISR)** - Fast page loads with automatic revalidation
- ✅ **SEO Optimized** - Dynamic metadata generation for each page
- ✅ **Responsive Design** - Mobile-first design with Tailwind CSS v4
- ✅ **Image Optimization** - Next.js Image component with remote patterns
- ✅ **Dark Mode Support** - Built-in dark mode theming

## Project Structure

```
wp-next-headless/
├── app/
│   ├── news/
│   │   ├── [slug]/
│   │   │   ├── page.tsx          # Individual news article page
│   │   │   └── not-found.tsx     # 404 page for articles
│   │   └── page.tsx               # News listing page
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Home page
│   └── globals.css                # Global styles with Tailwind
├── lib/
│   └── wordpress/
│       └── api.ts                 # WordPress API client utilities
├── types/
│   └── wordpress.ts               # TypeScript types for WordPress data
├── .env.local                     # Environment variables (not committed)
├── .env.example                   # Example environment variables
└── next.config.ts                 # Next.js configuration
```

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local` and update with your WordPress credentials:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_WP_API_URL=https://your-wordpress-site.com/wp-json/wp/v2
WP_USERNAME=your-username
WP_PASSWORD=your-application-password
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

## WordPress Setup

### Creating Application Password

1. Log in to your WordPress admin dashboard
2. Go to Users → Profile
3. Scroll down to "Application Passwords"
4. Enter a name (e.g., "Next.js Headless")
5. Click "Add New Application Password"
6. Copy the generated password and use it in `.env.local`

## API Routes

### Available WordPress Endpoints

- **GET /news** - List all news articles
- **GET /news/[slug]** - Individual article by slug

### WordPress API Functions

Located in `lib/wordpress/api.ts`:

- `getPages(perPage, page)` - Fetch paginated pages
- `getPagesWithDetails()` - Fetch pages with embedded author and media
- `getPageBySlug(slug)` - Fetch single page by slug
- `getAllPageSlugs()` - Get all slugs for static generation
- `getMediaById(id)` - Fetch media by ID
- `getUserById(id)` - Fetch user/author by ID

## Key Features

### Incremental Static Regeneration (ISR)

Pages are statically generated at build time and automatically revalidated every 60 seconds:

```typescript
export const revalidate = 60;
```

### TypeScript Types

Full type safety for WordPress API responses with interfaces in `types/wordpress.ts`:

- `WordPressPage` - Complete WordPress page response
- `WordPressMedia` - Media/image data
- `WordPressUser` - Author information
- `Page` - Simplified page type for frontend
- `PageWithDetails` - Page with embedded author and media

### Image Optimization

Next.js Image component configured for WordPress media:

```typescript
// next.config.ts
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'dev-new-marketsheadlines.pantheonsite.io',
      pathname: '/wp-content/**',
    },
  ],
}
```

## Customization

### Styling

All styles use Tailwind CSS v4. Customize colors and theme in `app/globals.css`:

```css
@layer base {
  :root {
    --background: #ffffff;
    --foreground: #171717;
  }
}
```

### API Configuration

Update WordPress API settings in `lib/wordpress/api.ts`:

- Change revalidation intervals
- Add custom endpoints
- Modify data transformations

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

Ensure environment variables are set:
- `NEXT_PUBLIC_WP_API_URL`
- `WP_USERNAME`
- `WP_PASSWORD`

## Technologies

- **Next.js 16** - React framework with App Router
- **React 19** - Latest React version
- **TypeScript 5** - Type safety
- **Tailwind CSS v4** - Utility-first CSS
- **WordPress REST API** - Headless CMS

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [WordPress REST API Handbook](https://developer.wordpress.org/rest-api/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## License

MIT