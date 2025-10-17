import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    axios.defaults.withCredentials = true; // Gửi cookie mọi request

    // ==========================================
    // 1. ĐĂNG KÝ TÀI KHOẢN
    // ==========================================
    const registerAccount = async (email, password, name) => {
        setLoading(true);
        try {
            const { data } = await axios.post("/api/auth/register", {
                email,
                password,
                name
            });

            // ⭐ Server đã lưu JWT vào HTTP-only cookie
            // Browser tự động lưu cookie và gửi kèm mọi request
            setUser(data.user);
            return data;

        } catch (error) {
            throw error.response?.data || error;
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // 2. ĐĂNG NHẬP
    // ==========================================
    const logIn = async (email, password) => {
        setLoading(true);
        try {
            const { data } = await axios.post("/api/auth/login", {
                email,
                password
            });

            // ⭐ Server đã lưu JWT vào HTTP-only cookie
            setUser(data.user);
            return data;

        } catch (error) {
            throw error.response?.data || error;
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // 3. ĐĂNG XUẤT
    // ==========================================
    const logOut = async () => {
        setLoading(true);
        try {
            await axios.post("/api/auth/logout");

            // ⭐ Server đã xóa HTTP-only cookie
            setUser(null);

        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // 4. CẬP NHẬT PROFILE
    // ==========================================
    const updateUserProfile = async (displayName, photoURL) => {
        try {
            const { data } = await axios.put("/update-profile", {
                displayName,
                photoURL
            });

            // Cập nhật state local
            setUser({ ...user, displayName, photoURL });
            return data;

        } catch (error) {
            throw error.response?.data || error;
        }
    };

    // ==========================================
    // 5. ĐỔI MẬT KHẨU
    // ==========================================
    const changePassword = async (currentPassword, newPassword) => {
        try {
            const { data } = await axios.post("/change-password", {
                currentPassword,
                newPassword
            });
            return data;

        } catch (error) {
            throw error.response?.data || error;
        }
    };

    // ==========================================
    // 6. KIỂM TRA USER KHI LOAD TRANG
    // (Thay thế onAuthStateChanged của Firebase)
    // ==========================================
    useEffect(() => {
        const checkAuth = async () => {
            try {
                // ⭐ Cookie HTTP-only tự động gửi kèm request
                const { data } = await axios.get("/api/auth/current");
                setUser(data.user);

            } catch (error) {
                // Không có cookie hoặc cookie hết hạn
                setUser(null);

            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    // ==========================================
    // 7. AXIOS INTERCEPTOR - XỬ LÝ TOKEN HẾT HẠN
    // ==========================================
    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                // Nếu token hết hạn (401), tự động logout
                if (error.response?.status === 401) {
                    setUser(null);
                    // Redirect về trang login
                    window.location.href = "/login";
                }
                return Promise.reject(error);
            }
        );

        // Cleanup interceptor khi unmount
        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, []);

    // ==========================================
    // 8. CONTEXT VALUES
    // ==========================================
    const allValues = {
        user,
        loading,
        registerAccount,
        logIn,
        logOut,
        updateUserProfile,
        changePassword,
    };

    return (
        <AuthContext.Provider value={allValues}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AuthProvider;
