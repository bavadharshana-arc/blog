import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Attach JWT bearer token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Extract message or redirect on unauthorized if appropriate
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If token expired or invalid, we can optionally clear token
    if (error.response && error.response.status === 401) {
      const currentPath = window.location.pathname;
      if (
        !currentPath.includes('/login') &&
        !currentPath.includes('/register') &&
        (currentPath.includes('/dashboard') ||
          currentPath.includes('/create-post') ||
          currentPath.includes('/edit-post'))
      ) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
      }
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  updateProfile: async (data) => {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },
};

// Post Services
export const postService = {
  getAllPosts: async (params = {}) => {
    const response = await api.get('/posts', { params });
    return response.data;
  },
  getPostById: async (id) => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },
  createPost: async (postData) => {
    const response = await api.post('/posts', postData);
    return response.data;
  },
  updatePost: async (id, postData) => {
    const response = await api.put(`/posts/${id}`, postData);
    return response.data;
  },
  deletePost: async (id) => {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  },
  getUserPosts: async () => {
    const response = await api.get('/posts/user/me');
    return response.data;
  },
  getCategories: async () => {
    const response = await api.get('/posts/categories');
    return response.data;
  },
};

// Comment Services
export const commentService = {
  getPostComments: async (postId) => {
    const response = await api.get(`/posts/${postId}/comments`);
    return response.data;
  },
  addComment: async (postId, content) => {
    const response = await api.post(`/posts/${postId}/comments`, { content });
    return response.data;
  },
  updateComment: async (commentId, content) => {
    const response = await api.put(`/comments/${commentId}`, { content });
    return response.data;
  },
  deleteComment: async (commentId) => {
    const response = await api.delete(`/comments/${commentId}`);
    return response.data;
  },
};

export default api;
