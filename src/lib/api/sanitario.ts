import { PaginatedResponse } from '@/types';
import { apiCache } from './cache';

// Types
export interface EventoSanitario {
  id: string;
  tipo: 'VACUNACION' | 'TRATAMIENTO' | 'DESPARASITACION' | 'DIAGNOSTICO' | 'OTRO';
  fecha: string;
  fechaProxima?: string;
  producto: string;
  dosis?: string;
  viaAplicacion?: string;
  lote?: string;
  periodoResguardo?: number; // días
  veterinario?: string;
  observaciones?: string;
  animalId?: string;
  loteId?: string;
  establecimientoId?: string;
  estado: 'PROGRAMADO' | 'APLICADO' | 'VENCIDO' | 'CANCELADO';
  createdAt: string;
  updatedAt: string;
  animal?: {
    id: string;
    identificadores?: Array<{ tipo: string; codigo: string; activo: boolean }>;
  };
  loteRef?: {
    id: string;
    nombre: string;
  };
}

export interface CreateEventoSanitarioDto {
  tipo: EventoSanitario['tipo'];
  fecha: string;
  fechaProxima?: string;
  producto: string;
  dosis?: string;
  viaAplicacion?: string;
  lote?: string;
  periodoResguardo?: number;
  veterinario?: string;
  observaciones?: string;
  animalId?: string;
  loteId?: string;
  establecimientoId?: string;
  estado?: EventoSanitario['estado'];
}

export interface UpdateEventoSanitarioDto {
  tipo?: EventoSanitario['tipo'];
  fecha?: string;
  fechaProxima?: string;
  producto?: string;
  dosis?: string;
  viaAplicacion?: string;
  lote?: string;
  periodoResguardo?: number;
  veterinario?: string;
  observaciones?: string;
  estado?: EventoSanitario['estado'];
}

export interface SanitarioQueryParams {
  page?: number;
  limit?: number;
  tipo?: EventoSanitario['tipo'];
  estado?: EventoSanitario['estado'];
  animalId?: string;
  loteId?: string;
  establecimientoId?: string;
  fechaDesde?: string;
  fechaHasta?: string;
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

export const sanitarioService = {
  async getAll(params?: SanitarioQueryParams): Promise<PaginatedResponse<EventoSanitario>> {
    const token = getToken();
    if (!token) throw new Error('No autenticado');

    const { baseUrl, apiKey } = getApiConfig();
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.tipo) searchParams.set('tipo', params.tipo);
    if (params?.estado) searchParams.set('estado', params.estado);
    if (params?.animalId) searchParams.set('animalId', params.animalId);
    if (params?.loteId) searchParams.set('loteId', params.loteId);
    if (params?.establecimientoId) searchParams.set('establecimientoId', params.establecimientoId);
    if (params?.fechaDesde) searchParams.set('fechaDesde', params.fechaDesde);
    if (params?.fechaHasta) searchParams.set('fechaHasta', params.fechaHasta);

    const query = searchParams.toString();
    const cacheKey = `sanitario:${query}`;

    const cachedData = apiCache.get<PaginatedResponse<EventoSanitario>>(cacheKey);
    if (cachedData) return cachedData;

    const response = await fetch(
      `${baseUrl}/api/v1/ganado/eventos-sanitarios${query ? `?${query}` : ''}`,
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
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(error.message || 'Error al obtener eventos sanitarios');
    }

    const data = await response.json();
    apiCache.set(cacheKey, data, 5 * 60 * 1000);
    return data;
  },

  async getById(id: string): Promise<EventoSanitario> {
    const token = getToken();
    if (!token) throw new Error('No autenticado');

    const { baseUrl, apiKey } = getApiConfig();

    const response = await fetch(`${baseUrl}/api/v1/ganado/eventos-sanitarios/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(error.message || 'Evento no encontrado');
    }

    return await response.json();
  },

  async create(data: CreateEventoSanitarioDto): Promise<EventoSanitario> {
    const token = getToken();
    if (!token) throw new Error('No autenticado');

    const { baseUrl, apiKey } = getApiConfig();

    const response = await fetch(`${baseUrl}/api/v1/ganado/eventos-sanitarios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(error.message || 'Error al crear evento sanitario');
    }

    apiCache.invalidatePattern('sanitario:');
    return await response.json();
  },

  async update(id: string, data: UpdateEventoSanitarioDto): Promise<EventoSanitario> {
    const token = getToken();
    if (!token) throw new Error('No autenticado');

    const { baseUrl, apiKey } = getApiConfig();

    const response = await fetch(`${baseUrl}/api/v1/ganado/eventos-sanitarios/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(error.message || 'Error al actualizar evento sanitario');
    }

    apiCache.invalidatePattern('sanitario:');
    return await response.json();
  },

  async delete(id: string): Promise<void> {
    const token = getToken();
    if (!token) throw new Error('No autenticado');

    const { baseUrl, apiKey } = getApiConfig();

    const response = await fetch(`${baseUrl}/api/v1/ganado/eventos-sanitarios/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(error.message || 'Error al eliminar evento sanitario');
    }

    apiCache.invalidatePattern('sanitario:');
  },
};
