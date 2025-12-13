/**
 * Use backend events API instead of local JSON posts.
 * Example endpoint: http://localhost:5000/events?keyword=&location=&start=&page=0&sortBy=
 */
import api from './apiClient';

export async function getEvents({ keyword = '', location = '', start = '', page = 0, sortBy = '' } = {}) {
    try {
        const qs = new URLSearchParams({
            keyword: keyword || '',
            location: location || '',
            start: start || '',
            page: String(page || 0),
            sortBy: sortBy || ''
        });
        const url = `/events?${qs.toString()}`;
        console.log('[localApi] getEvents -> calling', url);
        const res = await api.get(url);
        console.log('[localApi] getEvents -> response status', res?.status);
        // return full paged response if available so callers can use content/totalPages
        const data = res?.data;
        return data || { content: [], totalPages: 0, number: 0 };
    } catch (e) {
        console.error('getEvents error', e);
        return { content: [], totalPages: 0, number: 0 };
    }
}