'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PrediccionStats, dashboardService } from '@/lib/api/dashboard';
import { ProyeccionInventarioChart } from './proyeccion-inventario-chart';
import { AlertasUmbrales } from './alertas-umbrales';
import { RecomendacionesPanel } from './recomendaciones-panel';
import { RefreshButton } from '@/components/dashboard/refresh-button';
import { ErrorState } from '@/components/dashboard/error-state';
import { ExportPdfButton } from '@/components/dashboard/export-pdf-button';
import { toast } from 'sonner';

export function PrediccionesDashboard() {
  const [stats, setStats] = useState<PrediccionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [horizonte, setHorizonte] = useState<number>(60);

  const loadPrediccionesData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      const prediccionData = await dashboardService.getPrediccionStats(horizonte);
      
      setStats(prediccionData);
      setError(null);
      setLastUpdate(new Date());
      
      if (isRefresh) {
        toast.success('Predicciones actualizadas');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar predicciones';
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
    loadPrediccionesData();
  }, [horizonte]);

  if (loading && !stats) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Análisis Predictivo</h2>
          <div className="flex items-center gap-2">
            <div className="h-9 w-32 bg-muted rounded-md animate-pulse"></div>
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
        <Card>
          <CardHeader>
            <div className="h-6 w-40 bg-muted rounded-md animate-pulse mb-2"></div>
            <div className="h-4 w-48 bg-muted rounded-md animate-pulse"></div>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] bg-muted/20 rounded-md animate-pulse"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error && !stats) {
    return <ErrorState message={error} onRetry={() => loadPrediccionesData()} />;
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-semibold">Análisis Predictivo</h2>
        <div className="flex items-center gap-2">
          <ExportPdfButton 
            filename="analisis-predictivo"
            elementId="predicciones-content"
            title="Análisis Predictivo"
          />
          <Select
            value={horizonte.toString()}
            onValueChange={(value) => setHorizonte(parseInt(value))}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">30 días</SelectItem>
              <SelectItem value="60">60 días</SelectItem>
              <SelectItem value="90">90 días</SelectItem>
            </SelectContent>
          </Select>
          <RefreshButton 
            onClick={() => loadPrediccionesData(true)} 
            loading={refreshing}
            lastUpdate={lastUpdate || undefined}
          />
        </div>
      </div>

      <div id="predicciones-content">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ProyeccionInventarioChart 
            datos={stats.proyeccionInventario} 
            horizonte={horizonte}
          />
          <AlertasUmbrales alertas={stats.alertasUmbrales} />
        </div>

        <div className="mt-6">
          <RecomendacionesPanel recomendaciones={stats.recomendaciones} />
        </div>
      </div>
    </div>
  );
}
