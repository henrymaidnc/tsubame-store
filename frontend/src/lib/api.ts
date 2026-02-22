import axios from 'axios';

function getApiBaseUrl(): string {
  const env = import.meta.env.VITE_API_URL as string | undefined;
  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    const isLocal = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
    if (isLocal) {
      if (!env || /tsubame-arts\.econictek\.com/i.test(env)) {
        return 'http://localhost:8002/api';
      }
      return env.replace(/\/$/, '');
    }
    if (env && env.trim()) {
      return env.replace(/\/$/, '');
    }
    if (window.location.protocol === 'https:') {
      return `${origin}/api`;
    }
  }
  return (env || 'http://localhost:8002/api').replace(/\/$/, '');
}

const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
  headers: {
    'Accept': 'application/json',
  },
  timeout: 15000,
});

// Add auth token to requests
api.interceptors.request.use((config: any) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response: any) => response,
  (error: any) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
      console.log('Unauthorized, redirecting to login');
    }
    return Promise.reject(error);
  }
);

export interface User {
  id: number;
  email: string;
  role: string;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: string;
  distributor: string;
  batch_number: string;
  description: string;
  image: string;
}
export interface Material {
  id: number;
  name: string;
  unit: string;
  stock: number;
  cost_per_unit: number;
}
export interface DistributorPayload {
  name: string;
  branch?: string;
  address?: string;
  contact?: string;
  phone?: string;
  commission?: number;
}
export interface RevenueSummary {
  total_revenue: number;
  average_revenue: number;
  max_revenue: number;
  min_revenue: number;
  months_count: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

// Auth API
export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Products API
export const productsAPI = {
  getAll: async (): Promise<Product[]> => {
    try {
      const response = await api.get('/products/');
      const data = response.data;
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  },
  
  getById: async (id: number): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },
  
  create: async (payload: Partial<Product>) => {
    const response = await api.post('/products/', payload);
    return response.data;
  },
};

export const materialsAPI = {
  create: async (payload: Partial<Material>) => {
    const response = await api.post('/materials/', payload);
    return response.data;
  },
};

export const distributorsAPI = {
  create: async (payload: DistributorPayload) => {
    const response = await api.post('/distributors', payload);
    return response.data;
  },
};

export default api;
