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

// get locales from sites
export async function getLocales() {
    const locales = await getAllSites()

    return locales.map(item => item.handle);
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
            // localized to canonical : the origin to the localized name 
            // ex. translationMap.localizedToCanonical["id"]["tentang-kami"] = "about-us"
            localizedToCanonical: {},
            // canonical to localized: the localized to the origin name 
            // translationMap.localizedToCanonical["id"]["tentang-kami"] = "about-us"
            canonicalToLocalized: {}
        };

        // Each route represents one collection
        globalData.collection_routes?.forEach(route => {
            // canonical handle is the original collection name
            const canonicalHandle = route.collection?.handle;

            route.localized_slugs?.forEach(loc => {
                // get the locale
                const locale = loc.locale?.handle;
                // get the slug
                const localizedSlug = loc.slug;
                if (!locale || !localizedSlug) return;

                // builds the first map: localized slug → canonical handle
                if (!translationMap.localizedToCanonical[locale]) {
                    translationMap.localizedToCanonical[locale] = {};
                }
                translationMap.localizedToCanonical[locale][localizedSlug] = canonicalHandle;

                // builds the second map: canonical handle → localized slug
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

// get all pages for sitemap
export async function getSitemapData() {
    try {

        const response = await apiClient.get('/sitemap-data');
        const collections = response.data?.collections ?? null;

        if (collections && Object.keys(collections).length > 0) {
            return response.data;
        }

        return null;
    } catch (error) {
        console.error('Failed to fetch sitemap data:', error);
        return null;
    }
}


/*
    Get entries
 */
export async function getCollectionEntries(collection, page = 1, search = '', site = "default", previewToken = null) {
    try {
        const params = {
            limit: 10,
            page: page || 1,
            "filter[site:is]": site,
        };
        if (search) {
            params['filter[title:contains]'] = encodeURIComponent(search);
        }

        if (previewToken) params.token = previewToken;
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
export async function getEntry(slugArray, locale, previewToken = null) {
    try {
        const translationMap = await getCollectionTranslationsMap();
        let collection = 'pages'; // default collection
        let entrySlug = slugArray.join('/') || 'home';
        let potentialCollectionSlug = slugArray[0];

        // the collection might have a localized slug so checks it against the map
        if (slugArray.length > 1 && translationMap.localizedToCanonical[locale]?.[potentialCollectionSlug]) {
            // get the actual collection name from the map
            collection = translationMap.localizedToCanonical[locale][potentialCollectionSlug];
            // slice off the collection
            entrySlug = slugArray.slice(1).join('/');

            // If the slug is not localized
        } else if (slugArray.length > 1) {
            collection = potentialCollectionSlug;
            entrySlug = slugArray.slice(1).join('/');
        }


        const collectionUrl = `/collections/${collection}/entries`;
        let params = {
            "filter[slug:is]": entrySlug,
            "filter[site:is]": locale,
        };
        if (previewToken) params.token = previewToken;
        let entryResponse = await apiClient.get(collectionUrl, {params});

        // If no entry was found, fallback to the pages collection
        if ((!entryResponse.data.data || entryResponse.data.data.length === 0) && collection !== 'pages') {
            params["filter[slug:is]"] = slugArray.join('/');
            const pagesUrl = `/collections/pages/entries`;
            entryResponse = await apiClient.get(pagesUrl, {params});
        }

        if (!entryResponse.data.data || entryResponse.data.data.length === 0) {
            notFound();
        }
        return entryResponse.data.data[0];
    } catch (error) {
        console.error(`Failed to fetch entry:`, error);
        return null;
    }
}

// Get entry alongside its translations
export async function getEntryTranslations(collection, entryId, originId, previewToken = null) {
    try {
        const translationOfId = originId || entryId;

        let params = {
            "filter[origin:is]": translationOfId,
        };
        if (previewToken) params.token = previewToken;

        // Fetch translation
        const translationsUrl = `/collections/${collection}/entries`;
        const translationsResponse = await apiClient.get(translationsUrl, {params});
        const translations = translationsResponse.data.data || [];

        // Fetch the origin entry itself since the filter above doesn't include it
        const originUrl = `/collections/${collection}/entries/${translationOfId}`;
        delete params["filter[origin:is]"];
        const originResponse = await apiClient.get(originUrl, {params});
        const originEntry = originResponse.data.data;

        // combine
        const allEntries = [...translations];
        if (originEntry && !allEntries.some(e => e.id === originEntry.id)) {
            allEntries.push(originEntry);
        }

        return allEntries;
    } catch (error) {
        console.error(`Failed to fetch entries :`, error);
        return null;
    }
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

/* Get globals */

export async function getAllGlobals( locale, previewToken = null) {
    try {

        const globalUrl = `/globals`;
        let params = {
            "site": locale,
        };
        if (previewToken) params.token = previewToken;
        let entryResponse = await apiClient.get(globalUrl, {params});

        if (!entryResponse.data.data || entryResponse.data.data.length === 0) {
            notFound();
        }
        return entryResponse.data.data;
    } catch (error) {
        console.error(`Failed to fetch globals:`, error);
        return null;
    }
}

export async function getGlobal(handle, locale, previewToken = null) {
    try {

        const globalUrl = `/globals/${handle}`;
        let params = {
            "site": locale,
        };
        if (previewToken) params.token = previewToken;
        let entryResponse = await apiClient.get(globalUrl, {params});

        if (!entryResponse.data.data || entryResponse.data.data.length === 0) {
            notFound();
        }

        return entryResponse.data.data;
    } catch (error) {
        console.error(`Failed to fetch global:`, error);
        return null;
    }
}