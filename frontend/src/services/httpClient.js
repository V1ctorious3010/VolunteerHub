import axios from 'axios';
import { apiConfig } from '../config/api.config';

class HttpClient {
    constructor() {
        this.client = axios.create(apiConfig);
        this.setupInterceptors();
    }

    setupInterceptors() {
        // Request interceptor - add auth token
        this.client.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('authToken');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                console.error('Request error:', error);
                return Promise.reject(error);
            }
        );

        // Response interceptor - handle errors
        this.client.interceptors.response.use(
            (response) => {
                return response;
            },
            (error) => {
                if (error.response?.status === 401) {
                    // Token expired or invalid
                    this.handleAuthError();
                }

                // Handle other errors
                const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
                console.error('API Error:', errorMessage);

                return Promise.reject({
                    ...error,
                    message: errorMessage
                });
            }
        );
    }

    handleAuthError() {
        // Clear auth data
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');

        // Redirect to login
        window.location.href = '/login';
    }

    async get(url, config = {}) {
        try {
            const response = await this.client.get(url, config);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async post(url, data, config = {}) {
        try {
            const response = await this.client.post(url, data, config);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async put(url, data, config = {}) {
        try {
            const response = await this.client.put(url, data, config);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async delete(url, config = {}) {
        try {
            const response = await this.client.delete(url, config);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

export const httpClient = new HttpClient();