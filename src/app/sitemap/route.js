import {SITE_URL} from '@/lib/constants';
import {getLocales} from "@/lib/api";

export async function GET() {
    const locales = await getLocales();

    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${locales.map((locale) => `
    <sitemap>
      <loc>${SITE_URL}/sitemap_${locale}.xml</loc>
    </sitemap>
  `).join('')}
</sitemapindex>
`;

    return new Response(sitemapIndex, {
        headers: {'Content-Type': 'application/xml'},
    });
}