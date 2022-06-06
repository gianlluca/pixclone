import axios from 'axios';

// In production change baseURL to your domain
export const api = axios.create({ baseURL: 'http://localhost:5858' });
