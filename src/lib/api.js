import axios from 'axios';

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_STATAMIC_API_URL,
});

apiClient.interceptors.request.use(config => {
    const fullUrl = `${config.baseURL?.replace(/\/$/, '')}${config.url}`;
    console.log('Axios Request:', fullUrl, config.params || '');
    return config;
});
apiClient.interceptors.response.use(function onFulfilled(response) {
    console.log(response.data);
    return response;
}, function onRejected(error) {
    return Promise.reject(error);
});

export async function getCollectionEntries(collection, page = 1, search = '') {
    try {
        let queryString = `?limit=10&page=${page}`;
        if (search) {
            queryString += `&filter[title:contains]=${encodeURIComponent(search)}`;
        }

        const response = await apiClient.get(`/collections/${collection.trim()}/entries${queryString}`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch entries:', error);
        return {data: [], meta: {current_page: 1, last_page: 1}};
    }
}

export async function getEntryBySlug({collection, slug} = {}) {
    try {
        const response = await apiClient.get(
            `/collections/${collection.trim()}/entries`, {
                params: {
                    'filter[slug:contains]': encodeURIComponent(slug),
                }
            }
        );
        const entries = response.data.data;
        if (entries.length) {
            return entries[0];
        }
    } catch (error) {
        console.error(`Failed to fetch entry on collection ${collection.trim()}:`, error);
        return {data: [], meta: {current_page: 1, last_page: 1}};
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

