'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertaUmbral } from '@/lib/api/dashboard';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';

interface AlertasUmbralesProps {
  alertas: AlertaUmbral[];
}

export function AlertasUmbrales({ alertas }: AlertasUmbralesProps) {
  const getIconByCriticidad = (criticidad: 'alta' | 'media' | 'baja') => {
    switch (criticidad) {
      case 'alta':
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
      case 'media':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'baja':
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBadgeVariant = (criticidad: 'alta' | 'media' | 'baja') => {
    switch (criticidad) {
      case 'alta':
        return 'destructive';
      case 'media':
        return 'default';
      case 'baja':
        return 'secondary';
    }
  };

  const alertasOrdenadas = [...alertas].sort((a, b) => {
    const orden = { alta: 0, media: 1, baja: 2 };
    return orden[a.criticidad] - orden[b.criticidad];
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alertas de Umbrales</CardTitle>
        <CardDescription>
          Métricas que requieren atención
        </CardDescription>
      </CardHeader>
      <CardContent>
        {alertas.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Info className="h-8 w-8 mx-auto mb-2 text-primary" />
            <p>No hay alertas activas</p>
            <p className="text-xs mt-1">Todas las métricas están dentro de los umbrales</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alertasOrdenadas.map((alerta, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="mt-0.5">
                  {getIconByCriticidad(alerta.criticidad)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-sm">{alerta.tipo}</p>
                    <Badge variant={getBadgeVariant(alerta.criticidad)} className="text-xs">
                      {alerta.criticidad}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">
                    {alerta.metrica}
                  </p>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-muted-foreground">Actual:</span>
                    <span className="font-medium">{alerta.valorActual.toFixed(1)}</span>
                    <span className="text-muted-foreground">|</span>
                    <span className="text-muted-foreground">Umbral:</span>
                    <span className="font-medium">{alerta.umbral.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
