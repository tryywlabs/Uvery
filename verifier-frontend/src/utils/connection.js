const API_BASE_URL = import.meta.env.PROD
  ? '/api'
  : 'http://localhost:8000/api';

export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, options);
  return response;
};
