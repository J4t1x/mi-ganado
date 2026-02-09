import { PaginatedResponse } from '@/types';
import { apiCache } from './cache';
import { getApiConfig, getToken } from './config';

export type TipoMovimiento = 'TRASLADO' | 'VENTA' | 'COMPRA' | 'MUERTE' | 'AJUSTE';
export type EstadoMovimiento = 'BORRADOR' | 'CONFIRMADO' | 'INFORMADO';

export interface Movimiento {
    id: string;
    tipo: TipoMovimiento;
    fecha: string;
    establecimientoOrigenId?: string;
    establecimientoDestinoId?: string;
    titularOrigenId?: string;
    titularDestinoId?: string;
    estado: EstadoMovimiento;
    createdAt: string;
    updatedAt: string;
    establecimientoOrigen?: {
        id: string;
        nombre: string;
    };
    establecimientoDestino?: {
        id: string;
        nombre: string;
    };
    titularOrigen?: {
        id: string;
        nombreRazonSocial: string;
    };
    titularDestino?: {
        id: string;
        nombreRazonSocial: string;
    };
    cantidadAnimales?: number;
}

export interface CreateMovimientoDto {
    tipo: TipoMovimiento;
    fecha: string;
    establecimientoOrigenId?: string;
    establecimientoDestinoId?: string;
    titularOrigenId?: string;
    titularDestinoId?: string;
    animalIds: string[];
}

export interface MovimientosQueryParams {
    page?: number;
    limit?: number;
    tipo?: TipoMovimiento;
    estado?: EstadoMovimiento;
    establecimientoOrigenId?: string;
    establecimientoDestinoId?: string;
    fechaDesde?: string;
    fechaHasta?: string;
}

export interface MovimientosEstadisticas {
    traslados: number;
    ventas: number;
    compras: number;
    muertes: number;
    total: number;
}


export const movimientosService = {
    async getAll(params?: MovimientosQueryParams): Promise<PaginatedResponse<Movimiento>> {
        const token = getToken();
        if (!token) {
            throw new Error('No autenticado');
        }

        const { baseUrl, apiKey } = getApiConfig();
        const searchParams = new URLSearchParams();
        if (params?.page) searchParams.set('page', params.page.toString());
        if (params?.limit) searchParams.set('limit', params.limit.toString());
        if (params?.tipo) searchParams.set('tipo', params.tipo);
        if (params?.estado) searchParams.set('estado', params.estado);
        if (params?.establecimientoOrigenId) searchParams.set('establecimientoOrigenId', params.establecimientoOrigenId);
        if (params?.establecimientoDestinoId) searchParams.set('establecimientoDestinoId', params.establecimientoDestinoId);
        if (params?.fechaDesde) searchParams.set('fechaDesde', params.fechaDesde);
        if (params?.fechaHasta) searchParams.set('fechaHasta', params.fechaHasta);

        const query = searchParams.toString();
        const cacheKey = `movimientos:${query}`;

        // Verificar caché
        const cachedData = apiCache.get<PaginatedResponse<Movimiento>>(cacheKey);
        if (cachedData) {
            return cachedData;
        }

        const response = await fetch(
            `${baseUrl}/api/v1/ganado/movimientos${query ? `?${query}` : ''}`,
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
            throw new Error(error.message || 'Error al obtener movimientos');
        }

        const data = await response.json();
        
        // Guardar en caché por 5 minutos
        apiCache.set(cacheKey, data, 5 * 60 * 1000);

        return data;
    },

    async getById(id: string): Promise<Movimiento> {
        const token = getToken();
        if (!token) {
            throw new Error('No autenticado');
        }

        const { baseUrl, apiKey } = getApiConfig();

        const response = await fetch(`${baseUrl}/api/v1/ganado/movimientos/${id}`, {
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
            throw new Error(error.message || 'Movimiento no encontrado');
        }

        return await response.json();
    },

    async create(data: CreateMovimientoDto): Promise<Movimiento> {
        const token = getToken();
        if (!token) {
            throw new Error('No autenticado');
        }

        const { baseUrl, apiKey } = getApiConfig();

        const response = await fetch(`${baseUrl}/api/v1/ganado/movimientos`, {
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
            throw new Error(error.message || 'Error al crear movimiento');
        }

        // Invalidar caché de movimientos y animales
        apiCache.invalidatePattern('movimientos:');
        apiCache.invalidatePattern('animales:');

        return await response.json();
    },

    async confirmar(id: string): Promise<Movimiento> {
        const token = getToken();
        if (!token) {
            throw new Error('No autenticado');
        }

        const { baseUrl, apiKey } = getApiConfig();

        const response = await fetch(`${baseUrl}/api/v1/ganado/movimientos/${id}/confirmar`, {
            method: 'PATCH',
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
            throw new Error(error.message || 'Error al confirmar movimiento');
        }

        // Invalidar caché de movimientos
        apiCache.invalidatePattern('movimientos:');

        return await response.json();
    },

    async getEstadisticas(): Promise<MovimientosEstadisticas> {
        const token = getToken();
        if (!token) {
            throw new Error('No autenticado');
        }

        const { baseUrl, apiKey } = getApiConfig();

        const response = await fetch(`${baseUrl}/api/v1/ganado/movimientos/estadisticas`, {
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
            throw new Error(error.message || 'Error al obtener estadísticas');
        }

        return await response.json();
    },

    async addDocumento(
        movimientoId: string,
        dto: { tipo: string; folio?: string; fecha?: string; archivoUrl?: string }
    ): Promise<Record<string, unknown>> {
        const token = getToken();
        if (!token) {
            throw new Error('No autenticado');
        }

        const { baseUrl, apiKey } = getApiConfig();

        const response = await fetch(`${baseUrl}/api/v1/ganado/movimientos/${movimientoId}/documentos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': apiKey,
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(dto),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({
                message: response.statusText,
            }));
            throw new Error(error.message || 'Error al agregar documento');
        }

        return await response.json();
    },
};
