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

// Nuevas interfaces para componentes de análisis financiero
export interface FinancieroStats {
  rentabilidad: number; // Porcentaje de rentabilidad
  margenBruto: number; // Margen bruto en porcentaje
  ingresosTotales: number; // Ingresos totales en el período
  costosTotales: number; // Costos totales en el período
  tendenciaPrecios: PrecioHistorico[];
  costosPorCategoria: CostoCategoria[];
  cambioRentabilidad: number; // Cambio en puntos porcentuales
}

export interface PrecioHistorico {
  fecha: string;
  precioVenta: number;
  precioCompra: number;
}

export interface CostoCategoria {
  categoria: string;
  monto: number;
  porcentaje: number;
}

// Interfaces para análisis de peso y crecimiento
export interface PesoStats {
  pesoPorCategoria: PesoCategoria[];
  gananciaDiaria: GananciaDiaria[];
  proyeccionPeso: ProyeccionPeso[];
  pesoPromedio: number;
  gananciaPromedio: number;
  cambioGanancia: number; // Cambio en porcentaje
}

export interface PesoCategoria {
  categoria: string;
  pesoPromedio: number;
  edadPromedio: number;
}

export interface GananciaDiaria {
  loteId: string;
  loteNombre: string;
  raza: string;
  gananciaPromedio: number; // kg/día
}

export interface ProyeccionPeso {
  fecha: string;
  pesoEstimado: number;
}

// Interfaces para componentes sanitarios
export interface SanitarioStats {
  eventosRecientes: EventoSanitario[];
  proximosEventos: EventoSanitario[];
  incidenciasPorTipo: IncidenciaSanitaria[];
  incidenciasPorUbicacion: IncidenciaUbicacion[];
}

export interface EventoSanitario {
  id: string;
  tipo: string;
  descripcion: string;
  fecha: string;
  estado: string;
  cantidadAnimales: number;
  establecimiento?: string;
  lote?: string;
  prioridad: 'alta' | 'media' | 'baja';
}

export interface IncidenciaSanitaria {
  tipo: string;
  cantidad: number;
  porcentaje: number;
}

export interface IncidenciaUbicacion {
  establecimientoId: string;
  establecimientoNombre: string;
  incidencias: number;
}

// Interfaces para métricas de eficiencia
export interface EficienciaStats {
  conversionAlimenticia: number;
  costoPorKgProducido: number;
  tasaReproduccion: number;
  tasaMortalidad: number;
  comparativaHistorica: ComparativaEficiencia[];
  comparativaSector: ComparativaEficiencia[];
}

export interface ComparativaEficiencia {
  metrica: string;
  valorActual: number;
  valorComparativo: number;
  diferenciaPorcentual: number;
}

// Interfaces para análisis predictivo
export interface PrediccionStats {
  proyeccionInventario: ProyeccionInventario[];
  alertasUmbrales: AlertaUmbral[];
  recomendaciones: Recomendacion[];
}

export interface ProyeccionInventario {
  fecha: string;
  cantidadEstimada: number;
}

export interface AlertaUmbral {
  tipo: string;
  metrica: string;
  valorActual: number;
  umbral: number;
  criticidad: 'alta' | 'media' | 'baja';
}

export interface Recomendacion {
  tipo: string;
  descripcion: string;
  impactoEstimado: string;
  prioridad: 'alta' | 'media' | 'baja';
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
  
  // Nuevos endpoints para análisis financiero
  async getFinancieroStats(periodo?: string): Promise<FinancieroStats> {
    const query = periodo ? `?periodo=${periodo}` : '';
    return apiClient.get<FinancieroStats>(`/dashboard/financiero-stats${query}`);
  },
  
  // Endpoints para análisis de peso y crecimiento
  async getPesoStats(filtros?: { categoria?: string, raza?: string, periodo?: string }): Promise<PesoStats> {
    const params = new URLSearchParams();
    if (filtros?.categoria) params.append('categoria', filtros.categoria);
    if (filtros?.raza) params.append('raza', filtros.raza);
    if (filtros?.periodo) params.append('periodo', filtros.periodo);
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiClient.get<PesoStats>(`/dashboard/peso-stats${query}`);
  },
  
  // Endpoints para componentes sanitarios
  async getSanitarioStats(filtros?: { tipo?: string, establecimiento?: string, periodo?: string }): Promise<SanitarioStats> {
    const params = new URLSearchParams();
    if (filtros?.tipo) params.append('tipo', filtros.tipo);
    if (filtros?.establecimiento) params.append('establecimiento', filtros.establecimiento);
    if (filtros?.periodo) params.append('periodo', filtros.periodo);
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiClient.get<SanitarioStats>(`/dashboard/sanitario-stats${query}`);
  },
  
  // Endpoints para métricas de eficiencia
  async getEficienciaStats(periodo?: string): Promise<EficienciaStats> {
    const query = periodo ? `?periodo=${periodo}` : '';
    return apiClient.get<EficienciaStats>(`/dashboard/eficiencia-stats${query}`);
  },
  
  // Endpoints para análisis predictivo
  async getPrediccionStats(horizonte?: number): Promise<PrediccionStats> {
    const query = horizonte ? `?horizonte=${horizonte}` : '';
    return apiClient.get<PrediccionStats>(`/dashboard/predicciones${query}`);
  },
};
