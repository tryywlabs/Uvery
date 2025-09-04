//For Debugging Purposes

const API_BASE_URL = 'http://localhost:8000/api';

// Helper function for authenticated requests
export const authenticatedFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('authToken');

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (response.status === 401) {
    // Token expired or invalid
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    window.location.href = '/signin';
    return;
  }

  return response;
};

// API functions
export const api = {
  // Authentication
  signin: (credentials) =>
    fetch(`${API_BASE_URL}/users/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    }),

  signup: (userData) =>
    fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    }),

  // Authenticated requests
  getProfile: () => authenticatedFetch('/users/profile'),
  updateProfile: (data) =>
    authenticatedFetch('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  signout: () => authenticatedFetch('/users/signout', { method: 'POST' }),
};
