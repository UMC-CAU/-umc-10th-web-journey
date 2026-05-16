import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8000/v1',
    timeout: 5000,
});

apiClient.interceptors.request.use(
    (config) => {
        const tokenString = window.localStorage.getItem('accessToken');
        if (tokenString) {
            try {
                const token = JSON.parse(tokenString);
                if (token) {
                    config.headers['Authorization'] = `Bearer ${token}`;
                }
            } catch (error) {
                console.error('Error parsing token from localStorage', error);
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshTokenString = window.localStorage.getItem('refreshToken');
                if (!refreshTokenString) {
                    throw new Error('Refresh token not found');
                }

                const refreshToken = JSON.parse(refreshTokenString);

                const response = await axios.post('http://localhost:8000/v1/auth/refresh', {
                    refresh: refreshToken
                });

                const newAccessToken = response.data?.data?.accessToken || response.data?.accessToken;
                const newRefreshToken = response.data?.data?.refreshToken || response.data?.refreshToken;

                window.localStorage.setItem('accessToken', JSON.stringify(newAccessToken));
                if (newRefreshToken) {
                    window.localStorage.setItem('refreshToken', JSON.stringify(newRefreshToken));
                }

                window.dispatchEvent(new Event('auth-storage-change'));

                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

                return apiClient(originalRequest);

            } catch (refreshError) {
                console.error('Refresh token expired or failed. Logging out...', refreshError);

                window.localStorage.removeItem('accessToken');
                window.localStorage.removeItem('refreshToken');
                window.dispatchEvent(new Event('auth-storage-change'));

                window.location.href = '/login';

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
