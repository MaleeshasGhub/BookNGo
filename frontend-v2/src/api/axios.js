import axios from 'axios';

// Create a configured axios instance
const api = axios.create({
  baseURL: 'http://localhost:8080/api', // Spring Boot Backend URL
  headers: {
    'Content-Type': 'application/json'
  }
});

// We can add interceptors here later if we move to JWT tokens
api.interceptors.response.use(
  response => response,
  error => {
    // Global error handler
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
