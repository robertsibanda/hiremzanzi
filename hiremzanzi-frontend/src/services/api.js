import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
});

export const getVacancies = () => api.get('/vacancies');
export const getVacancyById = (id) => api.get(`/vacancies/${id}`);
export const getVacanciesByCategory = (category) => api.get(`/vacancies/category/${encodeURIComponent(category)}`);
export const searchVacancies = (title) => api.get('/vacancies/search', { params: { title } });
export const getVacanciesPaged = (page = 0, size = 20, category = null, title = null) => {
  const params = { page, size };
  if (category) params.category = category;
  if (title) params.title = title;
  return api.get('/vacancies/paged', { params });
};

export default api;
