import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, Percent, BarChart3, PieChart } from 'lucide-react';
import { FinancieroStats } from '@/lib/api/dashboard';

interface FinancieroStatsCardsProps {
  stats: FinancieroStats;
}

export function FinancieroStatsCards({ stats }: FinancieroStatsCardsProps) {
  const statsCards = [
    {
      name: 'Rentabilidad',
      value: `${stats.rentabilidad.toFixed(2)}%`,
      change: stats.cambioRentabilidad > 0 ? `+${stats.cambioRentabilidad.toFixed(2)}` : `${stats.cambioRentabilidad.toFixed(2)}`,
      changeType: stats.cambioRentabilidad >= 0 ? 'positive' : 'negative',
      icon: Percent,
    },
    {
      name: 'Margen Bruto',
      value: `${stats.margenBruto.toFixed(2)}%`,
      change: '',
      changeType: 'neutral',
      icon: BarChart3,
    },
    {
      name: 'Ingresos',
      value: `$${stats.ingresosTotales.toLocaleString()}`,
      change: '',
      changeType: 'neutral',
      icon: TrendingUp,
    },
    {
      name: 'Costos',
      value: `$${stats.costosTotales.toLocaleString()}`,
      change: '',
      changeType: 'neutral',
      icon: DollarSign,
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
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            {stat.change && (
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                {stat.changeType === 'positive' ? (
                  <TrendingUp className="h-3 w-3 mr-1 text-primary" />
                ) : stat.changeType === 'negative' ? (
                  <TrendingDown className="h-3 w-3 mr-1 text-destructive" />
                ) : null}
                <span
                  className={
                    stat.changeType === 'positive'
                      ? 'text-primary'
                      : stat.changeType === 'negative'
                      ? 'text-destructive'
                      : ''
                  }
                >
                  {stat.change}
                </span>
                <span className="ml-1">puntos</span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
