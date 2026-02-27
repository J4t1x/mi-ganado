'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { GananciaDiaria } from '@/lib/api/dashboard';

interface GananciaDiariaChartProps {
  datos: GananciaDiaria[];
  promedio: number;
}

export function GananciaDiariaChart({ datos, promedio }: GananciaDiariaChartProps) {
  const [filtro, setFiltro] = useState<'lote' | 'raza'>('lote');

  // Agrupar datos según el filtro seleccionado
  const datosFiltrados = () => {
    if (filtro === 'lote') {
      return datos.map(item => ({
        nombre: item.loteNombre,
        ganancia: item.gananciaPromedio,
        id: item.loteId,
        raza: item.raza,
      }));
    } else {
      // Agrupar por raza
      const razasMap = new Map<string, { ganancia: number, count: number }>();
      
      datos.forEach(item => {
        if (!razasMap.has(item.raza)) {
          razasMap.set(item.raza, { ganancia: 0, count: 0 });
        }
        
        const razaData = razasMap.get(item.raza)!;
        razaData.ganancia += item.gananciaPromedio;
        razaData.count += 1;
      });
      
      return Array.from(razasMap.entries()).map(([raza, data]) => ({
        nombre: raza,
        ganancia: data.ganancia / data.count,
        id: raza,
        raza: raza,
      }));
    }
  };

  // Ordenar datos por ganancia de mayor a menor
  const datosOrdenados = datosFiltrados().sort((a, b) => b.ganancia - a.ganancia);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Ganancia Diaria</CardTitle>
          <CardDescription>Comparativa de ganancia de peso (kg/día)</CardDescription>
        </div>
        <Select value={filtro} onValueChange={(value: 'lote' | 'raza') => setFiltro(value)}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Agrupar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="lote">Por Lote</SelectItem>
            <SelectItem value="raza">Por Raza</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={datosOrdenados}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${value.toFixed(2)} kg`}
              domain={[0, 'dataMax + 0.2']}
            />
            <YAxis
              dataKey="nombre"
              type="category"
              tick={{ fontSize: 12 }}
              width={100}
              tickFormatter={(value) => value.length > 12 ? `${value.substring(0, 12)}...` : value}
            />
            <Tooltip
              formatter={(value) => [`${Number(value).toFixed(2)} kg/día`, 'Ganancia']}
              labelFormatter={(label) => filtro === 'lote' ? `Lote: ${label}` : `Raza: ${label}`}
              contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '13px' }}
            />
            <Legend />
            <ReferenceLine
              x={promedio}
              stroke="#ef4444"
              strokeDasharray="3 3"
              label={{
                position: 'top',
                value: `Promedio: ${promedio.toFixed(2)} kg`,
                fill: '#ef4444',
                fontSize: 12,
              }}
            />
            <Bar
              dataKey="ganancia"
              name="Ganancia diaria"
              fill="#16a34a"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
