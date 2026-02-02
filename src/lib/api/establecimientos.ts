import {
  Establecimiento,
  EstablecimientoWithRelations,
  CreateEstablecimientoDto,
  UpdateEstablecimientoDto,
  PaginatedResponse,
} from '@/types';

function getApiConfig() {
  return {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8089',
    apiKey: process.env.NEXT_PUBLIC_API_KEY || '',
  };
}

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}

export const establecimientosService = {
  async getAll(params?: Record<string, string>): Promise<PaginatedResponse<EstablecimientoWithRelations>> {
    const token = getToken();
    if (!token) {
      throw new Error('No autenticado');
    }

    const { baseUrl, apiKey } = getApiConfig();
    const queryString = params ? new URLSearchParams(params).toString() : '';
    const url = `${baseUrl}/api/v1/ganado/establecimientos${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      headers: {
        'X-API-Key': apiKey,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: response.statusText,
      }));
      throw new Error(error.message || 'Error al obtener establecimientos');
    }

    return await response.json();
  },

  async getById(id: string): Promise<EstablecimientoWithRelations> {
    const token = getToken();
    if (!token) {
      throw new Error('No autenticado');
    }

    const { baseUrl, apiKey } = getApiConfig();

    const response = await fetch(`${baseUrl}/api/v1/ganado/establecimientos/${id}`, {
      headers: {
        'X-API-Key': apiKey,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: response.statusText,
      }));
      throw new Error(error.message || 'Error al obtener establecimiento');
    }

    return await response.json();
  },

  async create(data: CreateEstablecimientoDto): Promise<Establecimiento> {
    const token = getToken();
    if (!token) {
      throw new Error('No autenticado');
    }

    const { baseUrl, apiKey } = getApiConfig();

    const response = await fetch(`${baseUrl}/api/v1/ganado/establecimientos`, {
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
      throw new Error(error.message || 'Error al crear establecimiento');
    }

    return await response.json();
  },

  async update(id: string, data: UpdateEstablecimientoDto): Promise<Establecimiento> {
    const token = getToken();
    if (!token) {
      throw new Error('No autenticado');
    }

    const { baseUrl, apiKey } = getApiConfig();

    const response = await fetch(`${baseUrl}/api/v1/ganado/establecimientos/${id}`, {
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
      throw new Error(error.message || 'Error al actualizar establecimiento');
    }

    return await response.json();
  },

  async delete(id: string): Promise<void> {
    const token = getToken();
    if (!token) {
      throw new Error('No autenticado');
    }

    const { baseUrl, apiKey } = getApiConfig();

    const response = await fetch(`${baseUrl}/api/v1/ganado/establecimientos/${id}`, {
      method: 'DELETE',
      headers: {
        'X-API-Key': apiKey,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: response.statusText,
      }));
      throw new Error(error.message || 'Error al eliminar establecimiento');
    }
  },

  async toggleEstado(id: string): Promise<Establecimiento> {
    const token = getToken();
    if (!token) {
      throw new Error('No autenticado');
    }

    const { baseUrl, apiKey } = getApiConfig();

    const response = await fetch(`${baseUrl}/api/v1/ganado/establecimientos/${id}/toggle-estado`, {
      method: 'PATCH',
      headers: {
        'X-API-Key': apiKey,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: response.statusText,
      }));
      throw new Error(error.message || 'Error al cambiar estado');
    }

    return await response.json();
  },
};
