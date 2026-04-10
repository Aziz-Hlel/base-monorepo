import axios from 'axios';
import { context } from './context';

export const http = axios.create({
  baseURL: context.baseUrl,
});

export const updateToken = () => {
  http.defaults.headers.common['Authorization'] = `Bearer ${context.token}`;
};
