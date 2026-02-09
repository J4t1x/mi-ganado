import { PaginatedResponse } from '@/types';
import { apiCache } from './cache';
import { getApiConfig, getToken } from './config';

// Types
export type TipoCosto = 'ALIMENTACION' | 'SANITARIO' | 'MANO_OBRA' | 'TRANSPORTE' | 'INFRAESTRUCTURA' | 'OTRO';
export type FormaPago = 'EFECTIVO' | 'TRANSFERENCIA' | 'CHEQUE' | 'CREDITO' | 'OTRO';

export interface Costo {
  id: string;
  tipo: TipoCosto;
  concepto: string;
  monto: number;
  fecha: string;
  animalId?: string;
  loteId?: string;
  establecimientoId?: string;
  proveedor?: string;
  documento?: string;
  observaciones?: string;
  createdAt: string;
  updatedAt: string;
  animal?: {
    id: string;
    identificadores?: Array<{ tipo: string; codigo: string; activo: boolean }>;
  };
  lote?: { id: string; nombre: string };
  establecimiento?: { id: string; nombre: string };
}

export interface Venta {
  id: string;
  movimientoId?: string;
  fecha: string;
  comprador: string;
  rutComprador?: string;
  cantidadAnimales: number;
  precioUnitario: number;
  precioTotal: number;
  formaPago: FormaPago;
  factura?: string;
  pagado: boolean;
  fechaPago?: string;
  observaciones?: string;
  establecimientoId?: string;
  loteId?: string;
  createdAt: string;
  updatedAt: string;
  establecimiento?: { id: string; nombre: string };
  lote?: { id: string; nombre: string };
}

export interface ResumenFinanciero {
  totalCostos: number;
  totalVentas: number;
  rentabilidad: number;
  costosPorTipo: Array<{ tipo: TipoCosto; total: number; count: number }>;
  ventasMes: Array<{ mes: string; total: number; count: number }>;
  costosMes: Array<{ mes: string; total: number }>;
}

export interface CreateCostoDto {
  tipo: TipoCosto;
  concepto: string;
  monto: number;
  fecha: string;
  animalId?: string;
  loteId?: string;
  establecimientoId?: string;
  proveedor?: string;
  documento?: string;
  observaciones?: string;
}

export interface CreateVentaDto {
  movimientoId?: string;
  fecha: string;
  comprador: string;
  rutComprador?: string;
  cantidadAnimales: number;
  precioUnitario: number;
  precioTotal: number;
  formaPago: FormaPago;
  factura?: string;
  pagado?: boolean;
  fechaPago?: string;
  observaciones?: string;
  establecimientoId?: string;
  loteId?: string;
}

export interface FinancieroQueryParams {
  page?: number;
  limit?: number;
  tipo?: TipoCosto;
  establecimientoId?: string;
  loteId?: string;
  fechaDesde?: string;
  fechaHasta?: string;
}

function buildHeaders(token: string, apiKey: string) {
  return {
    'Content-Type': 'application/json',
    'X-API-Key': apiKey,
    Authorization: `Bearer ${token}`,
  };
}

