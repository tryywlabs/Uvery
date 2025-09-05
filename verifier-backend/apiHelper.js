//For Debugging Purposes

const API_BASE_URL = 'http://localhost:8000/api';

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

  // CASE: Token Expired or Invalid
  if (response.status === 401) {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    window.location.href = '/signin';
    return;
  }

  return response;
};

// User Functionality API endpoints
export const api = {
  // Authentication
  signin: (credentials) =>
    fetch(`${API_BASE_URL}/users/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    }),
  // Signup
  signup: (userData) =>
    fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    }),
  // Navigating to user dashboard (Protected, assuming authenticated user)
  getProfile: () => authenticatedFetch('/users/profile'),
};
