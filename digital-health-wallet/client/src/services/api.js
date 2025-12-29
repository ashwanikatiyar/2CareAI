import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (credentials) => api.post('/auth/register', credentials);
export const uploadReport = (formData) => api.post('/reports/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
export const getReports = () => api.get('/reports');
export const getReportsWithParams = (query) => api.get(`/reports${query}`);
export const getSharedReports = () => api.get('/reports/shared');
export const shareReport = (data) => api.post('/reports/share', data);
export const addVitals = (data) => api.post('/vitals', data);
export const getVitals = () => api.get('/vitals');
export const deleteReport = (id) => api.delete(`/reports/${id}`);
export const removeSharedReport = (id) => api.delete(`/reports/shared/${id}`);

export default api;
