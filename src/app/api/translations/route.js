import {NextResponse} from 'next/server';
import {getEntry, getEntryTranslations, getAllSites} from '@/lib/api';

export async function POST(request) {
    try {
        const { pathname, currentLocale } = await request.json();
        const DEFAULT_LOCALE = process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'en';

        if (!currentLocale) {
            return NextResponse.json({error: 'Current locale not provided'}, {status: 400});
        }

        const sites = await getAllSites();
        const supportedLocales = sites.map(s => s.short_locale);

        if (!supportedLocales.includes(currentLocale)) {
            return NextResponse.json({error: 'Invalid locale'}, {status: 400});
        }

        const parts = pathname.split('/').filter(Boolean);
        let slugArray = parts;

        // If the pathname starts with a locale, slice it off to get the pure slug.
        if (supportedLocales.includes(parts[0])) {
            slugArray = parts.slice(1);
        }

        const currentEntry = await getEntry(slugArray, currentLocale);
        if (!currentEntry) {
            const translationUrls = {};
            sites.forEach(site => {
                translationUrls[site.short_locale] = site.short_locale === DEFAULT_LOCALE ? '/' : `/${site.short_locale}`;
            });
            return NextResponse.json(translationUrls);
        }

        const collection = currentEntry.collection.handle;
        const allTranslations = await getEntryTranslations(collection, currentEntry.id, currentEntry.origin_id);

        const translationUrls = {};
        allTranslations.forEach(entry => {
            const site = sites.find(s => s.handle === entry.locale);
            if (site) {
                const isDefault = site.short_locale === DEFAULT_LOCALE;
                translationUrls[site.short_locale] = isDefault ? entry.uri : `/${site.short_locale}${entry.uri}`;
            }
        });

        return NextResponse.json(translationUrls);

    } catch (error) {
        if (error.message?.includes("NEXT_NOT_FOUND")) {
            // Fallback : root URLs for all locales
            const sites = await getAllSites();
            const DEFAULT_LOCALE = process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'en';
            const translationUrls = {};
            sites.forEach(site => {
                translationUrls[site.short_locale] = site.short_locale === DEFAULT_LOCALE ? '/' : `/${site.short_locale}`;
            });
            return NextResponse.json(translationUrls);
        }
        console.error('Translation API Error:', error);
        return NextResponse.json({error: 'Internal Server Error'}, {status: 500});
    }
}