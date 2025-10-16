// AuthProvider.jsx - BỎ FIREBASE
import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // ĐĂNG KÝ
    const registerAccount = async (email, password, name) => {
        setLoading(true);
        try {
            const { data } = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/auth/register`,
                { email, password, name },
                { withCredentials: true }
            );
            setUser(data.user);
            return data;
        } catch (error) {
            throw error.response?.data || error;
        } finally {
            setLoading(false);
        }
    };

    // ĐĂNG NHẬP
    const logIn = async (email, password) => {
        setLoading(true);
        try {
            const { data } = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/auth/login`,
                { email, password },
                { withCredentials: true }
            );
            setUser(data.user);
            return data;
        } catch (error) {
            throw error.response?.data || error;
        } finally {
            setLoading(false);
        }
    };

    // ĐĂNG XUẤT
    const logOut = async () => {
        try {
            await axios.post(
                `${import.meta.env.VITE_API_URL}/api/auth/logout`,
                {},
                { withCredentials: true }
            );
            setUser(null);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    // KIỂM TRA USER KHI LOAD TRANG (thay thế onAuthStateChanged)
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const { data } = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/auth/current`,
                    { withCredentials: true }
                );
                setUser(data.user || data);
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const allValues = {
        registerAccount,
        logIn,
        logOut,
        user,
        loading,
    };

    return (
        <AuthContext.Provider value={allValues}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;