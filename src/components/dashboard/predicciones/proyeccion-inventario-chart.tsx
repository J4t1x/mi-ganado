'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProyeccionInventario } from '@/lib/api/dashboard';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface ProyeccionInventarioChartProps {
  datos: ProyeccionInventario[];
  horizonte: number;
}

export function ProyeccionInventarioChart({ datos, horizonte }: ProyeccionInventarioChartProps) {
  const chartData = datos.map((item) => ({
    fecha: new Date(item.fecha).toLocaleDateString('es-CL', { day: '2-digit', month: 'short' }),
    cantidad: item.cantidadEstimada,
  }));

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Proyección de Inventario</CardTitle>
        <CardDescription>
          Estimación de stock para los próximos {horizonte} días
        </CardDescription>
      </CardHeader>
      <CardContent>
        {datos.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Sin datos de proyección disponibles
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={chartData}
              margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
            >
              <defs>
                <linearGradient id="proyeccionGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2D8659" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#2D8659" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="fecha"
                className="text-xs"
                tick={{ fontSize: 11 }}
                interval={Math.floor(datos.length / 6)}
              />
              <YAxis className="text-xs" tick={{ fontSize: 11 }} width={40} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '13px' }}
                formatter={(value) => [Math.round(Number(value)).toLocaleString(), 'Animales']}
              />
              <Area
                type="monotone"
                dataKey="cantidad"
                stroke="#2D8659"
                strokeWidth={2}
                fill="url(#proyeccionGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
