import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: API_BASE,
});

export const getVacancies = () => api.get('/vacancies');
export const getVacancyById = (id) => api.get(`/vacancies/${id}`);
export const getVacanciesByCategory = (category) => api.get(`/vacancies/category/${category}`);
export const searchVacancies = (title) => api.get('/vacancies/search', { params: { title } });

export default api;
