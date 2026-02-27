'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Recomendacion } from '@/lib/api/dashboard';
import { Lightbulb, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

interface RecomendacionesPanelProps {
  recomendaciones: Recomendacion[];
}

export function RecomendacionesPanel({ recomendaciones }: RecomendacionesPanelProps) {
  const getIconByTipo = (tipo: string) => {
    switch (tipo.toLowerCase()) {
      case 'optimización':
      case 'optimizacion':
        return <TrendingUp className="h-5 w-5 text-primary" />;
      case 'alerta':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'acción':
      case 'accion':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Lightbulb className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBadgeVariant = (prioridad: 'alta' | 'media' | 'baja') => {
    switch (prioridad) {
      case 'alta':
        return 'destructive';
      case 'media':
        return 'default';
      case 'baja':
        return 'secondary';
    }
  };

  const recomendacionesOrdenadas = [...recomendaciones].sort((a, b) => {
    const orden = { alta: 0, media: 1, baja: 2 };
    return orden[a.prioridad] - orden[b.prioridad];
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recomendaciones</CardTitle>
        <CardDescription>
          Sugerencias para optimizar tu operación
        </CardDescription>
      </CardHeader>
      <CardContent>
        {recomendaciones.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Lightbulb className="h-8 w-8 mx-auto mb-2 text-primary" />
            <p>No hay recomendaciones en este momento</p>
            <p className="text-xs mt-1">Tu operación está funcionando óptimamente</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recomendacionesOrdenadas.map((recomendacion, index) => (
              <div
                key={index}
                className="flex flex-col gap-3 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {getIconByTipo(recomendacion.tipo)}
                    <Badge variant={getBadgeVariant(recomendacion.prioridad)} className="text-xs">
                      {recomendacion.prioridad}
                    </Badge>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium mb-1">{recomendacion.tipo}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {recomendacion.descripcion}
                  </p>
                </div>
                {recomendacion.impactoEstimado && (
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium">Impacto estimado:</span>{' '}
                      {recomendacion.impactoEstimado}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
