import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});

api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        console.error('API Error:', error);
        return Promise.reject(error);
    }
);

export const endpoints = {
    voice: {
        upload: (formData) => api.post('/voice/upload', formData),
        train: (data) => api.post('/voice/train', data),
        preview: (data) => api.post('/voice/preview', data),
    },
    materials: {
        upload: (formData) => api.post('/materials/upload', formData),
    },
    generation: {
        create: (data) => api.post('/generate', data, { headers: { 'Content-Type': 'application/json' } }),
    }
};

export default api;
