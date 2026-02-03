import { ApiError } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8089';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || '';

class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = `${API_BASE_URL}/api/v1/ganado`;
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('access_token');
  }

  async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const token = this.getToken();
    
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(API_KEY && { 'X-API-Key': API_KEY }),
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options?.headers,
        },
        mode: 'cors',
        credentials: 'include',
      });

      if (!response.ok) {
        const error: ApiError = await response.json().catch(() => ({
          statusCode: response.status,
          message: response.statusText,
        }));
        throw error;
      }

      return response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error('Error de conexión con el backend:', this.baseURL);
        throw {
          statusCode: 0,
          message: 'No se puede conectar con el servidor. Verifica que el backend esté ejecutándose.',
        } as ApiError;
      }
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();

// Auth service (uses core backend, not ganado module)
export const authService = {
  async login(email: string, password: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(API_KEY && { 'X-API-Key': API_KEY }),
        },
        body: JSON.stringify({ email, password }),
        mode: 'cors',
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw error;
      }

      const data = await response.json();
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', data.access_token);
      }
      return data;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error('Error de conexión con el backend:', API_BASE_URL);
        throw new Error('No se puede conectar con el servidor. Verifica que el backend esté ejecutándose.');
      }
      throw error;
    }
  },

  async logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
    }
  },

  async getProfile() {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        headers: {
          ...(API_KEY && { 'X-API-Key': API_KEY }),
          Authorization: `Bearer ${token}`,
        },
        mode: 'cors',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Not authenticated');
      }

      return response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error('Error de conexión con el backend:', API_BASE_URL);
        throw new Error('No se puede conectar con el servidor.');
      }
      throw error;
    }
  },

  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('access_token');
  },
};
