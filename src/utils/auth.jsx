// auth.js

const TOKEN_KEY = 'access_token';

export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => { 
  return localStorage.getItem(TOKEN_KEY);
};

export const isAuthenticated = () => {
  return !!getToken(); // Retorna verdadero si hay un token almacenado, falso en caso contrario
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};
