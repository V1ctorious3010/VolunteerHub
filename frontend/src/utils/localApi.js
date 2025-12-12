// Helpers to work with public JSON files in /public/api and localStorage overrides
const POSTS_KEY = 'vh_local_posts';
const FEED_KEY = 'vh_feed_posts';
const REQUESTS_KEY = 'vh_local_requests';
const USERS_KEY = 'vh_local_users';

const readJSON = (key, fallback = []) => {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch {
        return fallback;
    }
};

const writeJSON = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch { }
};

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
        const data = res?.data || [];
        return Array.isArray(data) ? data : [];
    } catch (e) {
        console.error('getEvents error', e);
        return [];
    }
}

export function addLocalPost(post) {
    const local = readJSON(POSTS_KEY, []);
    local.push(post);
    writeJSON(POSTS_KEY, local);
    return post;
}

// Feed-specific helpers (separate storage for Feed posts)
export async function getFeedPosts() {
    // Previously loaded from static /api/feed.json — now rely on local overrides only
    return readJSON(FEED_KEY, []);
}

export function addLocalFeedPost(post) {
    const local = readJSON(FEED_KEY, []);
    local.push(post);
    writeJSON(FEED_KEY, local);
    return post;
}

export function updateLocalFeedPost(id, updated) {
    const local = readJSON(FEED_KEY, []);
    const idx = local.findIndex(p => String(p.id) === String(id));
    if (idx >= 0) {
        local[idx] = { ...local[idx], ...updated };
        writeJSON(FEED_KEY, local);
        return local[idx];
    }
    const newPost = { id, ...updated };
    local.push(newPost);
    writeJSON(FEED_KEY, local);
    return newPost;
}

export function deleteLocalFeedPost(id) {
    const local = readJSON(FEED_KEY, []);
    const remaining = local.filter(p => String(p.id) !== String(id));
    writeJSON(FEED_KEY, remaining);
    return true;
}

export function updateLocalPost(id, updated) {
    const local = readJSON(POSTS_KEY, []);
    const idx = local.findIndex(p => String(p.id) === String(id));
    if (idx >= 0) {
        local[idx] = { ...local[idx], ...updated };
        writeJSON(POSTS_KEY, local);
        return local[idx];
    }
    // If not in local, write updated copy into local to shadow base
    const newPost = { id, ...updated };
    local.push(newPost);
    writeJSON(POSTS_KEY, local);
    return newPost;
}

export function deleteLocalPost(id) {
    const local = readJSON(POSTS_KEY, []);
    const remaining = local.filter(p => String(p.id) !== String(id));
    writeJSON(POSTS_KEY, remaining);
    return true;
}

export async function getRequests() {
    // No static requests JSON anymore — return local requests only
    return readJSON(REQUESTS_KEY, []);
}

export function addLocalRequest(req) {
    const local = readJSON(REQUESTS_KEY, []);
    local.push(req);
    writeJSON(REQUESTS_KEY, local);
    return req;
}

export function deleteLocalRequest(id) {
    const local = readJSON(REQUESTS_KEY, []);
    const remaining = local.filter(r => String(r.id) !== String(id));
    writeJSON(REQUESTS_KEY, remaining);
    return true;
}

export async function getUsers() {
    // Try backend first, fallback to localStorage
    try {
        const res = await api.get('/user/users');
        return res?.data || [];
    } catch (e) {
        // ignore
    }
    return readJSON(USERS_KEY, []);
}

export function addLocalUser(u) {
    const local = readJSON(USERS_KEY, []);
    local.push(u);
    writeJSON(USERS_KEY, local);
    return u;
}
