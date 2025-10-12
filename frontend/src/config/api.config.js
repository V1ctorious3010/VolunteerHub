// API Configuration for Java Spring Boot Backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

console.log('🔧 API Configuration:');
console.log('- API_BASE_URL:', API_BASE_URL);
console.log('- VITE_API_URL:', import.meta.env.VITE_API_URL);

export const apiConfig = {
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
};

// API Endpoints
export const endpoints = {
    auth: {
        login: '/api/auth/login',
        register: '/api/auth/register',
        logout: '/api/auth/logout',
        refresh: '/api/auth/refresh',
        me: '/api/auth/me'
    },
    volunteers: {
        getAll: '/api/volunteers',
        create: '/api/volunteers',
        getById: '/api/volunteers/{id}',
        update: '/api/volunteers/{id}',
        delete: '/api/volunteers/{id}',
        apply: '/api/volunteers/{id}/apply'
    },
    users: {
        profile: '/api/users/profile',
        updateProfile: '/api/users/profile'
    }
};