import {SITE_URL} from "@/lib/constants";
import {getLocales, getSitemapData} from "@/lib/api";
import {notFound} from "next/navigation";

export async function GET(req, {params}) {
    const lang = params.lang;

    const locales = await getLocales();
    if (!locales.includes(lang)) return notFound();

    const data = await getSitemapData(lang);
    const totalPages = data.meta.last_page;
console.log("total apges" , totalPages);
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${Array.from({length: totalPages}, (_, i) => {
        const page = i + 1;
        return `
  <sitemap>
    <loc>${SITE_URL}/sitemap_${lang}-${page}.xml</loc>
  </sitemap>`;
    }).join("")}
</sitemapindex>`;

    return new Response(xml, {
        headers: {"Content-Type": "text/xml"},
    });
}
