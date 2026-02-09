import { PaginatedResponse } from '@/types';
import { apiCache } from './cache';

export interface SesionPesaje {
    id: string;
    fecha: string;
    loteId?: string;
    equipo?: string;
    operador?: string;
    observaciones?: string;
    createdAt: string;
    updatedAt: string;
    lote?: {
        id: string;
        nombre: string;
    };
    totalPesajes?: number;
    pesoPromedio?: number | null;
}

export interface Pesaje {
    id: string;
    sesionId: string;
    animalId: string;
    peso: number;
    fechaHora: string;
    origenDato: 'XR5000' | 'MANUAL';
    valido: boolean;
    animal?: {
        id: string;
        identificadores: Array<{
            tipo: string;
            codigo: string;
        }>;
    };
}

export interface CreateSesionPesajeDto {
    fecha: string;
    loteId?: string;
    equipo?: string;
    operador?: string;
    observaciones?: string;
}

export interface CreatePesajeDto {
    animalId: string;
    peso: number;
    fechaHora?: string;
    origenDato?: 'XR5000' | 'MANUAL';
    valido?: boolean;
}

export interface SesionesQueryParams {
    page?: number;
    limit?: number;
    loteId?: string;
    operador?: string;
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

export const pesajesService = {
    async getSesiones(params?: SesionesQueryParams): Promise<PaginatedResponse<SesionPesaje>> {
        const token = getToken();
        if (!token) {
            throw new Error('No autenticado');
        }

        const { baseUrl, apiKey } = getApiConfig();
        const searchParams = new URLSearchParams();
        if (params?.page) searchParams.set('page', params.page.toString());
        if (params?.limit) searchParams.set('limit', params.limit.toString());
        if (params?.loteId) searchParams.set('loteId', params.loteId);
        if (params?.operador) searchParams.set('operador', params.operador);
        if (params?.fechaDesde) searchParams.set('fechaDesde', params.fechaDesde);
        if (params?.fechaHasta) searchParams.set('fechaHasta', params.fechaHasta);

        const query = searchParams.toString();
        const cacheKey = `pesajes:${query}`;

        // Verificar caché
        const cachedData = apiCache.get<PaginatedResponse<SesionPesaje>>(cacheKey);
        if (cachedData) {
            return cachedData;
        }

        const response = await fetch(
            `${baseUrl}/api/v1/ganado/sesiones-pesaje${query ? `?${query}` : ''}`,
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
            throw new Error(error.message || 'Error al obtener sesiones de pesaje');
        }

        const data = await response.json();
        
        // Guardar en caché por 5 minutos
        apiCache.set(cacheKey, data, 5 * 60 * 1000);

        return data;
    },

    async getSesionById(id: string): Promise<SesionPesaje & { pesajes: Pesaje[]; estadisticas: Record<string, unknown> }> {
        const token = getToken();
        if (!token) {
            throw new Error('No autenticado');
        }

        const { baseUrl, apiKey } = getApiConfig();

        const response = await fetch(`${baseUrl}/api/v1/ganado/sesiones-pesaje/${id}`, {
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
            throw new Error(error.message || 'Sesión no encontrada');
        }

        return await response.json();
    },

    async createSesion(data: CreateSesionPesajeDto): Promise<SesionPesaje> {
        const token = getToken();
        if (!token) {
            throw new Error('No autenticado');
        }

        const { baseUrl, apiKey } = getApiConfig();

        const response = await fetch(`${baseUrl}/api/v1/ganado/sesiones-pesaje`, {
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
            throw new Error(error.message || 'Error al crear sesión');
        }

        // Invalidar caché de pesajes
        apiCache.invalidatePattern('pesajes:');

        return await response.json();
    },

    async addPesaje(sesionId: string, data: CreatePesajeDto): Promise<Pesaje> {
        const token = getToken();
        if (!token) {
            throw new Error('No autenticado');
        }

        const { baseUrl, apiKey } = getApiConfig();

        const response = await fetch(`${baseUrl}/api/v1/ganado/sesiones-pesaje/${sesionId}/pesajes`, {
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
            throw new Error(error.message || 'Error al agregar pesaje');
        }

        // Invalidar caché de pesajes
        apiCache.invalidatePattern('pesajes:');

        return await response.json();
    },

    async importarXR5000(
        data: Array<{ codigo: string; peso: number; fechaHora?: string }>,
        loteId?: string,
        operador?: string
    ): Promise<{ sesionId: string; exitosos: number; fallidos: number; errores: string[] }> {
        const token = getToken();
        if (!token) {
            throw new Error('No autenticado');
        }

        const { baseUrl, apiKey } = getApiConfig();

        const response = await fetch(`${baseUrl}/api/v1/ganado/sesiones-pesaje/importar-xr5000`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': apiKey,
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ data, loteId, operador }),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({
                message: response.statusText,
            }));
            throw new Error(error.message || 'Error al importar datos');
        }

        // Invalidar caché de pesajes
        apiCache.invalidatePattern('pesajes:');

        return await response.json();
    },

    async deletePesaje(pesajeId: string): Promise<void> {
        const token = getToken();
        if (!token) {
            throw new Error('No autenticado');
        }

        const { baseUrl, apiKey } = getApiConfig();

        const response = await fetch(`${baseUrl}/api/v1/ganado/pesajes/${pesajeId}`, {
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
            throw new Error(error.message || 'Error al eliminar pesaje');
        }

        // Invalidar caché de pesajes
        apiCache.invalidatePattern('pesajes:');
    },
};
