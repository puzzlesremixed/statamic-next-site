import axios from 'axios';
import {notFound} from "next/navigation";
import {unstable_cache} from 'next/cache';


export const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_STATAMIC_API_URL,
});

apiClient.interceptors.request.use(async config => {
    const fullUrl = `${config.baseURL?.replace(/\/$/, '')}${config.url}`;
    console.log('Axios Request:', fullUrl, config.params);
    return config;
});
apiClient.interceptors.response.use(function onFulfilled(response) {
    console.log(response);
    return response;
}, function onRejected(error) {
    return Promise.reject(error);
});

/* 
    Multi-site and localization 
*/

// Get all available sites.
export async function getAllSites() {
    try {
        const response = await apiClient.get(`/sites`);
        return response.data.data;
    } catch (error) {
        console.error('Failed to all sites :', error);
        return null;

    }
}

// Get a site information based on short_locale
export async function getSiteByLocale(locale) {
    try {
        const response = await apiClient.get(`/sites`);
        const sites = response.data.data;

        if (sites.length) {
            const site = sites.find(({short_locale}) => short_locale === `${locale.trim()}`);
            if (site) {
                return site;
            }
        }
    } catch (error) {
        console.error('Failed to all sites :', error);
        return null;

    }
}

// Get data for an entry on another locale based on its origin id.
export async function getTranslatedUrl({collection, originId, targetLocale}) {
    if (!originId) return null;

    try {
        const params = {
            'filter[origin:is]': originId,
            'filter[site:is]': targetLocale,
        };
        const response = await apiClient.get(`/collections/${collection}/entries`, {params});
        const entries = response.data.data;

        if (entries.length > 0) {
            return entries[0].url;
        }
        return null;
    } catch (error) {
        console.error('Failed to fetch translated entry:', error);
        return null;
    }
}

// Get entries for every site this entry is available on.
export async function getAvailableSites({collection, originId}) {
    try {
        const params = {
            'filter[origin:is]': originId,
        };
        const response = await apiClient.get(`/collections/${collection}/entries`, {params});
        const entries = response.data.data;

        if (entries.length > 0) {
            return entries;
        }
        return null;
    } catch (error) {
        console.error('Failed to fetch availble sites:', error);
        return null;
    }
}


// Get collection localization globals to map collection to its localized name. 
// Ex =  news (original) -> berita (localized)    
export const getCollectionTranslationsMap = unstable_cache(
    async () => {
        const response = await apiClient('/globals/route_localization');
        const globalData = response.data.data;

        const translationMap = {
            localizedToCanonical: {},
            canonicalToLocalized: {}
        };

        globalData.collection_routes?.forEach(route => {
            const canonicalHandle = route.collection?.handle;

            route.localized_slugs?.forEach(loc => {
                const locale = loc.locale?.handle;
                const localizedSlug = loc.slug;
                if (!locale || !localizedSlug) return; // Skip if row is incomplete

                if (!translationMap.localizedToCanonical[locale]) {
                    translationMap.localizedToCanonical[locale] = {};
                }
                translationMap.localizedToCanonical[locale][localizedSlug] = canonicalHandle;

                if (!translationMap.canonicalToLocalized[locale]) {
                    translationMap.canonicalToLocalized[locale] = {};
                }
                translationMap.canonicalToLocalized[locale][canonicalHandle] = localizedSlug;
            });
        });

        return translationMap;
    },
    ['collection_translations'],
    {
        revalidate: 60,
    }
);

/*
    Get entries
 */
export async function getCollectionEntries(collection, page = 1, search = '', site = "default") {
    try {
        const params = {
            limit: 10,
            page: page || 1,
            "filter[site:is]": site,
        };
        if (search) {
            params['filter[title:contains]'] = encodeURIComponent(search);
        }

        const response = await apiClient.get(`/collections/${collection.trim()}/entries`, {params});
        return response.data;
    } catch (error) {
        console.error('Failed to fetch entries:', error);
        return {data: [], meta: {current_page: 1, last_page: 1}};
    }
}


