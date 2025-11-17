import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});

// Request interceptor
apiClient.interceptors.request.use(
    (config) => {
        // Try to get token from auth in localStorage
        const authString = localStorage.getItem('auth');
        if (authString) {
            try {
                const auth = JSON.parse(authString);
                if (auth && auth.token) {
                    config.headers.Authorization = `Bearer ${auth.token}`;
                }
            } catch (error) {
                console.error('Error parsing auth from localStorage:', error);
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Only redirect to login if:
        // 1. It's a 401 error
        // 2. User was actually logged in (had a token)
        // 3. Not already on login/register pages
        // 4. Not a public endpoint
        if (error.response?.status === 401) {
            const authString = localStorage.getItem('auth');
            const currentPath = window.location.pathname;
            const requestUrl = error.config?.url || '';
            
            // Public endpoints that shouldn't trigger redirect
            const publicEndpoints = ['/auth/', '/jobs/active', '/jobs/search', '/events/upcoming'];
            const isPublicEndpoint = publicEndpoints.some(endpoint => requestUrl.includes(endpoint));
            
            // Only redirect if:
            // - User had auth (was logged in)
            // - Not already on auth pages
            // - Not accessing a public endpoint
            if (authString && !isPublicEndpoint && currentPath !== '/login' && currentPath !== '/register') {
                localStorage.removeItem('auth');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;