import {SITE_URL} from "@/lib/constants";
import {getSitemapByCollection} from "@/lib/api";

export async function GET(req, {params}) {
    const collection = params.collection;
    const urls = await getSitemapByCollection(collection);

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `
  <url>
    <loc>${SITE_URL}${u.url}</loc>
    <lastmod>${new Date(u.lastmod).toISOString()}</lastmod>
    <priority>${u.priority}</priority>
    <changefreq>${u.changefreq}</changefreq>
  </url>`
        )
        .join("")}
</urlset>`;
    
    return new Response(xml, {
        headers: {"Content-Type": "text/xml"},
    });
}