/*
    Get a collection entry 
*/

// Get entry using slugArray (automatically deduced collection and slug) 
export async function getEntry(slugArray, locale) {
    const translationMap = await getCollectionTranslationsMap();

    let collection = 'pages'; // default collection
    let entrySlug = slugArray.join('/') || 'home';
    let potentialCollectionSlug = slugArray[0];

    if (slugArray.length > 1 && translationMap.localizedToCanonical[locale]?.[potentialCollectionSlug]) {
        collection = translationMap.localizedToCanonical[locale][potentialCollectionSlug];
        entrySlug = slugArray.slice(1).join('/');
    } else if (slugArray.length > 1) {
        collection = potentialCollectionSlug;
        entrySlug = slugArray.slice(1).join('/');
    }

    const collectionUrl = `/collections/${collection}/entries?filter[slug:is]=${entrySlug}&filter[site:is]=${locale}`;
    let entryResponse = await apiClient(collectionUrl);

    if ((!entryResponse.data.data || entryResponse.data.data.length === 0) && collection !== 'pages') {
        const fullSlugForPages = slugArray.join('/');
        const pagesUrl = `/collections/pages/entries?filter[slug:is]=${fullSlugForPages}&filter[site:is]=${locale}`;
        entryResponse = await apiClient(pagesUrl);
    }

    if (!entryResponse.data.data || entryResponse.data.data.length === 0) {
        notFound();
    }
    console.log(entryResponse)
    return entryResponse.data.data[0];
}

// Get entry alongside its translations
export async function getEntryTranslations(collection, entryId, originId) {
    const translationOfId = originId || entryId;

    // Fetch translation
    const translationsUrl = `/collections/${collection}/entries?filter[origin:is]=${translationOfId}`;
    const translationsResponse = await apiClient(translationsUrl);
    const translations = translationsResponse.data.data || [];

    // Fetch the origin entry itself since the filter above doesn't include it
    const originUrl = `/collections/${collection}/entries/${translationOfId}`;
    const originResponse = await apiClient(originUrl);
    const originEntry = originResponse.data.data;

    const allEntries = [...translations];
    if (originEntry && !allEntries.some(e => e.id === originEntry.id)) {
        allEntries.push(originEntry);
    }

    return allEntries;
}

// old deprecated functions
// get entry by its slug
export async function getEntryBySlug({collection, slug, site = "default", token = "", preview = false} = {}) {
    try {
        const params = {
            "filter[slug:is]": slug,
            "filter[site:is]": site,
        };

        if (token && preview) params.token = token;

        const response = await apiClient.get(`/collections/${collection}/entries`, {params});
        const entries = response.data.data;
        return entries?.[0] || null;
    } catch (error) {
        console.error(`Failed to fetch entry:`, error);
        return null;
    }
}

// get entry by its id
export async function getEntryByID({collection, id, token = "", preview = false} = {}) {
    try {
        const params = {};
        if (token && preview) params.token = token;
        const response = await apiClient.get(`/collections/${collection.trim()}/entries/${id}`, {params});
        return response.data.data;
    } catch (error) {
        console.error(`Failed to fetch entry on collection ${collection.trim()} by id: ${id}`, error);
        return null;
    }
}

// get id by its uri ()
export async function getEntryByUri({collection, uri: uriQry} = {}) {
    try {
        const params = {
            'filter[uri]': `/${uriQry}`,
            sort: 'order',
        };

        const response = await apiClient.get(`/collections/${collection.trim()}/entries`, {params});

        const entries = response.data.data;
        if (entries.length) {
            const entry = entries.find(({uri}) => uri === `/${uriQry}`);
            if (entry) {
                return entry;
            }
        }
        return null;
    } catch (error) {
        console.error(`Failed to fetch entry by URI [${uriQry}] on collection [${collection.trim()}]:`, error);
        return null;
    }
}
