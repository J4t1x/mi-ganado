'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SanitarioStats, dashboardService } from '@/lib/api/dashboard';
import { AlertasSanitarias } from './alertas-sanitarias';
import { IncidenciasMapa } from './incidencias-mapa';
import { IncidenciasTipoChart } from './incidencias-tipo-chart';
import { RefreshButton } from '@/components/dashboard/refresh-button';
import { ErrorState } from '@/components/dashboard/error-state';
import { FiltrosTemporales, PeriodoTiempo } from '@/components/dashboard/filtros-temporales';
import { toast } from 'sonner';
import { AlertCircle, Calendar } from 'lucide-react';

export function SanitarioDashboard() {
  const [stats, setStats] = useState<SanitarioStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [periodo, setPeriodo] = useState<PeriodoTiempo>('6m');
  const [tipoFiltro, setTipoFiltro] = useState<string | undefined>(undefined);
  const [establecimientoFiltro, setEstablecimientoFiltro] = useState<string | undefined>(undefined);

  const loadSanitarioData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      const sanitarioData = await dashboardService.getSanitarioStats({
        tipo: tipoFiltro,
        establecimiento: establecimientoFiltro,
        periodo: periodo,
      });
      
      setStats(sanitarioData);
      setError(null);
      setLastUpdate(new Date());
      
      if (isRefresh) {
        toast.success('Datos sanitarios actualizados');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar datos sanitarios';
      setError(errorMessage);
      if (!isRefresh) {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadSanitarioData();
  }, [tipoFiltro, establecimientoFiltro, periodo]);

  // Extraer establecimientos únicos para el filtro (sin renders condicionales de Select)
  const tiposEventos: string[] = [];
  const establecimientos: string[] = [];

  if (loading && !stats) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Alertas Sanitarias</h2>
          <div className="flex items-center gap-2">
            <div className="h-9 w-24 bg-muted rounded-md animate-pulse"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="h-6 w-48 bg-muted rounded-md animate-pulse mb-2"></div>
              <div className="h-4 w-64 bg-muted rounded-md animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] bg-muted/20 rounded-md animate-pulse"></div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="h-6 w-40 bg-muted rounded-md animate-pulse mb-2"></div>
              <div className="h-4 w-48 bg-muted rounded-md animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] bg-muted/20 rounded-md animate-pulse"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error && !stats) {
    return <ErrorState message={error} onRetry={() => loadSanitarioData()} />;
  }

  if (!stats) {
    return null;
  }

  // Calcular estadísticas para las tarjetas de resumen
  const totalEventosProximos = stats.proximosEventos.length;
  const eventosAltaPrioridad = stats.proximosEventos.filter(e => e.prioridad === 'alta').length;
  const eventosPendientes = stats.proximosEventos.filter(e => {
    const fechaEvento = new Date(e.fecha);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return fechaEvento <= hoy;
  }).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-semibold">Alertas Sanitarias</h2>
        <div className="flex flex-wrap items-center gap-2">
          <FiltrosTemporales 
            periodo={periodo} 
            onChange={setPeriodo} 
          />
          
          <RefreshButton 
            onClick={() => loadSanitarioData(true)} 
            loading={refreshing}
            lastUpdate={lastUpdate || undefined}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Eventos Próximos
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEventosProximos}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Eventos sanitarios programados
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Alta Prioridad
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{eventosAltaPrioridad}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Eventos que requieren atención inmediata
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pendientes Hoy
            </CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{eventosPendientes}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Eventos programados para hoy
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AlertasSanitarias 
          eventosRecientes={stats.eventosRecientes} 
          proximosEventos={stats.proximosEventos} 
        />
        <div className="space-y-6">
          <IncidenciasTipoChart datos={stats.incidenciasPorTipo} />
          <IncidenciasMapa datos={stats.incidenciasPorUbicacion} />
        </div>
      </div>
    </div>
  );
}
