'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EficienciaStats } from '@/lib/api/dashboard';
import { TrendingUp, DollarSign, Heart, AlertTriangle } from 'lucide-react';

interface EficienciaStatsCardsProps {
  stats: EficienciaStats;
}

export function EficienciaStatsCards({ stats }: EficienciaStatsCardsProps) {
  const statsCards = [
    {
      name: 'Conversión Alimenticia',
      value: stats.conversionAlimenticia.toFixed(2),
      icon: TrendingUp,
      description: 'kg alimento / kg ganancia',
    },
    {
      name: 'Costo por Kg Producido',
      value: `$${stats.costoPorKgProducido.toLocaleString('es-CL')}`,
      icon: DollarSign,
      description: 'Costo promedio',
    },
    {
      name: 'Tasa de Reproducción',
      value: `${stats.tasaReproduccion.toFixed(1)}%`,
      icon: Heart,
      description: 'Partos exitosos',
    },
    {
      name: 'Tasa de Mortalidad',
      value: `${stats.tasaMortalidad.toFixed(2)}%`,
      icon: AlertTriangle,
      description: 'Últimos 12 meses',
      isNegative: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsCards.map((stat) => (
        <Card key={stat.name}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.name}
            </CardTitle>
            <stat.icon 
              className={`h-4 w-4 ${stat.isNegative ? 'text-destructive' : 'text-muted-foreground'}`} 
            />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stat.isNegative ? 'text-destructive' : ''}`}>
              {stat.value}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
