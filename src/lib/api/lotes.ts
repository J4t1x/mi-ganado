import {
    Lote,
    CreateLoteDto,
    UpdateLoteDto,
    PaginatedResponse,
    AnimalWithRelations,
} from '@/types';
import { apiCache } from './cache';
import { getApiConfig, getToken } from './config';

export interface LotesQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    estado?: string;
    establecimientoId?: string;
}

export interface LoteWithStats {
    id: string;
    nombre: string;
    descripcion?: string;
    estado: string;
    establecimientoId: string;
    createdAt: string;
    updatedAt: string;
    pesoPromedio: number | null;
    _count?: {
        animales: number;
        sesionesPesaje: number;
    };
    establecimiento?: {
        id: string;
        nombre: string;
    };
}


export const lotesService = {
    async getAll(params?: LotesQueryParams): Promise<PaginatedResponse<LoteWithStats>> {
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
        if (params?.establecimientoId) searchParams.set('establecimientoId', params.establecimientoId);

        const query = searchParams.toString();
        const cacheKey = `lotes:${query}`;

        // Verificar caché
        const cachedData = apiCache.get<PaginatedResponse<LoteWithStats>>(cacheKey);
        if (cachedData) {
            return cachedData;
        }

        const response = await fetch(
            `${baseUrl}/api/v1/ganado/lotes${query ? `?${query}` : ''}`,
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
            throw new Error(error.message || 'Error al obtener lotes');
        }

        const data = await response.json();
        
        // Guardar en caché por 5 minutos
        apiCache.set(cacheKey, data, 5 * 60 * 1000);

        return data;
    },

    async getById(id: string): Promise<LoteWithStats> {
        const token = getToken();
        if (!token) {
            throw new Error('No autenticado');
        }

        const { baseUrl, apiKey } = getApiConfig();

        const response = await fetch(`${baseUrl}/api/v1/ganado/lotes/${id}`, {
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
            throw new Error(error.message || 'Lote no encontrado');
        }

        return await response.json();
    },

    async create(data: CreateLoteDto): Promise<Lote> {
        const token = getToken();
        if (!token) {
            throw new Error('No autenticado');
        }

        const { baseUrl, apiKey } = getApiConfig();

        const response = await fetch(`${baseUrl}/api/v1/ganado/lotes`, {
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
            throw new Error(error.message || 'Error al crear lote');
        }

        // Invalidar caché de lotes
        apiCache.invalidatePattern('lotes:');

        return await response.json();
    },

    async update(id: string, data: UpdateLoteDto): Promise<Lote> {
        const token = getToken();
        if (!token) {
            throw new Error('No autenticado');
        }

        const { baseUrl, apiKey } = getApiConfig();

        const response = await fetch(`${baseUrl}/api/v1/ganado/lotes/${id}`, {
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
            throw new Error(error.message || 'Error al actualizar lote');
        }

        // Invalidar caché de lotes
        apiCache.invalidatePattern('lotes:');

        return await response.json();
    },

    async delete(id: string): Promise<void> {
        const token = getToken();
        if (!token) {
            throw new Error('No autenticado');
        }

        const { baseUrl, apiKey } = getApiConfig();

        const response = await fetch(`${baseUrl}/api/v1/ganado/lotes/${id}`, {
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
            throw new Error(error.message || 'Error al eliminar lote');
        }

        // Invalidar caché de lotes
        apiCache.invalidatePattern('lotes:');
    },

    async addAnimales(loteId: string, animalIds: string[]): Promise<LoteWithStats> {
        const token = getToken();
        if (!token) {
            throw new Error('No autenticado');
        }

        const { baseUrl, apiKey } = getApiConfig();

        const response = await fetch(`${baseUrl}/api/v1/ganado/lotes/${loteId}/animales`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': apiKey,
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ animalIds }),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({
                message: response.statusText,
            }));
            throw new Error(error.message || 'Error al agregar animales');
        }

        // Invalidar caché de lotes y animales
        apiCache.invalidatePattern('lotes:');
        apiCache.invalidatePattern('animales:');

        return await response.json();
    },

    async getAnimales(loteId: string): Promise<AnimalWithRelations[]> {
        const token = getToken();
        if (!token) {
            throw new Error('No autenticado');
        }

        const { baseUrl, apiKey } = getApiConfig();

        const response = await fetch(`${baseUrl}/api/v1/ganado/lotes/${loteId}/animales`, {
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
            throw new Error(error.message || 'Error al obtener animales del lote');
        }

        return await response.json();
    },

    async removeAnimales(loteId: string, animalIds: string[]): Promise<LoteWithStats> {
        const token = getToken();
        if (!token) {
            throw new Error('No autenticado');
        }

        const { baseUrl, apiKey } = getApiConfig();

        const response = await fetch(`${baseUrl}/api/v1/ganado/lotes/${loteId}/animales`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': apiKey,
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ animalIds }),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({
                message: response.statusText,
            }));
            throw new Error(error.message || 'Error al remover animales del lote');
        }

        // Invalidar caché de lotes y animales
        apiCache.invalidatePattern('lotes:');
        apiCache.invalidatePattern('animales:');

        return await response.json();
    },
};
