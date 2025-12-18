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
        // console.log('[localApi] getEvents -> calling', url);
        const res = await api.get(url);
        // console.log('[localApi] getEvents -> response status', res?.status);
        const data = res?.data;
        return data || { content: [], totalPages: 0, number: 0 };
    } catch (e) {
        // console.error('getEvents error', e);
        return { content: [], totalPages: 0, number: 0 };
    }
}

export async function getStatistics() {
    try {
        const res = await api.get('/statistics');
        const data = res?.data;
        return data || { totalEvents: 0, totalVolunteers: 0, totalPosts: 0 };
    } catch (e) {
        // console.error('getStatistics error', e);
        return { totalEvents: 0, totalVolunteers: 0, totalPosts: 0 };
    }
}

export async function getRecentActivityEvents(page = 0, size = 9) {
    try {
        const res = await api.get('/events/recent-activity', {
            params: { page, size }
        });
        return res?.data || { content: [], totalPages: 0, number: 0 };
    } catch (e) {
        console.error('getRecentActivityEvents error', e);
        return { content: [], totalPages: 0, number: 0 };
    }
}

export async function getFeaturedEvents(page = 0, size = 9) {
    try {
        const res = await api.get('/events/featured', {
            params: { page, size }
        });
        return res?.data || { content: [], totalPages: 0, number: 0 };
    } catch (e) {
        console.error('getFeaturedEvents error', e);
        return { content: [], totalPages: 0, number: 0 };
    }
}