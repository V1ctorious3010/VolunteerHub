import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../utils/apiClient';
import { ROLE } from '../../constants/roles';

const USER_KEY = 'vh_auth_user';

// Base API URL - điều chỉnh theo cấu hình backend của bạn
const API_BASE_URL = 'http://localhost:5000';


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

export const login = createAsyncThunk(
    'auth/login',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { message, name, email: userEmail } = response.data;
            // Try to extract role and avatar from response in several possible shapes
            let role = response.data.role || response.data.user?.role || null;
            let avatarUrl = response.data.avatarUrl || response.data.avatar || response.data.user?.avatarUrl || response.data.user?.avatar || null;

            // If role not provided in login response, try to fetch current profile
            if (!role || !avatarUrl) {
                try {
                    const meResp = await api.get('/auth/me');
                    role = role || meResp.data?.role || meResp.data?.user?.role || null;
                    avatarUrl = avatarUrl || meResp.data?.avatarUrl || meResp.data?.avatar || meResp.data?.user?.avatarUrl || meResp.data?.user?.avatar || null;
                } catch (e) {
                    // ignore — backend may not expose /auth/me
                }
            }

            // normalize stored user: include avatarUrl and fallback avatar for older code
            const userPayload = { name, email: userEmail, message, role };
            if (avatarUrl) {
                userPayload.avatarUrl = avatarUrl;
                userPayload.avatar = avatarUrl;
            }
            return userPayload;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.response?.data || 'Đăng nhập thất bại';
            return rejectWithValue(errorMessage);
        }
    }
);

export const register = createAsyncThunk(
    'auth/register',
    async ({ name, email, password, role = ROLE.VOLUNTEER }, { rejectWithValue }) => {
        try {
            // Chuyển role sang uppercase để khớp với enum backend
            const roleUpper = typeof role === 'string' ? role.toUpperCase() : ROLE.VOLUNTEER;
            const response = await api.post('/auth/register', {
                name,
                email,
                password,
                role: roleUpper
            });
            const { message, name: userName, email: userEmail } = response.data;
            let returnedRole = response.data.role || response.data.user?.role || null;
            let avatarUrl = response.data.avatarUrl || response.data.avatar || response.data.user?.avatarUrl || response.data.user?.avatar || null;
            if (!returnedRole || !avatarUrl) {
                try {
                    const meResp = await api.get('/auth/me');
                    returnedRole = returnedRole || meResp.data?.role || meResp.data?.user?.role || null;
                    avatarUrl = avatarUrl || meResp.data?.avatarUrl || meResp.data?.avatar || meResp.data?.user?.avatarUrl || meResp.data?.user?.avatar || null;
                } catch (e) {
                    // ignore
                }
            }
            const roleToStore = returnedRole || roleUpper;
            const userPayload = { name: userName, email: userEmail, message, role: roleToStore };
            if (avatarUrl) { userPayload.avatarUrl = avatarUrl; userPayload.avatar = avatarUrl; }
            return userPayload;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.response?.data || 'Đăng ký thất bại';
            return rejectWithValue(errorMessage);
        }
    }
);

export const logout = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await api.post('/auth/logout');
            return true;
        } catch (error) {
            // Vẫn đăng xuất ở client ngay cả khi server error
            return true;
        }
    }
);

// Refresh access token
export const refreshToken = createAsyncThunk(
    'auth/refreshToken',
    async (_, { rejectWithValue }) => {
        try {
            await api.post('/auth/refresh');
            return true;
        } catch (error) {
            return rejectWithValue('Phiên đăng nhập đã hết hạn');
        }
    }
);

// ============ User Management APIs (Admin only) ============

// Lấy danh sách tất cả users
export const fetchAllUsers = async () => {
    try {
        console.log('[authSlice] fetchAllUsers -> calling /user/users');
        const response = await api.get('/user/users');
        console.log('[authSlice] fetchAllUsers -> status', response?.status);
        return response.data;
    } catch (e) {
        console.error('[authSlice] fetchAllUsers error', e);
        throw e;
    }
};

// Ban user
export const banUser = async (email) => {
    const response = await api.post('/user/ban', { email });
    return response.data;
};

// Unban user
export const unbanUser = async (email) => {
    const response = await api.post('/user/unban', { email });
    return response.data;
};

// api client is provided by ../../utils/apiClient

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
                state.error = action.payload || 'Đăng nhập thất bại';
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
                state.error = action.payload || 'Đăng ký thất bại';
            })
            // logout
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.error = null;
                writeJSON(USER_KEY, null);
            })
            // refreshToken
            .addCase(refreshToken.rejected, (state) => {
                state.user = null;
                state.error = null;
                writeJSON(USER_KEY, null);
            });
    },
});

export default authSlice.reducer;
