'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Beef,
  Package,
  Scale,
  ArrowRightLeft,
  Plus,
  TrendingUp,
  TrendingDown,
  Building2,
} from 'lucide-react';
import Link from 'next/link';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { dashboardService, DashboardStats, MovimientoReciente, EstablecimientoStat } from '@/lib/api/dashboard';
import { DashboardSkeleton } from '@/components/dashboard/dashboard-skeleton';
import { ErrorState } from '@/components/dashboard/error-state';
import { RefreshButton } from '@/components/dashboard/refresh-button';
import { toast } from 'sonner';

function getMovementBadgeVariant(tipo: string) {
  switch (tipo) {
    case 'TRASLADO':
      return 'secondary';
    case 'VENTA':
      return 'default';
    case 'COMPRA':
      return 'outline';
    case 'MUERTE':
      return 'destructive';
    default:
      return 'secondary';
  }
}

function getStatusBadgeVariant(estado: string) {
  switch (estado) {
    case 'CONFIRMADO':
      return 'default';
    case 'BORRADOR':
      return 'outline';
    case 'INFORMADO':
      return 'secondary';
    default:
      return 'outline';
  }
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [movimientos, setMovimientos] = useState<MovimientoReciente[]>([]);
  const [establecimientos, setEstablecimientos] = useState<EstablecimientoStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const loadDashboardData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      const [statsData, movimientosData, establecimientosData] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getMovimientosRecientes(5),
        dashboardService.getEstablecimientosStats(),
      ]);
      
      setStats(statsData);
      setMovimientos(movimientosData);
      setEstablecimientos(establecimientosData);
      setError(null);
      setLastUpdate(new Date());
      
      if (isRefresh) {
        toast.success('Dashboard actualizado');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar datos del dashboard';
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
    loadDashboardData();
    
    // Auto-refresh cada 30 segundos
    const interval = setInterval(() => {
      loadDashboardData(true);
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading && !stats) {
    return <DashboardSkeleton />;
  }

  if (error && !stats) {
    return <ErrorState message={error} onRetry={() => loadDashboardData()} />;
  }

  if (!stats) {
    return null;
  }

  const statsCards = [
    {
      name: 'Total Ganado',
      value: stats.totalAnimales.toLocaleString(),
      change: stats.cambioAnimales > 0 ? `+${stats.cambioAnimales}` : `${stats.cambioAnimales}`,
      changeType: stats.cambioAnimales >= 0 ? 'positive' : 'negative',
      icon: Beef,
    },
    {
      name: 'Lotes Activos',
      value: stats.lotesActivos.toLocaleString(),
      change: stats.cambioLotes > 0 ? `+${stats.cambioLotes}` : `${stats.cambioLotes}`,
      changeType: stats.cambioLotes >= 0 ? 'positive' : 'negative',
      icon: Package,
    },
    {
      name: 'Pesajes (semana)',
      value: stats.pesajesUltimaSemana.toLocaleString(),
      change: stats.cambioPesajes > 0 ? `+${stats.cambioPesajes}` : `${stats.cambioPesajes}`,
      changeType: stats.cambioPesajes >= 0 ? 'positive' : 'negative',
      icon: Scale,
    },
    {
      name: 'Movimientos (mes)',
      value: stats.movimientosUltimoMes.toLocaleString(),
      change: stats.cambioMovimientos > 0 ? `+${stats.cambioMovimientos}` : `${stats.cambioMovimientos}`,
      changeType: stats.cambioMovimientos >= 0 ? 'positive' : 'negative',
      icon: ArrowRightLeft,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Resumen de tu gestión ganadera
          </p>
        </div>
        <div className="flex gap-2">
          <RefreshButton 
            onClick={() => loadDashboardData(true)} 
            loading={refreshing}
            lastUpdate={lastUpdate || undefined}
          />
          <Button asChild>
            <Link href="/dashboard/animales/nuevo">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Animal
            </Link>
          </Button>
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
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                {stat.changeType === 'positive' ? (
                  <TrendingUp className="h-3 w-3 mr-1 text-primary" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1 text-destructive" />
                )}
                <span className={stat.changeType === 'positive' ? 'text-primary' : 'text-destructive'}>
                  {stat.change}
                </span>
                <span className="ml-1">desde el mes pasado</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Últimos Movimientos</CardTitle>
                <CardDescription>
                  Movimientos recientes de ganado
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/movimientos">Ver todos</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {movimientos.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No hay movimientos recientes
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead className="text-center">Animales</TableHead>
                      <TableHead>Origen → Destino</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {movimientos.map((mov) => {
                      const origen = mov.establecimientoOrigen?.nombre || mov.titularOrigen?.nombreRazonSocial || 'N/A';
                      const destino = mov.establecimientoDestino?.nombre || mov.titularDestino?.nombreRazonSocial || 'N/A';
                      
                      return (
                        <TableRow key={mov.id}>
                          <TableCell>
                            <Badge variant={getMovementBadgeVariant(mov.tipo)}>
                              {mov.tipo}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(mov.fecha).toLocaleDateString('es-CL')}
                          </TableCell>
                          <TableCell className="text-center font-medium">
                            {mov.cantidadAnimales}
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            <span className="text-muted-foreground">{origen}</span>
                            <span className="mx-2">→</span>
                            <span>{destino}</span>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(mov.estado)}>
                              {mov.estado}
                            </Badge>
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

        <Card>
          <CardHeader>
            <CardTitle>Estado del Ganado</CardTitle>
            <CardDescription>
              Distribución por estado
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats.animalesActivos > 0 || stats.animalesVendidos > 0 || stats.animalesMuertos > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Activos', value: stats.animalesActivos },
                      { name: 'Vendidos', value: stats.animalesVendidos },
                      { name: 'Muertos', value: stats.animalesMuertos },
                    ].filter((d) => d.value > 0)}
                    cx="50%"
                    cy="45%"
                    innerRadius={40}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    <Cell fill="#16a34a" />
                    <Cell fill="#2563eb" />
                    <Cell fill="#6b7280" />
                  </Pie>
                  <Tooltip formatter={(value) => [Number(value).toLocaleString(), 'Animales']} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Sin datos de animales
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {establecimientos.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Stock por Establecimiento</CardTitle>
                <CardDescription>Cantidad de animales por ubicación</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/configuracion/establecimientos">Ver todos</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={establecimientos.map((e) => ({
                  nombre: e.nombre.length > 12 ? e.nombre.slice(0, 12) + '...' : e.nombre,
                  animales: e.cantidadAnimales,
                  fullName: e.nombre,
                }))}
                margin={{ top: 5, right: 10, left: -10, bottom: establecimientos.length > 3 ? 40 : 5 }}
              >
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#34d399" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#059669" stopOpacity={0.85} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="nombre"
                  className="text-xs"
                  tick={{ fontSize: 11 }}
                  angle={establecimientos.length > 3 ? -35 : 0}
                  textAnchor={establecimientos.length > 3 ? 'end' : 'middle'}
                  interval={0}
                />
                <YAxis className="text-xs" tick={{ fontSize: 11 }} width={35} />
                <Tooltip
                  formatter={(value) => [Number(value).toLocaleString(), 'Animales']}
                  labelFormatter={(_label, payload) => {
                    const item = (payload as Array<{ payload?: { fullName?: string } }>)?.[0]?.payload;
                    return item?.fullName || String(_label);
                  }}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '13px' }}
                />
                <Bar dataKey="animales" fill="url(#barGradient)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
