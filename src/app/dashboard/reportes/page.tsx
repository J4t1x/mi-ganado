'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Download,
  Beef,
  Scale,
  ArrowRightLeft,
  Building2,
  Loader2,
  RefreshCw,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { dashboardService, DashboardStats, EstablecimientoStat } from '@/lib/api/dashboard';
import { movimientosService, Movimiento, TipoMovimiento, MovimientosEstadisticas } from '@/lib/api/movimientos';
import { pesajesService, SesionPesaje } from '@/lib/api/pesajes';
import { toast } from 'sonner';

function downloadCSV(filename: string, headers: string[], rows: string[][]) {
  const bom = '\uFEFF';
  const csv = bom + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function getDefaultDates() {
  const now = new Date();
  const desde = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  return {
    desde: desde.toISOString().split('T')[0],
    hasta: now.toISOString().split('T')[0],
  };
}

export default function ReportesPage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('stock');

  // Stock data
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [establecimientos, setEstablecimientos] = useState<EstablecimientoStat[]>([]);

  // Movimientos data
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [movStats, setMovStats] = useState<MovimientosEstadisticas | null>(null);
  const [movFechas, setMovFechas] = useState(getDefaultDates());
  const [movLoading, setMovLoading] = useState(false);

  // Pesajes data
  const [sesiones, setSesiones] = useState<SesionPesaje[]>([]);
  const [pesFechas, setPesFechas] = useState(getDefaultDates());
  const [pesLoading, setPesLoading] = useState(false);

  useEffect(() => {
    loadStockData();
  }, []);

  const loadStockData = async () => {
    setLoading(true);
    try {
      const [statsRes, estRes] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getEstablecimientosStats(),
      ]);
      setStats(statsRes);
      setEstablecimientos(estRes);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Error al cargar datos de stock');
    } finally {
      setLoading(false);
    }
  };

  const loadMovimientos = async () => {
    setMovLoading(true);
    try {
      const [movRes, statsRes] = await Promise.all([
        movimientosService.getAll({
          limit: 500,
          fechaDesde: movFechas.desde,
          fechaHasta: movFechas.hasta,
        }),
        movimientosService.getEstadisticas(),
      ]);
      setMovimientos(movRes.data);
      setMovStats(statsRes);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Error al cargar movimientos');
    } finally {
      setMovLoading(false);
    }
  };

  const loadPesajes = async () => {
    setPesLoading(true);
    try {
      const res = await pesajesService.getSesiones({
        limit: 500,
        fechaDesde: pesFechas.desde,
        fechaHasta: pesFechas.hasta,
      });
      setSesiones(res.data);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Error al cargar pesajes');
    } finally {
      setPesLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'movimientos' && movimientos.length === 0) loadMovimientos();
    if (activeTab === 'pesajes' && sesiones.length === 0) loadPesajes();
  }, [activeTab]);

  // CSV exports
  const exportStock = () => {
    if (!stats) return;
    const headers = ['Métrica', 'Valor'];
    const rows = [
      ['Total Animales', stats.totalAnimales.toString()],
      ['Activos', stats.animalesActivos.toString()],
      ['Vendidos', stats.animalesVendidos.toString()],
      ['Muertos', stats.animalesMuertos.toString()],
      ['Total Lotes', stats.totalLotes.toString()],
      ['Lotes Activos', stats.lotesActivos.toString()],
      ['', ''],
      ['Establecimiento', 'Cantidad Animales'],
      ...establecimientos.map((e) => [e.nombre, e.cantidadAnimales.toString()]),
    ];
    downloadCSV(`stock_${new Date().toISOString().split('T')[0]}.csv`, headers, rows);
    toast.success('Reporte de stock exportado');
  };

  const exportMovimientos = () => {
    if (movimientos.length === 0) return;
    const headers = ['Fecha', 'Tipo', 'Estado', 'Origen', 'Destino', 'Animales'];
    const rows = movimientos.map((m) => [
      new Date(m.fecha).toLocaleDateString('es-CL'),
      m.tipo,
      m.estado,
      m.establecimientoOrigen?.nombre || '-',
      m.establecimientoDestino?.nombre || '-',
      (m.cantidadAnimales || 0).toString(),
    ]);
    downloadCSV(`movimientos_${movFechas.desde}_${movFechas.hasta}.csv`, headers, rows);
    toast.success('Reporte de movimientos exportado');
  };

  const exportPesajes = () => {
    if (sesiones.length === 0) return;
    const headers = ['Fecha', 'Lote', 'Equipo', 'Operador', 'Pesajes', 'Peso Promedio (kg)'];
    const rows = sesiones.map((s) => [
      new Date(s.fecha).toLocaleDateString('es-CL'),
      s.lote?.nombre || '-',
      s.equipo || '-',
      s.operador || '-',
      (s.totalPesajes || 0).toString(),
      s.pesoPromedio ? Math.round(s.pesoPromedio).toString() : '-',
    ]);
    downloadCSV(`pesajes_${pesFechas.desde}_${pesFechas.hasta}.csv`, headers, rows);
    toast.success('Reporte de pesajes exportado');
  };

  // Computed stats
  const totalAnimales = stats?.totalAnimales || 0;
  const activos = stats?.animalesActivos || 0;
  const vendidos = stats?.animalesVendidos || 0;
  const muertos = stats?.animalesMuertos || 0;
  const pctActivos = totalAnimales > 0 ? Math.round((activos / totalAnimales) * 100) : 0;
  const pctVendidos = totalAnimales > 0 ? Math.round((vendidos / totalAnimales) * 100) : 0;
  const pctMuertos = totalAnimales > 0 ? Math.round((muertos / totalAnimales) * 100) : 0;

  const totalPesajesCount = sesiones.reduce((a, s) => a + (s.totalPesajes || 0), 0);
  const promedioGeneral = sesiones.length > 0
    ? sesiones.reduce((a, s) => a + (s.pesoPromedio || 0), 0) / sesiones.filter((s) => s.pesoPromedio).length
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Reportes</h1>
          <p className="text-muted-foreground">
            Genera reportes y análisis de tu gestión ganadera
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="stock" className="flex items-center gap-2">
            <Beef className="h-4 w-4" />
            Stock
          </TabsTrigger>
          <TabsTrigger value="movimientos" className="flex items-center gap-2">
            <ArrowRightLeft className="h-4 w-4" />
            Movimientos
          </TabsTrigger>
          <TabsTrigger value="pesajes" className="flex items-center gap-2">
            <Scale className="h-4 w-4" />
            Pesajes
          </TabsTrigger>
        </TabsList>

        {/* ===== STOCK TAB ===== */}
        <TabsContent value="stock" className="space-y-6">
          <div className="flex justify-end">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={loadStockData}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualizar
              </Button>
              <Button size="sm" onClick={exportStock} disabled={!stats}>
                <Download className="h-4 w-4 mr-2" />
                Exportar CSV
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : stats ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Ganado</CardTitle>
                    <Beef className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalAnimales.toLocaleString()}</div>
                    <div className="flex items-center text-xs mt-1">
                      {stats.cambioAnimales >= 0 ? (
                        <TrendingUp className="h-3 w-3 mr-1 text-primary" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1 text-destructive" />
                      )}
                      <span className={stats.cambioAnimales >= 0 ? 'text-primary' : 'text-destructive'}>
                        {stats.cambioAnimales >= 0 ? '+' : ''}{stats.cambioAnimales}
                      </span>
                      <span className="text-muted-foreground ml-1">vs mes anterior</span>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Activos</CardTitle>
                    <Beef className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{activos.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">{pctActivos}% del total</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Vendidos</CardTitle>
                    <ArrowRightLeft className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">{vendidos.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">{pctVendidos}% del total</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Muertos</CardTitle>
                    <Beef className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{muertos.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">{pctMuertos}% del total</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Distribución por Estado</CardTitle>
                    <CardDescription>Estado actual del ganado</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { label: 'Activos', value: activos, percentage: pctActivos, color: 'bg-green-600' },
                        { label: 'Vendidos', value: vendidos, percentage: pctVendidos, color: 'bg-blue-600' },
                        { label: 'Muertos', value: muertos, percentage: pctMuertos, color: 'bg-muted-foreground' },
                      ].map((item) => (
                        <div key={item.label} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>{item.label}</span>
                            <span className="font-medium">{item.value.toLocaleString()} ({item.percentage}%)</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full ${item.color} rounded-full transition-all`}
                              style={{ width: `${item.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Distribución por Establecimiento</CardTitle>
                    <CardDescription>Animales por ubicación</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {establecimientos.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No hay establecimientos registrados
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {establecimientos.map((est) => {
                          const pct = totalAnimales > 0 ? Math.round((est.cantidadAnimales / totalAnimales) * 100) : 0;
                          return (
                            <div key={est.id} className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span>{est.nombre}</span>
                                <span className="font-medium">{est.cantidadAnimales} ({pct}%)</span>
                              </div>
                              <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-primary rounded-full transition-all"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </>
          ) : null}
        </TabsContent>

        {/* ===== MOVIMIENTOS TAB ===== */}
        <TabsContent value="movimientos" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="flex gap-4">
              <div className="space-y-1">
                <Label className="text-xs">Desde</Label>
                <Input
                  type="date"
                  value={movFechas.desde}
                  onChange={(e) => setMovFechas({ ...movFechas, desde: e.target.value })}
                  className="w-40"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Hasta</Label>
                <Input
                  type="date"
                  value={movFechas.hasta}
                  onChange={(e) => setMovFechas({ ...movFechas, hasta: e.target.value })}
                  className="w-40"
                />
              </div>
            </div>
            <div className="flex gap-2 ml-auto">
              <Button variant="outline" size="sm" onClick={loadMovimientos}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Buscar
              </Button>
              <Button size="sm" onClick={exportMovimientos} disabled={movimientos.length === 0}>
                <Download className="h-4 w-4 mr-2" />
                Exportar CSV
              </Button>
            </div>
          </div>

          {movStats && (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { label: 'Total', value: movStats.total, color: '' },
                { label: 'Traslados', value: movStats.traslados, color: 'text-blue-600' },
                { label: 'Ventas', value: movStats.ventas, color: 'text-green-600' },
                { label: 'Compras', value: movStats.compras, color: 'text-purple-600' },
                { label: 'Muertes', value: movStats.muertes, color: 'text-red-600' },
              ].map((s) => (
                <Card key={s.label}>
                  <CardContent className="pt-4 pb-3 text-center">
                    <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Movimientos del Período</CardTitle>
              <CardDescription>
                {movFechas.desde} al {movFechas.hasta} — {movimientos.length} registro(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {movLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : movimientos.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No hay movimientos en el período seleccionado. Haz clic en &quot;Buscar&quot; para cargar datos.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Origen</TableHead>
                        <TableHead>Destino</TableHead>
                        <TableHead className="text-center">Animales</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {movimientos.map((mov) => (
                        <TableRow key={mov.id}>
                          <TableCell className="text-muted-foreground">
                            {new Date(mov.fecha).toLocaleDateString('es-CL')}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{mov.tipo}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={mov.estado === 'CONFIRMADO' ? 'default' : 'secondary'}>
                              {mov.estado}
                            </Badge>
                          </TableCell>
                          <TableCell>{mov.establecimientoOrigen?.nombre || '-'}</TableCell>
                          <TableCell>{mov.establecimientoDestino?.nombre || '-'}</TableCell>
                          <TableCell className="text-center font-medium">
                            {mov.cantidadAnimales || 0}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== PESAJES TAB ===== */}
        <TabsContent value="pesajes" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="flex gap-4">
              <div className="space-y-1">
                <Label className="text-xs">Desde</Label>
                <Input
                  type="date"
                  value={pesFechas.desde}
                  onChange={(e) => setPesFechas({ ...pesFechas, desde: e.target.value })}
                  className="w-40"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Hasta</Label>
                <Input
                  type="date"
                  value={pesFechas.hasta}
                  onChange={(e) => setPesFechas({ ...pesFechas, hasta: e.target.value })}
                  className="w-40"
                />
              </div>
            </div>
            <div className="flex gap-2 ml-auto">
              <Button variant="outline" size="sm" onClick={loadPesajes}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Buscar
              </Button>
              <Button size="sm" onClick={exportPesajes} disabled={sesiones.length === 0}>
                <Download className="h-4 w-4 mr-2" />
                Exportar CSV
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Sesiones</CardTitle>
                <Scale className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{sesiones.length}</div>
                <p className="text-xs text-muted-foreground">en el período</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Pesajes</CardTitle>
                <Scale className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalPesajesCount}</div>
                <p className="text-xs text-muted-foreground">animales pesados</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Peso Promedio</CardTitle>
                <Scale className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {promedioGeneral > 0 ? `${Math.round(promedioGeneral)} kg` : '-'}
                </div>
                <p className="text-xs text-muted-foreground">promedio general</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sesiones de Pesaje</CardTitle>
              <CardDescription>
                {pesFechas.desde} al {pesFechas.hasta} — {sesiones.length} sesión(es)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : sesiones.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No hay sesiones de pesaje en el período. Haz clic en &quot;Buscar&quot; para cargar datos.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Lote</TableHead>
                        <TableHead>Equipo</TableHead>
                        <TableHead>Operador</TableHead>
                        <TableHead className="text-center">Pesajes</TableHead>
                        <TableHead className="text-right">Peso Prom.</TableHead>
                        <TableHead className="text-right">GDP est.</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sesiones.map((sesion, idx) => {
                        // GDP estimation: compare with previous session of same lote
                        let gdp: number | null = null;
                        if (sesion.pesoPromedio && sesion.loteId) {
                          const prevSesion = sesiones
                            .slice(idx + 1)
                            .find((s) => s.loteId === sesion.loteId && s.pesoPromedio);
                          if (prevSesion && prevSesion.pesoPromedio) {
                            const days = Math.max(
                              1,
                              Math.round(
                                (new Date(sesion.fecha).getTime() - new Date(prevSesion.fecha).getTime()) /
                                  (1000 * 60 * 60 * 24)
                              )
                            );
                            gdp = (sesion.pesoPromedio - prevSesion.pesoPromedio) / days;
                          }
                        }

                        return (
                          <TableRow key={sesion.id}>
                            <TableCell className="text-muted-foreground">
                              {new Date(sesion.fecha).toLocaleDateString('es-CL')}
                            </TableCell>
                            <TableCell>{sesion.lote?.nombre || '-'}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{sesion.equipo || '-'}</Badge>
                            </TableCell>
                            <TableCell>{sesion.operador || '-'}</TableCell>
                            <TableCell className="text-center font-medium">
                              {sesion.totalPesajes || 0}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {sesion.pesoPromedio ? `${Math.round(sesion.pesoPromedio)} kg` : '-'}
                            </TableCell>
                            <TableCell className="text-right">
                              {gdp !== null ? (
                                <span className={gdp >= 0 ? 'text-green-600' : 'text-red-600'}>
                                  {gdp >= 0 ? '+' : ''}{gdp.toFixed(2)} kg/d
                                </span>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
