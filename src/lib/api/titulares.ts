import {
  Titular,
  TitularWithEstablecimientos,
  CreateTitularDto,
  UpdateTitularDto,
  PaginatedResponse,
} from '@/types';
import { apiCache } from './cache';

export interface TitularesQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  estado?: string;
  tipo?: string;
}

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}

function getApiConfig() {
  return {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8089',
    apiKey: process.env.NEXT_PUBLIC_API_KEY || '',
  };
}

export const titularesService = {
  async getAll(params?: TitularesQueryParams): Promise<PaginatedResponse<TitularWithEstablecimientos>> {
    const token = getToken();
    if (!token) {
      throw new Error('No autenticado');
    }

    const { baseUrl, apiKey } = getApiConfig();
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.search) searchParams.set('search', params.search);
    if (params?.estado) searchParams.set('estado', params.estado);
    if (params?.tipo) searchParams.set('tipo', params.tipo);

    const query = searchParams.toString();
    const cacheKey = `titulares:${query}`;

    // Verificar caché
    const cachedData = apiCache.get<PaginatedResponse<TitularWithEstablecimientos>>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const response = await fetch(
      `${baseUrl}/api/v1/ganado/titulares${query ? `?${query}` : ''}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey,
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: response.statusText,
      }));
      throw new Error(error.message || 'Error al obtener titulares');
    }

    const data = await response.json();
    
    // Guardar en caché por 5 minutos
    apiCache.set(cacheKey, data, 5 * 60 * 1000);

    return data;
  },

  async getById(id: string): Promise<TitularWithEstablecimientos> {
    const token = getToken();
    if (!token) {
      throw new Error('No autenticado');
    }

    const { baseUrl, apiKey } = getApiConfig();

    const response = await fetch(`${baseUrl}/api/v1/ganado/titulares/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: response.statusText,
      }));
      throw new Error(error.message || 'Titular no encontrado');
    }

    return await response.json();
  },

  async create(data: CreateTitularDto): Promise<Titular> {
    const token = getToken();
    if (!token) {
      throw new Error('No autenticado');
    }

    const { baseUrl, apiKey } = getApiConfig();

    const response = await fetch(`${baseUrl}/api/v1/ganado/titulares`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: response.statusText,
      }));
      throw new Error(error.message || 'Error al crear titular');
    }

    // Invalidar caché de titulares
    apiCache.invalidatePattern('titulares:');

    return await response.json();
  },

  async update(id: string, data: UpdateTitularDto): Promise<Titular> {
    const token = getToken();
    if (!token) {
      throw new Error('No autenticado');
    }

    const { baseUrl, apiKey } = getApiConfig();

    const response = await fetch(`${baseUrl}/api/v1/ganado/titulares/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: response.statusText,
      }));
      throw new Error(error.message || 'Error al actualizar titular');
    }

    // Invalidar caché de titulares
    apiCache.invalidatePattern('titulares:');

    return await response.json();
  },

  async delete(id: string): Promise<void> {
    const token = getToken();
    if (!token) {
      throw new Error('No autenticado');
    }

    const { baseUrl, apiKey } = getApiConfig();

    const response = await fetch(`${baseUrl}/api/v1/ganado/titulares/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: response.statusText,
      }));
      throw new Error(error.message || 'Error al eliminar titular');
    }

    // Invalidar caché de titulares
    apiCache.invalidatePattern('titulares:');
  },

  async toggleEstado(id: string): Promise<Titular> {
    const token = getToken();
    if (!token) {
      throw new Error('No autenticado');
    }

    const { baseUrl, apiKey } = getApiConfig();

    const response = await fetch(
      `${baseUrl}/api/v1/ganado/titulares/${id}/toggle-estado`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: response.statusText,
      }));
      throw new Error(error.message || 'Error al cambiar estado');
    }

    // Invalidar caché de titulares
    apiCache.invalidatePattern('titulares:');

    return await response.json();
  },
};
