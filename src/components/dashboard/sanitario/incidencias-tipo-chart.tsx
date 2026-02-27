'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { IncidenciaSanitaria } from '@/lib/api/dashboard';

interface IncidenciasTipoChartProps {
  datos: IncidenciaSanitaria[];
}

export function IncidenciasTipoChart({ datos }: IncidenciasTipoChartProps) {
  // Colores para los diferentes tipos de incidencias
  const COLORS = ['#ef4444', '#f59e0b', '#16a34a', '#2563eb', '#8b5cf6', '#ec4899', '#6b7280'];
  
  // Formatear datos para el gráfico
  const datosFormateados = datos.map((item, index) => ({
    name: item.tipo,
    value: item.cantidad,
    porcentaje: item.porcentaje,
    color: COLORS[index % COLORS.length],
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Incidencias por Tipo</CardTitle>
        <CardDescription>Distribución de eventos sanitarios por categoría</CardDescription>
      </CardHeader>
      <CardContent>
        {datosFormateados.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No hay datos de incidencias por tipo
          </div>
        ) : (
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={datosFormateados}
                  cx="50%"
                  cy="50%"
                  innerRadius={0}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${percent ? (percent * 100).toFixed(1) : 0}%`}
                  labelLine={false}
                >
                  {datosFormateados.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${Number(value)} casos (${datosFormateados.find(d => d.value === Number(value))?.porcentaje.toFixed(1)}%)`, '']}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '13px' }}
                />
                <Legend 
                  layout="vertical" 
                  verticalAlign="middle" 
                  align="right"
                  formatter={(value, entry, index) => {
                    const item = datosFormateados[index];
                    return (
                      <span className="text-xs">
                        {value}: {item.value}
                      </span>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
