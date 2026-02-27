'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ComparativaEficiencia } from '@/lib/api/dashboard';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts';

interface ComparativaSectorChartProps {
  datos: ComparativaEficiencia[];
}

export function ComparativaSectorChart({ datos }: ComparativaSectorChartProps) {
  const chartData = datos.map((item) => ({
    metrica: item.metrica,
    'Mi Operación': item.valorActual,
    'Promedio Sector': item.valorComparativo,
    diferencia: item.diferenciaPorcentual,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparativa con el Sector</CardTitle>
        <CardDescription>
          Benchmarking con promedios de la industria
        </CardDescription>
      </CardHeader>
      <CardContent>
        {datos.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Sin datos de comparación disponibles
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 10, left: -10, bottom: 40 }}
            >
              <defs>
                <linearGradient id="miOperacionGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#1e40af" stopOpacity={0.85} />
                </linearGradient>
                <linearGradient id="sectorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#d97706" stopOpacity={0.85} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="metrica"
                className="text-xs"
                tick={{ fontSize: 11 }}
                angle={-35}
                textAnchor="end"
                interval={0}
                height={60}
              />
              <YAxis className="text-xs" tick={{ fontSize: 11 }} width={40} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '13px' }}
                formatter={(value, name, props) => {
                  if (name === 'Mi Operación' || name === 'Promedio Sector') {
                    return [Number(value).toFixed(2), name];
                  }
                  return [value, name];
                }}
              />
              <Legend 
                verticalAlign="top" 
                height={36}
                wrapperStyle={{ fontSize: '13px' }}
              />
              <Bar dataKey="Mi Operación" fill="url(#miOperacionGradient)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Promedio Sector" fill="url(#sectorGradient)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
