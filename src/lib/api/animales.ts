import {
  Animal,
  CreateAnimalDto,
  UpdateAnimalDto,
  AnimalWithRelations,
  PaginatedResponse,
  Identificador,
  CreateIdentificadorDto,
} from '@/types';
import { apiCache } from './cache';

export interface AnimalesQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  estado?: string;
  sexo?: string;
  establecimientoId?: string;
  loteId?: string;
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

export const animalesService = {
  async getAll(params?: AnimalesQueryParams): Promise<PaginatedResponse<AnimalWithRelations>> {
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
    if (params?.sexo) searchParams.set('sexo', params.sexo);
    if (params?.establecimientoId) searchParams.set('establecimientoId', params.establecimientoId);
    if (params?.loteId) searchParams.set('loteId', params.loteId);

    const query = searchParams.toString();
    const cacheKey = `animales:${query}`;

    // Verificar caché
    const cachedData = apiCache.get<PaginatedResponse<AnimalWithRelations>>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const response = await fetch(
      `${baseUrl}/api/v1/ganado/animales${query ? `?${query}` : ''}`,
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
      throw new Error(error.message || 'Error al obtener animales');
    }

    const data = await response.json();
    
    // Guardar en caché por 5 minutos
    apiCache.set(cacheKey, data, 5 * 60 * 1000);

    return data;
  },

  async getById(id: string): Promise<AnimalWithRelations> {
    const token = getToken();
    if (!token) {
      throw new Error('No autenticado');
    }

    const { baseUrl, apiKey } = getApiConfig();

    const response = await fetch(`${baseUrl}/api/v1/ganado/animales/${id}`, {
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
      throw new Error(error.message || 'Animal no encontrado');
    }

    return await response.json();
  },

  async create(data: CreateAnimalDto): Promise<Animal> {
    const token = getToken();
    if (!token) {
      throw new Error('No autenticado');
    }

    const { baseUrl, apiKey } = getApiConfig();

    const response = await fetch(`${baseUrl}/api/v1/ganado/animales`, {
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
      throw new Error(error.message || 'Error al crear animal');
    }

    // Invalidar caché de animales
    apiCache.invalidatePattern('animales:');

    return await response.json();
  },

  async update(id: string, data: UpdateAnimalDto): Promise<Animal> {
    const token = getToken();
    if (!token) {
      throw new Error('No autenticado');
    }

    const { baseUrl, apiKey } = getApiConfig();

    const response = await fetch(`${baseUrl}/api/v1/ganado/animales/${id}`, {
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
      throw new Error(error.message || 'Error al actualizar animal');
    }

    // Invalidar caché de animales
    apiCache.invalidatePattern('animales:');

    return await response.json();
  },

  async delete(id: string): Promise<void> {
    const token = getToken();
    if (!token) {
      throw new Error('No autenticado');
    }

    const { baseUrl, apiKey } = getApiConfig();

    const response = await fetch(`${baseUrl}/api/v1/ganado/animales/${id}`, {
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
      throw new Error(error.message || 'Error al eliminar animal');
    }

    // Invalidar caché de animales
    apiCache.invalidatePattern('animales:');
  },

  async getHistorial(id: string): Promise<Record<string, unknown>> {
    const token = getToken();
    if (!token) {
      throw new Error('No autenticado');
    }

    const { baseUrl, apiKey } = getApiConfig();

    const response = await fetch(
      `${baseUrl}/api/v1/ganado/animales/${id}/historial`,
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
      throw new Error(error.message || 'Error al obtener historial');
    }

    return await response.json();
  },

  async addIdentificador(animalId: string, data: CreateIdentificadorDto): Promise<Identificador> {
    const token = getToken();
    if (!token) {
      throw new Error('No autenticado');
    }

    const { baseUrl, apiKey } = getApiConfig();

    const response = await fetch(
      `${baseUrl}/api/v1/ganado/animales/${animalId}/identificadores`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: response.statusText,
      }));
      throw new Error(error.message || 'Error al agregar identificador');
    }

    return await response.json();
  },

  async bajaIdentificador(identificadorId: string, motivo: string): Promise<Identificador> {
    const token = getToken();
    if (!token) {
      throw new Error('No autenticado');
    }

    const { baseUrl, apiKey } = getApiConfig();

    const response = await fetch(
      `${baseUrl}/api/v1/ganado/identificadores/${identificadorId}/baja`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ motivo }),
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: response.statusText,
      }));
      throw new Error(error.message || 'Error al dar de baja identificador');
    }

    return await response.json();
  },
};
