import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:3001/api' });

export const registerMeal = (data) => API.post('/meals/register-meal', data);
export const getMenu = (date) => API.get(`/meals/menu/${date}`);