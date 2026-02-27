import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import { PrecioHistorico } from '@/lib/api/dashboard';

interface TendenciaPreciosChartProps {
  datos: PrecioHistorico[];
}

export function TendenciaPreciosChart({ datos }: TendenciaPreciosChartProps) {
  const [periodo, setPeriodo] = useState('6m');

  // Filtrar datos según el periodo seleccionado
  const filtrarDatosPorPeriodo = () => {
    const hoy = new Date();
    const fechaLimite = new Date();
    
    switch (periodo) {
      case '1m':
        fechaLimite.setMonth(hoy.getMonth() - 1);
        break;
      case '3m':
        fechaLimite.setMonth(hoy.getMonth() - 3);
        break;
      case '6m':
        fechaLimite.setMonth(hoy.getMonth() - 6);
        break;
      case '1y':
        fechaLimite.setFullYear(hoy.getFullYear() - 1);
        break;
      default:
        fechaLimite.setMonth(hoy.getMonth() - 6);
    }
    
    return datos.filter(item => new Date(item.fecha) >= fechaLimite);
  };

  const datosFiltrados = filtrarDatosPorPeriodo();
  
  // Formatear datos para el gráfico
  const datosFormateados = datosFiltrados.map(item => ({
    fecha: new Date(item.fecha).toLocaleDateString('es-CL', { day: '2-digit', month: 'short' }),
    precioVenta: item.precioVenta,
    precioCompra: item.precioCompra,
    fechaOriginal: item.fecha,
  }));

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Tendencia de Precios</CardTitle>
          <CardDescription>Evolución de precios de compra y venta</CardDescription>
        </div>
        <Select value={periodo} onValueChange={setPeriodo}>
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Periodo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1m">1 mes</SelectItem>
            <SelectItem value="3m">3 meses</SelectItem>
            <SelectItem value="6m">6 meses</SelectItem>
            <SelectItem value="1y">1 año</SelectItem>
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
              dataKey="fecha" 
              tick={{ fontSize: 12 }}
              tickFormatter={(value, index) => {
                // Mostrar menos etiquetas en el eje X para evitar solapamiento
                return index % Math.ceil(datosFormateados.length / 6) === 0 ? value : '';
              }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip 
              formatter={(value) => [`$${Number(value).toLocaleString()}`, '']}
              labelFormatter={(label, payload) => {
                const item = payload?.[0]?.payload;
                return item ? new Date(item.fechaOriginal).toLocaleDateString('es-CL') : label;
              }}
              contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '13px' }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="precioVenta"
              name="Precio Venta"
              stroke="#16a34a"
              strokeWidth={2}
              dot={{ r: 2 }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="precioCompra"
              name="Precio Compra"
              stroke="#2563eb"
              strokeWidth={2}
              dot={{ r: 2 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
