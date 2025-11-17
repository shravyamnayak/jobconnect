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
                    console.log('Token attached:', auth.token.substring(0, 20) + '...'); // Debug log
                }
            } catch (error) {
                console.error('Error parsing auth from localStorage:', error);
                localStorage.removeItem('auth'); // Clean up bad data
            }
        } else {
            console.log('No auth found in localStorage'); // Debug log
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
        console.error('API Error:', {
            status: error.response?.status,
            url: error.config?.url,
            message: error.response?.data
        });

        // Only redirect to login if:
        // 1. It's a 401 error
        // 2. Not already on login/register pages
        // 3. Not a public endpoint
        if (error.response?.status === 401) {
            const currentPath = window.location.pathname;
            const requestUrl = error.config?.url || '';
            
            // Public endpoints that shouldn't trigger redirect
            const publicEndpoints = ['/auth/', '/jobs/active', '/jobs/search', '/events/upcoming'];
            const isPublicEndpoint = publicEndpoints.some(endpoint => requestUrl.includes(endpoint));
            
            // Only redirect if not on auth pages and not a public endpoint
            if (!isPublicEndpoint && currentPath !== '/login' && currentPath !== '/register') {
                console.log('401 error - redirecting to login');
                localStorage.removeItem('auth');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;