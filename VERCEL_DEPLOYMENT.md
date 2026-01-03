# Deploying to Vercel

This guide will help you deploy your Next.js WordPress headless application to Vercel.

## Prerequisites

- A Vercel account (sign up at [vercel.com](https://vercel.com))
- Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)
- WordPress site with REST API enabled
- WordPress application password or credentials

## Step 1: Import Your Project

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Project"
3. Select your Git provider (GitHub, GitLab, or Bitbucket)
4. Choose your repository: `wp-next-headless`
5. Click "Import"

## Step 2: Configure Environment Variables

Before deploying, you MUST add your WordPress credentials as environment variables in Vercel:

### Required Environment Variables

Add these in the Vercel dashboard under **Settings → Environment Variables**:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `NEXT_PUBLIC_WP_API_URL` | `https://dev-new-marketsheadlines.pantheonsite.io/wp-json/wp/v2` | Production, Preview, Development |
| `WP_USERNAME` | `news-release` | Production, Preview, Development |
| `WP_PASSWORD` | `SRC-DisclosureTS-13_820` | Production, Preview, Development |

### How to Add Environment Variables in Vercel:

1. In your Vercel project dashboard, click **Settings**
2. Click **Environment Variables** in the left sidebar
3. For each variable:
   - Enter the **Key** (variable name)
   - Enter the **Value** (your WordPress credential)
   - Select which environments to use it in (check all: Production, Preview, Development)
   - Click **Save**

**Important Notes:**
- `NEXT_PUBLIC_WP_API_URL` - Must start with `NEXT_PUBLIC_` to be available in the browser
- `WP_USERNAME` and `WP_PASSWORD` - Server-side only, not exposed to the browser

## Step 3: Deploy

1. After adding environment variables, click **Deploy** or **Redeploy**
2. Vercel will:
   - Install dependencies
   - Build your Next.js application
   - Deploy to a production URL

## Step 4: Verify Deployment

Once deployed, visit your Vercel URL (e.g., `your-project.vercel.app`) and check:

1. **Homepage** (`/`) - Should show latest headlines
2. **News Page** (`/news`) - Should list all articles
3. **Individual Articles** (`/news/[slug]`) - Should display full article content

## Common Deployment Issues

### Error: "WordPress credentials not configured"

**Cause:** Environment variables are not set in Vercel.

**Solution:**
1. Go to Vercel project → Settings → Environment Variables
2. Add all three required variables (see Step 2)
3. Redeploy your application

### Error: "WordPress API error: 401"

**Cause:** Invalid WordPress credentials.

**Solution:**
1. Verify your WordPress application password is correct
2. Update `WP_USERNAME` and `WP_PASSWORD` in Vercel
3. Redeploy

### Error: "Invalid src prop on next/image"

**Cause:** Image hostname not configured in `next.config.ts`.

**Solution:**
- Already fixed in the codebase
- Ensure you're deploying the latest code with proper image configuration

### Build succeeds but pages show no content

**Cause:** WordPress API is not accessible during build time.

**Solution:**
1. Check if your WordPress site is publicly accessible
2. Verify API endpoint: `https://your-site.com/wp-json/wp/v2/pages`
3. Ensure Pantheon sandbox allows external requests

## Step 5: Custom Domain (Optional)

To add a custom domain:

1. In Vercel project, go to **Settings → Domains**
2. Click **Add Domain**
3. Enter your domain name
4. Follow DNS configuration instructions
5. Wait for DNS propagation (can take up to 48 hours)

## Performance Optimization

### Incremental Static Regeneration (ISR)

Your app is already configured with ISR:
- Pages revalidate every 60 seconds
- Fast initial page loads with automatic updates

### Edge Caching

Vercel automatically caches your pages at the edge for optimal performance worldwide.

## Monitoring

### View Deployment Logs

1. Go to your Vercel project
2. Click on a deployment
3. View build logs and runtime logs

### Analytics (Optional)

Enable Vercel Analytics:
1. Go to **Analytics** tab in your project
2. Enable Analytics
3. View real-time visitor data

## Environment-Specific Configurations

### Preview Deployments

Every Git branch gets its own preview URL:
- Automatic for pull requests
- Great for testing before production
- Uses same environment variables

### Development

To test locally with Vercel environment:

```bash
# Install Vercel CLI
npm i -g vercel

# Pull environment variables
vercel env pull .env.local

# Run development server
npm run dev
```

## Security Best Practices

1. **Never commit `.env.local`** - Already in `.gitignore`
2. **Use Vercel's environment variables** - Encrypted at rest
3. **Rotate credentials regularly** - Update WordPress application passwords
4. **Enable HTTPS only** - Vercel provides automatic SSL

## Automatic Deployments

Vercel automatically deploys when you:
- Push to `main` branch (production)
- Push to any branch (preview deployment)
- Merge pull requests

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [WordPress REST API Handbook](https://developer.wordpress.org/rest-api/)

## Troubleshooting Commands

```bash
# Local build test (same as Vercel)
npm run build

# Check build output
npm run start

# View environment variables (locally)
cat .env.local

# Test WordPress API connection
curl -u username:password https://your-site.com/wp-json/wp/v2/pages
```