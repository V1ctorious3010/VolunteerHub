import api from './apiClient';

export async function getEvents({ keyword = '', category = '', start = '', page = 0, sortBy = '' } = {}) {
    try {
        const qs = new URLSearchParams({
            keyword: keyword || '',
            category: category || '',
            start: start || '',
            page: String(page || 0),
            sortBy: sortBy || ''
        });
        const url = `/events?${qs.toString()}`;
        console.log('[localApi] getEvents -> calling', url);
        const res = await api.get(url);
        console.log('[localApi] getEvents -> response status', res?.status);
        const data = res?.data;
        return data || { content: [], totalPages: 0, number: 0 };
    } catch (e) {
        console.error('getEvents error', e);
        return { content: [], totalPages: 0, number: 0 };
    }
}