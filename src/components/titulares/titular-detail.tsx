'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { TitularWithEstablecimientos, TipoTitular, EstadoGeneral } from '@/types';
import {
  User,
  Building,
  Building2,
  Phone,
  Calendar,
  Pencil,
  ArrowLeft,
  Beef,
} from 'lucide-react';
import Link from 'next/link';

interface TitularDetailProps {
  titular: TitularWithEstablecimientos;
  onEdit: () => void;
}

export function TitularDetail({ titular, onEdit }: TitularDetailProps) {
  const TipoIcon = titular.tipo === TipoTitular.PERSONA_NATURAL ? User : Building;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/configuracion/titulares">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <TipoIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{titular.nombreRazonSocial}</h1>
              <p className="text-muted-foreground font-mono">{titular.rut}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant={titular.estado === EstadoGeneral.ACTIVO ? 'default' : 'secondary'}
            className={
              titular.estado === EstadoGeneral.ACTIVO
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-600'
            }
          >
            {titular.estado === EstadoGeneral.ACTIVO ? 'Activo' : 'Inactivo'}
          </Badge>
          <Button onClick={onEdit}>
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tipo de Titular
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TipoIcon className="h-5 w-5 text-primary" />
              <span className="text-lg font-semibold">
                {titular.tipo === TipoTitular.PERSONA_NATURAL
                  ? 'Persona Natural'
                  : 'Empresa'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Establecimientos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              <span className="text-lg font-semibold">
                {titular._count?.establecimientos ?? titular.establecimientos?.length ?? 0}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Animales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Beef className="h-5 w-5 text-primary" />
              <span className="text-lg font-semibold">
                {titular._count?.animales ?? 0}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información de Contacto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Contacto</p>
              <p className="font-medium">
                {titular.contacto || 'No especificado'}
              </p>
            </div>
          </div>
          <Separator />
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Fecha de registro</p>
              <p className="font-medium">{formatDate(titular.createdAt)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {titular.establecimientos && titular.establecimientos.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Establecimientos</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/dashboard/configuracion/establecimientos?titular=${titular.id}`}>
                Ver todos
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {titular.establecimientos.slice(0, 5).map((est) => (
                <div
                  key={est.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{est.nombre}</p>
                      {est.rolPredial && (
                        <p className="text-sm text-muted-foreground font-mono">
                          {est.rolPredial}
                        </p>
                      )}
                    </div>
                  </div>
                  <Badge variant="outline">{est.tipo}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
