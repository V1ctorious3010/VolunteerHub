import { createContext, useEffect, useState } from "react";
import { httpClient } from "../../services/httpClient";
import { endpoints } from "../../config/api.config";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Authentication methods
    const createUser = async (userData) => {
        try {
            setLoading(true);
            setError(null);
            const response = await httpClient.post(endpoints.auth.register, userData);
            return response;
        } catch (error) {
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logIn = async (email, password) => {
        try {
            setLoading(true);
            setError(null);
            const response = await httpClient.post(endpoints.auth.login, { email, password });

            // Store auth token and user data
            if (response.token) {
                localStorage.setItem('authToken', response.token);
                if (response.refreshToken) {
                    localStorage.setItem('refreshToken', response.refreshToken);
                }
                setUser(response.user);
                localStorage.setItem('user', JSON.stringify(response.user));
            }

            return response;
        } catch (error) {
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logOut = async () => {
        try {
            setLoading(true);
            await httpClient.post(endpoints.auth.logout);
        } catch (error) {
            console.warn('Logout API call failed:', error.message);
        } finally {
            // Clear local storage regardless of API call result
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            setUser(null);
            setLoading(false);
        }
    };

    const refreshToken = async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) throw new Error('No refresh token available');

            const response = await httpClient.post(endpoints.auth.refresh, { refreshToken });

            if (response.token) {
                localStorage.setItem('authToken', response.token);
                return response.token;
            }
        } catch (error) {
            // If refresh fails, logout user
            await logOut();
            throw error;
        }
    };

    // Check if user is authenticated on app startup
    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const userData = localStorage.getItem('user');

                if (token && userData) {
                    // Verify token is still valid
                    try {
                        const response = await httpClient.get(endpoints.auth.me);
                        setUser(response.user || JSON.parse(userData));
                    } catch (error) {
                        console.warn('Could not verify token with backend:', error.message);
                        // If backend is not available, still use cached user data
                        setUser(JSON.parse(userData));
                    }
                } else {
                    // No auth data, user is not logged in
                    setUser(null);
                }
            } catch (error) {
                console.error('Auth status check failed:', error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuthStatus();
    }, []);

    const authInfo = {
        user,
        loading,
        error,
        createUser,
        logIn,
        logOut,
        refreshToken,
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {loading ? (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-lg">Loading...</div>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};

export default AuthProvider;