import {NextResponse} from 'next/server';
import {getEntry, getEntryTranslations, getAllSites, getCollectionTranslationsMap} from '@/lib/api';

export async function POST(request) {
    try {
        const {pathname, currentLocale} = await request.json();
        const DEFAULT_LOCALE = process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'en';

        if (!currentLocale) {
            return NextResponse.json({error: 'Current locale not provided'}, {status: 400});
        }

        // Loading site data and translation maps
        const [sites, translationMap] = await Promise.all([
            getAllSites(),
            getCollectionTranslationsMap()
        ]);

        const supportedLocales = sites.map(s => s.short_locale);

        // If the locale from the request isn’t in the supported site list
        if (!supportedLocales.includes(currentLocale)) {
            return NextResponse.json({error: 'Invalid locale'}, {status: 400});
        }

        // Split ths slug into arrays
        const parts = pathname.split('/').filter(Boolean);
        let slugArray = parts;

        // If pathname starts with a supported locale, slice it off to get the pure slug
        if (supportedLocales.includes(parts[0])) {
            slugArray = parts.slice(1);
        }

        const currentEntry = await getEntry(slugArray, currentLocale);

        if (!currentEntry) {
            return NextResponse.json({error: 'Entry not found'}, {status: 404});
        }

        const collection = currentEntry.collection.handle;
        const allTranslations = await getEntryTranslations(collection, currentEntry.id, currentEntry.origin_id);

        const translationUrls = {};
        // Build the proper URL for each translation
        allTranslations.forEach(entry => {
            const site = sites.find(s => s.handle === entry.locale);
            if (site) {
                // Find current entry to gets its locale
                const entryLocale = site.short_locale;
                const isDefaultLocale = entryLocale === DEFAULT_LOCALE;

                // Figure out the correct collection name for this locale
                // If the collection doesn’t need translation, it falls back to the same name
                const localizedCollection = translationMap.canonicalToLocalized[entryLocale]?.[collection] || collection;

                const translatedEntrySlug = entry.slug;
                let newPath = `/${localizedCollection}/${translatedEntrySlug}`;

                // If the collection is "pages" (top level entry that doenst have a prefix)
                if (collection === 'pages') {
                    // dont add any prefix
                    newPath = `/${entry.slug}`;
                } else {
                    // add the new localized collection name
                    const localizedCollection = translationMap.canonicalToLocalized[entryLocale]?.[collection] || collection;
                    newPath = `/${localizedCollection}/${entry.slug}`;
                }

                // Add locale prefix for non-default languages
                if (!isDefaultLocale) {
                    newPath = `/${entryLocale}${newPath}`;
                }
                // special case for the homepage
                if (isDefaultLocale && newPath === '/home') {
                    newPath = '/';
                }

                translationUrls[entryLocale] = newPath;
            }
        });

        return NextResponse.json(translationUrls);

    } catch (error) {
        // Returns fallback URLs pointing to each site’s homepage
        if (error.message?.includes("NEXT_NOT_FOUND")) {
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