export const costosService = {
  async getAll(params?: FinancieroQueryParams): Promise<PaginatedResponse<Costo>> {
    const token = getToken();
    if (!token) throw new Error('No autenticado');
    const { baseUrl, apiKey } = getApiConfig();

    const sp = new URLSearchParams();
    if (params?.page) sp.set('page', params.page.toString());
    if (params?.limit) sp.set('limit', params.limit.toString());
    if (params?.tipo) sp.set('tipo', params.tipo);
    if (params?.establecimientoId) sp.set('establecimientoId', params.establecimientoId);
    if (params?.loteId) sp.set('loteId', params.loteId);
    if (params?.fechaDesde) sp.set('fechaDesde', params.fechaDesde);
    if (params?.fechaHasta) sp.set('fechaHasta', params.fechaHasta);

    const query = sp.toString();
    const cacheKey = `costos:${query}`;
    const cached = apiCache.get<PaginatedResponse<Costo>>(cacheKey);
    if (cached) return cached;

    const res = await fetch(`${baseUrl}/api/v1/ganado/costos${query ? `?${query}` : ''}`, {
      headers: buildHeaders(token, apiKey),
      cache: 'no-store',
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(err.message || 'Error al obtener costos');
    }
    const data = await res.json();
    apiCache.set(cacheKey, data, 5 * 60 * 1000);
    return data;
  },

  async create(dto: CreateCostoDto): Promise<Costo> {
    const token = getToken();
    if (!token) throw new Error('No autenticado');
    const { baseUrl, apiKey } = getApiConfig();

    const res = await fetch(`${baseUrl}/api/v1/ganado/costos`, {
      method: 'POST',
      headers: buildHeaders(token, apiKey),
      body: JSON.stringify(dto),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(err.message || 'Error al crear costo');
    }
    apiCache.invalidatePattern('costos:');
    return res.json();
  },

  async update(id: string, dto: Partial<CreateCostoDto>): Promise<Costo> {
    const token = getToken();
    if (!token) throw new Error('No autenticado');
    const { baseUrl, apiKey } = getApiConfig();

    const res = await fetch(`${baseUrl}/api/v1/ganado/costos/${id}`, {
      method: 'PATCH',
      headers: buildHeaders(token, apiKey),
      body: JSON.stringify(dto),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(err.message || 'Error al actualizar costo');
    }
    apiCache.invalidatePattern('costos:');
    return res.json();
  },

  async delete(id: string): Promise<void> {
    const token = getToken();
    if (!token) throw new Error('No autenticado');
    const { baseUrl, apiKey } = getApiConfig();

    const res = await fetch(`${baseUrl}/api/v1/ganado/costos/${id}`, {
      method: 'DELETE',
      headers: buildHeaders(token, apiKey),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(err.message || 'Error al eliminar costo');
    }
    apiCache.invalidatePattern('costos:');
  },
};

export const ventasService = {
  async getAll(params?: FinancieroQueryParams): Promise<PaginatedResponse<Venta>> {
    const token = getToken();
    if (!token) throw new Error('No autenticado');
    const { baseUrl, apiKey } = getApiConfig();

    const sp = new URLSearchParams();
    if (params?.page) sp.set('page', params.page.toString());
    if (params?.limit) sp.set('limit', params.limit.toString());
    if (params?.establecimientoId) sp.set('establecimientoId', params.establecimientoId);
    if (params?.loteId) sp.set('loteId', params.loteId);
    if (params?.fechaDesde) sp.set('fechaDesde', params.fechaDesde);
    if (params?.fechaHasta) sp.set('fechaHasta', params.fechaHasta);

    const query = sp.toString();
    const cacheKey = `ventas:${query}`;
    const cached = apiCache.get<PaginatedResponse<Venta>>(cacheKey);
    if (cached) return cached;

    const res = await fetch(`${baseUrl}/api/v1/ganado/ventas${query ? `?${query}` : ''}`, {
      headers: buildHeaders(token, apiKey),
      cache: 'no-store',
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(err.message || 'Error al obtener ventas');
    }
    const data = await res.json();
    apiCache.set(cacheKey, data, 5 * 60 * 1000);
    return data;
  },

  async create(dto: CreateVentaDto): Promise<Venta> {
    const token = getToken();
    if (!token) throw new Error('No autenticado');
    const { baseUrl, apiKey } = getApiConfig();

    const res = await fetch(`${baseUrl}/api/v1/ganado/ventas`, {
      method: 'POST',
      headers: buildHeaders(token, apiKey),
      body: JSON.stringify(dto),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(err.message || 'Error al crear venta');
    }
    apiCache.invalidatePattern('ventas:');
    return res.json();
  },

  async update(id: string, dto: Partial<CreateVentaDto>): Promise<Venta> {
    const token = getToken();
    if (!token) throw new Error('No autenticado');
    const { baseUrl, apiKey } = getApiConfig();

    const res = await fetch(`${baseUrl}/api/v1/ganado/ventas/${id}`, {
      method: 'PATCH',
      headers: buildHeaders(token, apiKey),
      body: JSON.stringify(dto),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(err.message || 'Error al actualizar venta');
    }
    apiCache.invalidatePattern('ventas:');
    return res.json();
  },

  async delete(id: string): Promise<void> {
    const token = getToken();
    if (!token) throw new Error('No autenticado');
    const { baseUrl, apiKey } = getApiConfig();

    const res = await fetch(`${baseUrl}/api/v1/ganado/ventas/${id}`, {
      method: 'DELETE',
      headers: buildHeaders(token, apiKey),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(err.message || 'Error al eliminar venta');
    }
    apiCache.invalidatePattern('ventas:');
  },

  async marcarPagada(id: string): Promise<Venta> {
    const token = getToken();
    if (!token) throw new Error('No autenticado');
    const { baseUrl, apiKey } = getApiConfig();

    const res = await fetch(`${baseUrl}/api/v1/ganado/ventas/${id}/pagar`, {
      method: 'PATCH',
      headers: buildHeaders(token, apiKey),
      body: JSON.stringify({ pagado: true, fechaPago: new Date().toISOString() }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(err.message || 'Error al marcar como pagada');
    }
    apiCache.invalidatePattern('ventas:');
    return res.json();
  },
};
