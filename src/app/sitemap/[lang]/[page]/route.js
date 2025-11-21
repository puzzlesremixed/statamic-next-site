import {notFound} from "next/navigation";
import {SITE_URL, DEFAULT_LOCALE} from "@/lib/constants";
import {
    getLocales,
    getCollectionTranslationsMap,
    getSitemapData
} from "@/lib/api";

export async function GET(req, {params}) {
    const {lang, page} = params;

    const locales = await getLocales();
    if (!locales.includes(lang)) notFound();

    const sitemapData = await getSitemapData(lang, page);
    if (page > sitemapData.meta.total_pages) notFound();

    const translations = await getCollectionTranslationsMap();

    const urls = [];

    if (page == 1) {
        const homeUrl = lang === DEFAULT_LOCALE ? SITE_URL : `${SITE_URL}/${lang}`;
        urls.push({
            loc: homeUrl,
            lastmod: new Date().toISOString(),
            priority: 1,
        });
    }

    for (const collection in sitemapData.collections) {
        for (const entry of sitemapData.collections[collection]) {
            if (!entry.seo?.sitemap?.include) continue;

            let path = "";

            if (entry.collection === "pages") {
                path = lang === DEFAULT_LOCALE
                    ? `/${entry.slug}`
                    : `/${lang}/${entry.slug}`;
            } else {
                const localizedSlug =
                    translations.canonicalToLocalized?.[lang]?.[collection] ||
                    collection;

                path = lang === DEFAULT_LOCALE
                    ? `/${localizedSlug}/${entry.slug}`
                    : `/${lang}/${localizedSlug}/${entry.slug}`;
            }

            urls.push({
                loc: `${SITE_URL}${path}`,
                lastmod: new Date(entry.updated_at).toISOString(),
                priority: entry.seo.sitemap.priority,
            });
        }
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
        .map(
            (u) => `
  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <priority>${u.priority}</priority>
  </url>`
        )
        .join("")}
</urlset>`;

    return new Response(xml, {
        headers: {"Content-Type": "text/xml"},
    });
}
