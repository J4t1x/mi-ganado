'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { IncidenciaUbicacion } from '@/lib/api/dashboard';
import { ResponsiveContainer, Tooltip, Cell, Legend } from 'recharts';
import { Building2 } from 'lucide-react';

interface IncidenciasMapaProps {
  datos: IncidenciaUbicacion[];
}

export function IncidenciasMapa({ datos }: IncidenciasMapaProps) {
  // Ordenar establecimientos por cantidad de incidencias (de mayor a menor)
  const datosOrdenados = [...datos].sort((a, b) => b.incidencias - a.incidencias);
  
  // Calcular el total de incidencias para porcentajes
  const totalIncidencias = datosOrdenados.reduce((sum, item) => sum + item.incidencias, 0);
  
  // Asignar colores según la intensidad de incidencias
  const getColorIntensity = (incidencias: number) => {
    const maxIncidencias = datosOrdenados[0]?.incidencias || 1;
    const intensity = Math.min(0.9, Math.max(0.2, incidencias / maxIncidencias));
    
    // Color base: rojo (#ef4444)
    const r = 239;
    const g = Math.round(68 + (255 - 68) * (1 - intensity));
    const b = Math.round(68 + (255 - 68) * (1 - intensity));
    
    return `rgb(${r}, ${g}, ${b})`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Incidencias por Ubicación</CardTitle>
        <CardDescription>Distribución de eventos sanitarios por establecimiento</CardDescription>
      </CardHeader>
      <CardContent>
        {datosOrdenados.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No hay datos de incidencias por ubicación
          </div>
        ) : (
          <div className="space-y-3">
            {datosOrdenados.map((item) => {
              const porcentaje = totalIncidencias > 0 
                ? (item.incidencias / totalIncidencias) * 100 
                : 0;
              
              return (
                <div key={item.establecimientoId} className="flex items-center">
                  <div className="flex items-center gap-3 flex-1">
                    <div 
                      className="h-10 w-10 rounded-md flex items-center justify-center"
                      style={{ backgroundColor: getColorIntensity(item.incidencias) }}
                    >
                      <Building2 className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium">{item.establecimientoNombre}</div>
                      <div className="text-xs text-muted-foreground">
                        {item.incidencias} incidencias
                      </div>
                    </div>
                  </div>
                  <div className="w-24 flex flex-col items-end">
                    <div className="font-medium">{porcentaje.toFixed(1)}%</div>
                    <div className="w-full bg-muted h-2 rounded-full mt-1">
                      <div 
                        className="h-full rounded-full" 
                        style={{ 
                          width: `${porcentaje}%`,
                          backgroundColor: getColorIntensity(item.incidencias)
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
