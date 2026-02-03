import { Raza, Especie, PaginatedResponse } from '@/types';

export interface RazasQueryParams {
  page?: number;
  limit?: number;
  especie?: Especie;
  search?: string;
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

export const razasService = {
  async getAll(params?: RazasQueryParams): Promise<PaginatedResponse<Raza>> {
    const token = getToken();
    if (!token) {
      throw new Error('No autenticado');
    }

    const { baseUrl, apiKey } = getApiConfig();
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.especie) searchParams.set('especie', params.especie);
    if (params?.search) searchParams.set('search', params.search);

    const query = searchParams.toString();

    const response = await fetch(
      `${baseUrl}/api/v1/ganado/razas${query ? `?${query}` : ''}`,
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
      throw new Error(error.message || 'Error al obtener razas');
    }

    return await response.json();
  },

  async getByEspecie(especie: Especie): Promise<Raza[]> {
    const token = getToken();
    if (!token) {
      throw new Error('No autenticado');
    }

    const { baseUrl, apiKey } = getApiConfig();

    const response = await fetch(
      `${baseUrl}/api/v1/ganado/razas?especie=${especie}&limit=100`,
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
      throw new Error(error.message || 'Error al obtener razas');
    }

    const result = await response.json();
    return result.data || [];
  },

  async getById(id: string): Promise<Raza> {
    const token = getToken();
    if (!token) {
      throw new Error('No autenticado');
    }

    const { baseUrl, apiKey } = getApiConfig();

    const response = await fetch(`${baseUrl}/api/v1/ganado/razas/${id}`, {
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
      throw new Error(error.message || 'Raza no encontrada');
    }

    return await response.json();
  },
};
