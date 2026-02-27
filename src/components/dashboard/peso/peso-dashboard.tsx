'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PesoStats, dashboardService } from '@/lib/api/dashboard';
import { CurvaCrecimientoChart } from './curva-crecimiento-chart';
import { GananciaDiariaChart } from './ganancia-diaria-chart';
import { ProyeccionPesoChart } from './proyeccion-peso-chart';
import { RefreshButton } from '@/components/dashboard/refresh-button';
import { ErrorState } from '@/components/dashboard/error-state';
import { FiltrosTemporales, PeriodoTiempo } from '@/components/dashboard/filtros-temporales';
import { toast } from 'sonner';
import { TrendingUp, TrendingDown, Scale, Activity } from 'lucide-react';

export function PesoDashboard() {
  const [stats, setStats] = useState<PesoStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [periodo, setPeriodo] = useState<PeriodoTiempo>('6m');
  const [categoriaFiltro, setCategoriaFiltro] = useState<string | undefined>(undefined);
  const [razaFiltro, setRazaFiltro] = useState<string | undefined>(undefined);

  const loadPesoData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      const pesoData = await dashboardService.getPesoStats({
        categoria: categoriaFiltro,
        raza: razaFiltro,
        periodo,
      });
      
      setStats(pesoData);
      setError(null);
      setLastUpdate(new Date());
      
      if (isRefresh) {
        toast.success('Datos de peso actualizados');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar datos de peso';
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
    loadPesoData();
  }, [periodo, categoriaFiltro, razaFiltro]);

  if (loading && !stats) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Análisis de Peso y Crecimiento</h2>
          <div className="flex items-center gap-2">
            <div className="h-9 w-24 bg-muted rounded-md animate-pulse"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="h-4 w-24 bg-muted rounded-md animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 w-20 bg-muted rounded-md animate-pulse mb-2"></div>
                <div className="h-3 w-32 bg-muted rounded-md animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
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
    return <ErrorState message={error} onRetry={() => loadPesoData()} />;
  }

  if (!stats) {
    return null;
  }

  // Extraer categorías únicas de los datos
  const categorias = Array.from(new Set(stats.pesoPorCategoria.map(item => item.categoria)));

  // Crear tarjetas de estadísticas
  const statsCards = [
    {
      name: 'Peso Promedio',
      value: `${stats.pesoPromedio.toFixed(1)} kg`,
      icon: Scale,
    },
    {
      name: 'Ganancia Diaria',
      value: `${stats.gananciaPromedio.toFixed(2)} kg/día`,
      change: stats.cambioGanancia > 0 ? `+${stats.cambioGanancia.toFixed(1)}%` : `${stats.cambioGanancia.toFixed(1)}%`,
      changeType: stats.cambioGanancia >= 0 ? 'positive' : 'negative',
      icon: Activity,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-semibold">Análisis de Peso y Crecimiento</h2>
        <div className="flex flex-wrap items-center gap-2">
          <FiltrosTemporales 
            periodo={periodo} 
            onChange={setPeriodo} 
          />
          <RefreshButton 
            onClick={() => loadPesoData(true)} 
            loading={refreshing}
            lastUpdate={lastUpdate || undefined}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.name}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              {stat.change && (
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  {stat.changeType === 'positive' ? (
                    <TrendingUp className="h-3 w-3 mr-1 text-primary" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1 text-destructive" />
                  )}
                  <span
                    className={
                      stat.changeType === 'positive'
                        ? 'text-primary'
                        : 'text-destructive'
                    }
                  >
                    {stat.change}
                  </span>
                  <span className="ml-1">desde el periodo anterior</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <CurvaCrecimientoChart datos={stats.pesoPorCategoria} categorias={categorias} />
        <GananciaDiariaChart datos={stats.gananciaDiaria} promedio={stats.gananciaPromedio} />
      </div>

      <ProyeccionPesoChart datos={stats.proyeccionPeso} pesoActual={stats.pesoPromedio} />
    </div>
  );
}
