// api.js

import axios from 'axios';
import { getToken } from '../utils/auth'; // Asegúrate de tener esta función para obtener el token de autenticación

const api = axios.create({
  baseURL: 'http://localhost:4000/api',
});

// Interceptor para agregar el token a todas las solicitudes salientes
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers['x-access-token'] = token; // Agregar el token al encabezado de la solicitud
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
