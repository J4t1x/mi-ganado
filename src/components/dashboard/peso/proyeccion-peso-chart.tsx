'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { ProyeccionPeso } from '@/lib/api/dashboard';

interface ProyeccionPesoChartProps {
  datos: ProyeccionPeso[];
  pesoActual: number;
}

export function ProyeccionPesoChart({ datos, pesoActual }: ProyeccionPesoChartProps) {
  // Formatear datos para el gráfico
  const datosFormateados = datos.map(item => ({
    fecha: new Date(item.fecha).toLocaleDateString('es-CL', { day: '2-digit', month: 'short' }),
    peso: item.pesoEstimado,
    fechaOriginal: item.fecha,
  }));

  // Encontrar la fecha actual para la línea de referencia
  const hoy = new Date().toISOString().split('T')[0];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Proyección de Peso</CardTitle>
        <CardDescription>Estimación de peso futuro basado en tendencias actuales</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart
            data={datosFormateados}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorPeso" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16a34a" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#16a34a" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="fecha" 
              tick={{ fontSize: 12 }}
              tickFormatter={(value, index) => {
                // Mostrar menos etiquetas en el eje X para evitar solapamiento
                return index % Math.ceil(datosFormateados.length / 6) === 0 ? value : '';
              }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${value} kg`}
              domain={['dataMin - 20', 'dataMax + 20']}
            />
            <Tooltip 
              formatter={(value) => [`${Number(value).toFixed(1)} kg`, 'Peso estimado']}
              labelFormatter={(label, payload) => {
                const item = payload?.[0]?.payload;
                return item ? new Date(item.fechaOriginal).toLocaleDateString('es-CL') : label;
              }}
              contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '13px' }}
            />
            <ReferenceLine
              x={datosFormateados[0]?.fecha}
              stroke="#ef4444"
              strokeDasharray="3 3"
              label={{
                position: 'top',
                value: 'Hoy',
                fill: '#ef4444',
                fontSize: 12,
              }}
            />
            <Area 
              type="monotone" 
              dataKey="peso" 
              stroke="#16a34a" 
              fillOpacity={1} 
              fill="url(#colorPeso)" 
            />
          </AreaChart>
        </ResponsiveContainer>
        
        <div className="mt-4 flex items-center justify-between text-sm">
          <div>
            <span className="text-muted-foreground">Peso actual:</span>{' '}
            <span className="font-medium">{pesoActual.toFixed(1)} kg</span>
          </div>
          <div>
            <span className="text-muted-foreground">Peso proyectado (90 días):</span>{' '}
            <span className="font-medium">{datos[datos.length - 1]?.pesoEstimado.toFixed(1)} kg</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
