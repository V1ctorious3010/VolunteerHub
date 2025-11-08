import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const USER_KEY = 'vh_auth_user';
const LOCAL_USERS_KEY = 'vh_registered_users';

// Helpers to read/write localStorage safely
const readJSON = (key, fallback = null) => {
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
    } catch {
        // ignore
    }
};

// Load user session from localStorage on init
const initialUser = readJSON(USER_KEY, null);

// Fetch users from public JSON and merge with locally registered users
const fetchAllUsers = async () => {
    const res = await fetch('/api/users.json');
    const base = await res.json();
    const local = readJSON(LOCAL_USERS_KEY, []);
    return [...base, ...local];
};

export const login = createAsyncThunk(
    'auth/login',
    async ({ email /*, password*/ }, { rejectWithValue }) => {
        try {
            const users = await fetchAllUsers();
            const found = users.find(u => u.email?.toLowerCase() === email?.toLowerCase());
            if (!found) return rejectWithValue('Invalid credentials');
            // Note: password validation skipped in mock setup
            return { id: found.id, email: found.email, role: found.role, name: found.name };
        } catch (e) {
            return rejectWithValue('Login failed');
        }
    }
);

export const register = createAsyncThunk(
    'auth/register',
    async ({ name, email, role = 'volunteer' /*, password*/ }, { rejectWithValue }) => {
        try {
            const users = await fetchAllUsers();
            const exists = users.some(u => u.email?.toLowerCase() === email?.toLowerCase());
            if (exists) return rejectWithValue('Email already exists');
            // Create new user locally (since we cannot write to public JSON)
            const newUser = {
                id: Date.now(),
                name,
                email,
                role,
            };
            const local = readJSON(LOCAL_USERS_KEY, []);
            local.push(newUser);
            writeJSON(LOCAL_USERS_KEY, local);
            return newUser;
        } catch (e) {
            return rejectWithValue('Registration failed');
        }
    }
);

export const logout = createAsyncThunk('auth/logout', async () => {
    // No server call in mock mode; just resolve
    return true;
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: initialUser,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // login
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                writeJSON(USER_KEY, action.payload);
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Login failed';
            })
            // register
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                writeJSON(USER_KEY, action.payload);
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Registration failed';
            })
            // logout
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.error = null;
                writeJSON(USER_KEY, null);
            });
    },
});

export default authSlice.reducer;
