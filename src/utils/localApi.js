// Helpers to work with public JSON files in /public/api and localStorage overrides
const POSTS_KEY = 'vh_local_posts';
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

export async function getBasePosts() {
    const res = await fetch('/api/posts.json');
    return res.ok ? res.json() : [];
}

export async function getPosts() {
    const base = await getBasePosts();
    const local = readJSON(POSTS_KEY, []);
    // local posts override or extend base
    // ensure ids are unique; local posts may have ids generated via Date.now()
    return [...base, ...local];
}

export async function getPostById(id) {
    const posts = await getPosts();
    return posts.find(p => String(p.id) === String(id)) || null;
}

export function addLocalPost(post) {
    const local = readJSON(POSTS_KEY, []);
    local.push(post);
    writeJSON(POSTS_KEY, local);
    return post;
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
    const res = await fetch('/api/requests.json');
    const base = res.ok ? await res.json() : [];
    const local = readJSON(REQUESTS_KEY, []);
    return [...base, ...local];
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
    const res = await fetch('/api/users.json');
    const base = res.ok ? await res.json() : [];
    const local = readJSON(USERS_KEY, []);
    return [...base, ...local];
}

export function addLocalUser(u) {
    const local = readJSON(USERS_KEY, []);
    local.push(u);
    writeJSON(USERS_KEY, local);
    return u;
}
