import axios from 'axios';

const apiClient = axios.create({
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

export async function getCollectionEntries(collection, page = 1, search = '') {
    try {
        const params = {
            limit: 10,
            page: page || 1,
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

export async function getEntryBySlug({collection, slug: slugQry, token = '', preview = false} = {}) {
    try {
        const params = {
            'filter[slug:contains]': encodeURIComponent(slugQry),
            sort: 'order',
        };

        const headers = {};

        if (token && preview) {
            params.token = token;
        }

        const response = await apiClient.get(`/collections/${collection.trim()}/entries`, {params, headers});
        const entries = response.data.data;
        if (entries.length) {
            const entry = entries.find(({slug}) => slug === slugQry);
            if (entry) {
                return entry;
            } else {
                console.log("entries", entries)
                console.log("slug", slugQry)
            }
        }
        return null;
    } catch (error) {
        console.error(`Failed to fetch entry on collection ${collection.trim()}:`, error);
        return null;
    }
}

export async function getEntryByID({collection, id} = {}) {
    try {
        const response = await apiClient.get(`/collections/${collection.trim()}/entries/${id}`);
        return response.data.data;
    } catch (error) {
        console.error(`Failed to fetch entry on collection ${collection.trim()} by id: ${id}`, error);
        return null;
    }
}

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
