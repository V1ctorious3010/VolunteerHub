import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const USER_KEY = 'vh_auth_user';

// Base API URL - điều chỉnh theo cấu hình backend của bạn
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Cấu hình axios để gửi cookies
const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // Quan trọng: cho phép gửi cookies
    headers: {
        'Content-Type': 'application/json',
    },
});

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
            return { name, email: userEmail, message };
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.response?.data || 'Đăng nhập thất bại';
            return rejectWithValue(errorMessage);
        }
    }
);

export const register = createAsyncThunk(
    'auth/register',
    async ({ name, email, password, role = 'VOLUNTEER' }, { rejectWithValue }) => {
        try {
            // Chuyển role sang uppercase để khớp với enum backend
            const roleUpper = role.toUpperCase();
            const response = await api.post('/auth/register', {
                name,
                email,
                password,
                role: roleUpper
            });
            const { message, name: userName, email: userEmail } = response.data;
            return { name: userName, email: userEmail, message };
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

// Axios interceptor để tự động refresh token khi access token hết hạn
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Nếu lỗi 401 và chưa thử refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                await api.post('/auth/refresh');
                // Thử lại request ban đầu
                return api(originalRequest);
            } catch (refreshError) {
                // Refresh thất bại, cần đăng nhập lại
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export { api };

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
