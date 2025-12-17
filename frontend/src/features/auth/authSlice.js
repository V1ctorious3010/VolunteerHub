import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../utils/apiClient';
import { ROLE } from '../../constants/roles';

// Base API URL - điều chỉnh theo cấu hình backend của bạn
const API_BASE_URL = 'http://localhost:5000';

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
            if (!role) {
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
            // console.log('[auth/logout] start logout flow');
            // Unsubscribe from push notifications before logout
            if ('serviceWorker' in navigator && 'PushManager' in window) {
                try {
                    // console.log('[auth/logout] serviceWorker supported — checking registration');
                    const registration = await navigator.serviceWorker.ready;
                    // console.log('[auth/logout] serviceWorker ready', !!registration);
                    const subscription = await registration.pushManager.getSubscription();
                    // console.log('[auth/logout] current subscription', !!subscription, subscription?.endpoint);

                    if (subscription) {
                        // Try to notify server
                        try {
                            const subscriptionJSON = subscription.toJSON();
                            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                            // console.log('[auth/logout] notifying backend to remove subscription', subscriptionJSON.endpoint);
                            const notifyResp = await fetch(`${apiUrl}/notifications/unsubscribe`, {
                                method: 'POST',
                                credentials: 'include',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ endpoint: subscriptionJSON.endpoint })
                            });
                            // console.log('[auth/logout] notify response ok=', notifyResp.ok, 'status=', notifyResp.status);
                        } catch (e) {
                            console.log('[auth/logout] Could not notify server about unsubscription', e);
                        }

                        // Unsubscribe locally
                        try {
                            const unsubscribed = await subscription.unsubscribe();
                            // console.log('[auth/logout] local subscription.unsubscribe() result:', unsubscribed);
                        } catch (e) {
                            console.log('[auth/logout] local unsubscribe failed', e);
                        }
                    }
                } catch (error) {
                    console.error('[auth/logout] Error while handling serviceWorker/unsubscribe:', error);
                }
            }

            console.log('[auth/logout] calling backend /auth/logout');
            try {
                const resp = await api.post('/auth/logout');
                console.log('[auth/logout] backend logout response status=', resp?.status);
            } catch (e) {
                console.log('[auth/logout] backend logout failed', e);
            }

            console.log('[auth/logout] finished logout flow — returning true');
            return true;
        } catch (error) {
            console.error('[auth/logout] unexpected error in logout flow', error);
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

// Fetch current user from server (restore session)
export const fetchMe = createAsyncThunk(
    'auth/fetchMe',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/auth/me');
            const userData = response.data;
            // Extract user info from response
            const name = userData.name || userData.user?.name;
            const email = userData.email || userData.user?.email;
            const role = userData.role || userData.user?.role;
            const avatarUrl = userData.avatarUrl || userData.avatar || userData.user?.avatarUrl || userData.user?.avatar;

            const userPayload = { name, email, role };
            if (avatarUrl) {
                userPayload.avatarUrl = avatarUrl;
                userPayload.avatar = avatarUrl;
            }
            return userPayload;
        } catch (error) {
            // User not logged in or session expired
            return rejectWithValue('Không thể khôi phục phiên đăng nhập');
        }
    }
);

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
        user: null,
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
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Đăng ký thất bại';
            })
            // logout
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.error = null;
            })
            // refreshToken
            .addCase(refreshToken.rejected, (state) => {
                state.user = null;
                state.error = null;
            })
            // fetchMe
            .addCase(fetchMe.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchMe.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.error = null;
            })
            .addCase(fetchMe.rejected, (state) => {
                state.loading = false;
                state.user = null;
            });
    },
});

export default authSlice.reducer;