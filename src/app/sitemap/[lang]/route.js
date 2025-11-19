import {notFound} from 'next/navigation';
import {SITE_URL, DEFAULT_LOCALE} from '@/lib/constants';
import {getCollectionTranslationsMap, getLocales, getSitemapData} from "@/lib/api";

export async function GET(request, {params}) {
    const {lang} = params;

    const supportedLocales = await getLocales();
    if (!supportedLocales.includes(lang)) {
        notFound();
    }

    const sitemapData = await getSitemapData();
    const translations = await getCollectionTranslationsMap();

    const urls = [];

    const homeUrl = lang === DEFAULT_LOCALE ? SITE_URL : `${SITE_URL}/${lang}`;
    urls.push({
        url: homeUrl,
        lastModified: new Date(),
        priority: 1,
    });

    for (const collection in sitemapData.collections) {
        const entries = sitemapData.collections[collection].filter(entry => entry.locale === lang);
        for (const entry of entries) {
            if (entry.seo?.sitemap?.include) {
                let path = '';
                if (entry.collection === 'pages') {
                    path = lang === DEFAULT_LOCALE ? `/${entry.slug}` : `/${lang}/${entry.slug}`;
                } else {
                    const collectionSlug = translations.canonicalToLocalized[lang]?.[collection] || collection;
                    path = lang === DEFAULT_LOCALE ? `/${collectionSlug}/${entry.slug}` : `/${lang}/${collectionSlug}/${entry.slug}`;
                }

                urls.push({
                    url: `${SITE_URL}${path}`,
                    lastModified: new Date(entry.updated_at),
                    priority: entry.seo.sitemap.priority,
                });
            }
        }
    }

    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.map((url) => `
    <url>
      <loc>${url.url}</loc>
      <lastmod>${url.lastModified.toISOString()}</lastmod>
      <priority>${url.priority}</priority>
    </url>
  `).join('')}
</urlset>`;

    return new Response(sitemapContent, {
        headers: {'Content-Type': 'application/xml'},
    });
}