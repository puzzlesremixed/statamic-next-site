import {SITE_URL} from '@/lib/constants';
import {getSitemapCollections} from "@/lib/api";

export async function GET() {
    const collection = await getSitemapCollections();

    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${collection.map((collection) => `
    <sitemap>
      <loc>${SITE_URL}/sitemap-${collection}.xml</loc>
    </sitemap>
  `).join('')}
</sitemapindex>
`;

    return new Response(sitemapIndex, {
        headers: {'Content-Type': 'application/xml'},
    });
}