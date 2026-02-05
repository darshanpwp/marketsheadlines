import { getAllPostSlugs, getAllPageSlugs, getAllCategories } from '@/lib/wordpress/api';
import { SITE_URL } from '@/lib/constants';
import { MetadataRoute } from 'next';

export const revalidate = 3600; // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const [postSlugs, pageSlugs, categories] = await Promise.all([
        getAllPostSlugs(),
        getAllPageSlugs(),
        getAllCategories(),
    ]);

    // Base URLs
    const routes: MetadataRoute.Sitemap = [
        {
            url: `${SITE_URL}`,
            lastModified: new Date(),
            changeFrequency: 'always',
            priority: 1,
        },
        {
            url: `${SITE_URL}/about-us`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
    ];

    // Dynamic Posts
    const postRoutes: MetadataRoute.Sitemap = postSlugs.map((slug) => ({
        url: `${SITE_URL}/posts/${slug}`,
        lastModified: new Date(), // Ideally this would come from the post modified date
        changeFrequency: 'weekly',
        priority: 0.8,
    }));

    // Dynamic Pages (excluding about-us if it's already handled or handled via page slugs)
    const pageRoutes: MetadataRoute.Sitemap = pageSlugs
        .filter(slug => slug !== 'about-us' && slug !== 'home') // Filter out handled routes
        .map((slug) => ({
            url: `${SITE_URL}/${slug}`, // Assuming pages are at root
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        }));

    // Dynamic Categories
    const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
        url: `${SITE_URL}/category/${cat.slug}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.7,
    }));


    return [...routes, ...postRoutes, ...pageRoutes, ...categoryRoutes];
}
