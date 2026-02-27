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
} from 'recharts';

interface ComparativaHistoricaChartProps {
  datos: ComparativaEficiencia[];
}

export function ComparativaHistoricaChart({ datos }: ComparativaHistoricaChartProps) {
  const chartData = datos.map((item) => ({
    metrica: item.metrica,
    'Actual': item.valorActual,
    'Histórico': item.valorComparativo,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparativa Histórica</CardTitle>
        <CardDescription>
          Rendimiento actual vs mismo período año anterior
        </CardDescription>
      </CardHeader>
      <CardContent>
        {datos.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Sin datos históricos disponibles
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 10, left: -10, bottom: 40 }}
            >
              <defs>
                <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2D8659" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#1e5a3d" stopOpacity={0.85} />
                </linearGradient>
                <linearGradient id="historicoGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#94a3b8" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#64748b" stopOpacity={0.85} />
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
              />
              <Legend 
                verticalAlign="top" 
                height={36}
                wrapperStyle={{ fontSize: '13px' }}
              />
              <Bar dataKey="Actual" fill="url(#actualGradient)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Histórico" fill="url(#historicoGradient)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
