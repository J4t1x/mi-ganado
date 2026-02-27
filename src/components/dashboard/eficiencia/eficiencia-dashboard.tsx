'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EficienciaStats, dashboardService } from '@/lib/api/dashboard';
import { EficienciaStatsCards } from './eficiencia-stats-cards';
import { ComparativaHistoricaChart } from './comparativa-historica-chart';
import { ComparativaSectorChart } from './comparativa-sector-chart';
import { RefreshButton } from '@/components/dashboard/refresh-button';
import { ErrorState } from '@/components/dashboard/error-state';
import { FiltrosTemporales, PeriodoTiempo } from '@/components/dashboard/filtros-temporales';
import { ExportPdfButton } from '@/components/dashboard/export-pdf-button';
import { toast } from 'sonner';

export function EficienciaDashboard() {
  const [stats, setStats] = useState<EficienciaStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [periodo, setPeriodo] = useState<PeriodoTiempo>('6m');

  const loadEficienciaData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      const eficienciaData = await dashboardService.getEficienciaStats(periodo);
      
      setStats(eficienciaData);
      setError(null);
      setLastUpdate(new Date());
      
      if (isRefresh) {
        toast.success('Datos de eficiencia actualizados');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar datos de eficiencia';
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
    loadEficienciaData();
  }, [periodo]);

  if (loading && !stats) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Análisis de Eficiencia Operativa</h2>
          <div className="flex items-center gap-2">
            <div className="h-9 w-24 bg-muted rounded-md animate-pulse"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
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
    return <ErrorState message={error} onRetry={() => loadEficienciaData()} />;
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-semibold">Análisis de Eficiencia Operativa</h2>
        <div className="flex items-center gap-2">
          <ExportPdfButton 
            filename="eficiencia-operativa"
            elementId="eficiencia-content"
            title="Análisis de Eficiencia Operativa"
          />
          <FiltrosTemporales 
            periodo={periodo} 
            onChange={setPeriodo} 
          />
          <RefreshButton 
            onClick={() => loadEficienciaData(true)} 
            loading={refreshing}
            lastUpdate={lastUpdate || undefined}
          />
        </div>
      </div>

      <div id="eficiencia-content">
        <EficienciaStatsCards stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <ComparativaHistoricaChart datos={stats.comparativaHistorica} />
          <ComparativaSectorChart datos={stats.comparativaSector} />
        </div>
      </div>
    </div>
  );
}
