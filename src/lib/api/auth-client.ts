'use client';

import { loginAction, getProfileAction } from './server-actions';

export const authClient = {
  async login(email: string, password: string) {
    const result = await loginAction(email, password);
    
    if (!result.success) {
      throw new Error(result.error || 'Error al iniciar sesión');
    }

    const { access_token, user } = result.data;
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', access_token);
    }
    
    return { access_token, user };
  },

  async logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
    }
  },

  async getProfile() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    
    if (!token) {
      throw new Error('No token found');
    }

    const result = await getProfileAction(token);
    
    if (!result.success) {
      throw new Error(result.error || 'Error al obtener perfil');
    }

    return result.data;
  },

  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('access_token');
  },
};
