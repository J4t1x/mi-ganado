'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { PesoCategoria } from '@/lib/api/dashboard';

interface CurvaCrecimientoChartProps {
  datos: PesoCategoria[];
  categorias: string[];
}

export function CurvaCrecimientoChart({ datos, categorias }: CurvaCrecimientoChartProps) {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>('todas');

  // Filtrar datos según la categoría seleccionada
  const datosFiltrados = categoriaSeleccionada === 'todas' 
    ? datos 
    : datos.filter(item => item.categoria === categoriaSeleccionada);

  // Ordenar datos por edad para la curva de crecimiento
  const datosOrdenados = [...datosFiltrados].sort((a, b) => a.edadPromedio - b.edadPromedio);

  // Formatear datos para el gráfico
  const datosFormateados = datosOrdenados.map(item => ({
    edad: item.edadPromedio,
    peso: item.pesoPromedio,
    categoria: item.categoria,
    edadLabel: `${item.edadPromedio} meses`,
  }));

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Curva de Crecimiento</CardTitle>
          <CardDescription>Evolución del peso promedio por edad</CardDescription>
        </div>
        <Select value={categoriaSeleccionada} onValueChange={setCategoriaSeleccionada}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas</SelectItem>
            {categorias.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={datosFormateados}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="edadLabel" 
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${value} kg`}
              domain={['dataMin - 20', 'dataMax + 20']}
            />
            <Tooltip 
              formatter={(value) => [`${Number(value).toLocaleString()} kg`, '']}
              labelFormatter={(label) => `Edad: ${label}`}
              contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '13px' }}
            />
            <Legend />
            {categoriaSeleccionada === 'todas' ? (
              // Si se seleccionan todas las categorías, mostrar líneas por categoría
              categorias.map((cat, index) => {
                const color = getColorForCategory(cat, index);
                const catData = datosFormateados.filter(d => d.categoria === cat);
                
                return catData.length > 0 ? (
                  <Line
                    key={cat}
                    type="monotone"
                    data={catData}
                    dataKey="peso"
                    name={cat}
                    stroke={color}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                    connectNulls
                  />
                ) : null;
              })
            ) : (
              // Si se selecciona una categoría específica, mostrar una sola línea
              <Line
                type="monotone"
                dataKey="peso"
                name="Peso"
                stroke="#16a34a"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// Función para asignar colores a las categorías
function getColorForCategory(categoria: string, index: number): string {
  const colors = ['#16a34a', '#2563eb', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6b7280'];
  
  // Asignar colores específicos a categorías comunes
  switch (categoria.toLowerCase()) {
    case 'ternero':
    case 'terneros':
      return '#16a34a';
    case 'novillo':
    case 'novillos':
      return '#2563eb';
    case 'vaca':
    case 'vacas':
      return '#f59e0b';
    case 'toro':
    case 'toros':
      return '#ef4444';
    default:
      return colors[index % colors.length];
  }
}
