import axios from 'axios';
const BASE_API = import.meta.env.VITE_BASE_API;
const AUTH_API = '/auth';

let onAuthFail: () => void = () => {};

export const setAxiosAuthHandler = (fn: () => void) => {
  onAuthFail = fn;
};

const api = axios.create({
  baseURL: BASE_API,
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;
    const status = err.response?.status;
    const message = err.response?.data?.message;

    if (
      (status === 401 || status === 403) &&
      (message === 'Access token missing' || message === 'Invalid access token')
    ) {
      originalRequest._retry = true;
      try {
        await api.get(AUTH_API + '/refresh');
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Refresh token failed');
        onAuthFail();
      }
    }

    return Promise.reject(err);
  }
);

export default api;
