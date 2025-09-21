import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  googleLogin: () => `${API_BASE_URL}/auth/google/login`,
  googleCallback: (code: string) => `${API_BASE_URL}/auth/google/callback?code=${code}`,
};

// Email Accounts API
export const emailAccountsAPI = {
  getOAuthUrl: async (provider: string) => {
    const response = await api.get(`/api/email-accounts/oauth/${provider}/url`);
    return response.data;
  },
  getOAuthUrlPublic: async (provider: string) => {
    const response = await api.get(`/api/email-accounts/oauth/${provider}/url-public`);
    return response.data;
  },
  oauthCallback: (provider: string, code: string) => 
    `${API_BASE_URL}/api/email-accounts/oauth/${provider}/callback?code=${code}`,
  getAll: () => api.get('/api/email-accounts').then(res => res.data),
  getById: (id: string) => api.get(`/api/email-accounts/${id}`).then(res => res.data),
  update: (id: string, data: any) => api.put(`/api/email-accounts/${id}`, data).then(res => res.data),
  delete: (id: string) => api.delete(`/api/email-accounts/${id}`).then(res => res.data),
  sync: (id: string) => api.post(`/api/email-accounts/${id}/sync`).then(res => res.data),
  syncInbox: (id: string, months?: number) => api.post(`/api/email-accounts/${id}/sync-inbox`, { months: months || 1 }).then(res => res.data),
  syncGroups: (id: string) => api.post(`/api/email-accounts/${id}/sync-groups`).then(res => res.data),
};

// Invoices API
export const invoicesAPI = {
  create: (data: any) => api.post('/api/invoices', data).then(res => res.data),
  getAll: (params?: any) => {
    // Filter out undefined/empty values to prevent validation errors
    const cleanParams = params ? Object.fromEntries(
      Object.entries(params).filter(([_, value]) => 
        value !== undefined && value !== null && value !== ''
      )
    ) : {};
    return api.get('/api/invoices/', { params: cleanParams }).then(res => res.data);
  },
  getById: (id: string) => api.get(`/api/invoices/${id}`).then(res => res.data),
  update: (id: string, data: any) => api.put(`/api/invoices/${id}`, data).then(res => res.data),
  delete: (id: string) => api.delete(`/api/invoices/${id}`).then(res => res.data),
  download: (id: string) => {
    // const token = localStorage.getItem('access_token');
    const url = `${API_BASE_URL}/api/invoices/${id}/download`;
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', '');
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
  getStats: () => api.get('/api/invoices/stats/summary').then(res => res.data),
  getHierarchy: () => api.get('/api/invoices/hierarchy').then(res => res.data),
};

// User API
export const userAPI = {
  getCurrentUser: () => api.get('/api/user/me').then(res => res.data),
};

// Vendors API
export const vendorsAPI = {
  getAvailable: () => api.get('/api/vendors/available').then(res => res.data),
  getUserPreferences: () => api.get('/api/vendors/user-preferences').then(res => res.data),
  savePreferences: (data: any) => api.post('/api/vendors/preferences', data).then(res => res.data),
  addCustomVendor: (data: any) => api.post('/api/vendors/custom', data).then(res => res.data),
  scanSelectedVendors: (emailAccountId?: string) => {
    const params = emailAccountId ? { email_account_id: emailAccountId } : {};
    return api.post('/api/vendors/scan-selected', params).then(res => res.data);
  },
};

// Stripe API
export const stripeAPI = {
  getProducts: () => api.get('/api/stripe/products').then(res => res.data),
  getProduct: (productId: string) => api.get(`/api/stripe/products/${productId}`).then(res => res.data),
};

export default api; 