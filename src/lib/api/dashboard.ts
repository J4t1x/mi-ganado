import { apiClient } from './client';

export interface DashboardStats {
  totalAnimales: number;
  animalesActivos: number;
  animalesVendidos: number;
  animalesMuertos: number;
  totalLotes: number;
  lotesActivos: number;
  pesajesUltimaSemana: number;
  movimientosUltimoMes: number;
  cambioAnimales: number;
  cambioLotes: number;
  cambioPesajes: number;
  cambioMovimientos: number;
}

export interface MovimientoReciente {
  id: string;
  tipo: string;
  fecha: string;
  estado: string;
  cantidadAnimales: number;
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
}

export interface EstablecimientoStat {
  id: string;
  nombre: string;
  tipo: string;
  cantidadAnimales: number;
}

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    return apiClient.get<DashboardStats>('/dashboard/stats');
  },

  async getMovimientosRecientes(limit = 5): Promise<MovimientoReciente[]> {
    return apiClient.get<MovimientoReciente[]>(`/dashboard/movimientos-recientes?limit=${limit}`);
  },

  async getEstablecimientosStats(): Promise<EstablecimientoStat[]> {
    return apiClient.get<EstablecimientoStat[]>('/dashboard/establecimientos-stats');
  },
};
