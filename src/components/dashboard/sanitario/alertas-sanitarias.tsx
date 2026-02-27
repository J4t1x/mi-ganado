'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { EventoSanitario } from '@/lib/api/dashboard';
import { AlertCircle, Calendar, CheckCircle2, Clock } from 'lucide-react';
import Link from 'next/link';

interface AlertasSanitariasProps {
  eventosRecientes: EventoSanitario[];
  proximosEventos: EventoSanitario[];
}

export function AlertasSanitarias({ eventosRecientes, proximosEventos }: AlertasSanitariasProps) {
  // Función para obtener la variante de badge según la prioridad
  const getPrioridadVariant = (prioridad: string) => {
    switch (prioridad) {
      case 'alta':
        return 'destructive';
      case 'media':
        return 'default';
      case 'baja':
        return 'outline';
      default:
        return 'outline';
    }
  };

  // Función para obtener la variante de badge según el estado
  const getEstadoVariant = (estado: string) => {
    switch (estado.toUpperCase()) {
      case 'COMPLETADO':
        return 'default';
      case 'PENDIENTE':
        return 'outline';
      case 'EN_PROGRESO':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  // Función para formatear la fecha
  const formatearFecha = (fechaStr: string) => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-CL');
  };

  // Función para calcular días restantes
  const calcularDiasRestantes = (fechaStr: string) => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fecha = new Date(fechaStr);
    fecha.setHours(0, 0, 0, 0);
    
    const diferencia = fecha.getTime() - hoy.getTime();
    return Math.ceil(diferencia / (1000 * 3600 * 24));
  };

  return (
    <Card className="col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Alertas Sanitarias</CardTitle>
            <CardDescription>Eventos sanitarios recientes y próximos</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/sanitario">Ver todos</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="proximos">
          <TabsList className="mb-4">
            <TabsTrigger value="proximos" className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Próximos ({proximosEventos.length})
            </TabsTrigger>
            <TabsTrigger value="recientes" className="flex items-center">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Recientes ({eventosRecientes.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="proximos">
            {proximosEventos.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No hay eventos sanitarios programados
              </div>
            ) : (
              <div className="space-y-4">
                {proximosEventos.map((evento) => {
                  const diasRestantes = calcularDiasRestantes(evento.fecha);
                  
                  return (
                    <div key={evento.id} className="flex items-start p-3 border rounded-lg">
                      <div className="mr-3 mt-1">
                        {diasRestantes <= 3 ? (
                          <AlertCircle className="h-5 w-5 text-destructive" />
                        ) : (
                          <Calendar className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">{evento.tipo}</div>
                          <Badge variant={getPrioridadVariant(evento.prioridad)}>
                            {evento.prioridad}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{evento.descripcion}</p>
                        <div className="flex items-center justify-between mt-2 text-xs">
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>
                              {formatearFecha(evento.fecha)}
                              {diasRestantes === 0 && " (Hoy)"}
                              {diasRestantes === 1 && " (Mañana)"}
                              {diasRestantes > 1 && ` (en ${diasRestantes} días)`}
                            </span>
                          </div>
                          <div>
                            {evento.establecimiento && (
                              <span className="text-muted-foreground">
                                {evento.establecimiento}
                                {evento.lote && ` - ${evento.lote}`}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="recientes">
            {eventosRecientes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No hay eventos sanitarios recientes
              </div>
            ) : (
              <div className="space-y-4">
                {eventosRecientes.map((evento) => (
                  <div key={evento.id} className="flex items-start p-3 border rounded-lg">
                    <div className="mr-3 mt-1">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{evento.tipo}</div>
                        <Badge variant={getEstadoVariant(evento.estado)}>
                          {evento.estado}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{evento.descripcion}</p>
                      <div className="flex items-center justify-between mt-2 text-xs">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{formatearFecha(evento.fecha)}</span>
                        </div>
                        <div>
                          {evento.establecimiento && (
                            <span className="text-muted-foreground">
                              {evento.establecimiento}
                              {evento.lote && ` - ${evento.lote}`}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
