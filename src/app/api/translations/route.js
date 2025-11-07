import {NextResponse} from 'next/server';
import {getEntry, getEntryTranslations, getAllSites} from '@/lib/api';

export async function POST(request) {
    try {
        const {pathname} = await request.json();

        const sites = await getAllSites();
        const locales = sites.map(s => s.short_locale);

        const parts = pathname.split('/').filter(Boolean);
        const locale = parts[0];
        const slugArray = parts.slice(1);

        if (!locales.includes(locale)) {
            return NextResponse.json({error: 'Invalid locale'}, {status: 400});
        }

        const currentEntry = await getEntry(slugArray, locale);
        if (!currentEntry) {
            return NextResponse.json({error: 'Entry not found'}, {status: 404});
        }

        // Find all available translations for that entry
        const collection = currentEntry.collection.handle; 
        const allTranslations = await getEntryTranslations(collection, currentEntry.id, currentEntry.origin_id);

        // Build a simple map of { locale: url }
        const translationUrls = {};
        allTranslations.forEach(entry => {
            const site = sites.find(s => s.handle === entry.locale);
            if (site) {
                translationUrls[site.short_locale] = `/${site.short_locale}${entry.uri}`;
            }
        });

        return NextResponse.json(translationUrls);
        

    } catch (error) {
        if (error.message?.includes("NEXT_NOT_FOUND")) {
            return NextResponse.json({error: 'Entry not found'}, {status: 404});
        }
        console.error('Translation API Error:', error);
        return NextResponse.json({error: 'Internal Server Error'}, {status: 500});
    }
}