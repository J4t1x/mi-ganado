import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { CostoCategoria } from '@/lib/api/dashboard';

interface CostosCategoriaPieProps {
  datos: CostoCategoria[];
}

export function CostosCategoriaPie({ datos }: CostosCategoriaPieProps) {
  // Colores para las diferentes categorías
  const COLORS = ['#16a34a', '#2563eb', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6b7280'];
  
  // Formatear datos para el gráfico
  const datosFormateados = datos.map((item, index) => ({
    name: item.categoria,
    value: item.monto,
    porcentaje: item.porcentaje,
    color: COLORS[index % COLORS.length],
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribución de Costos</CardTitle>
        <CardDescription>Desglose por categoría</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={datosFormateados}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
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
                formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Monto']}
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
                      {value}: {item.porcentaje.toFixed(1)}%
                    </span>
                  );
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
