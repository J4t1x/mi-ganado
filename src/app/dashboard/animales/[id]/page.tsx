'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { animalesService } from '@/lib/api/animales';
import { AnimalWithRelations } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Edit,
  Loader2,
  Calendar,
  MapPin,
  Tag,
  Scale,
  FileText,
} from 'lucide-react';
import { toast } from 'sonner';

export default function AnimalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [animal, setAnimal] = useState<AnimalWithRelations | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnimal();
  }, [params.id]);

  const loadAnimal = async () => {
    try {
      const data = await animalesService.getById(params.id as string);
      setAnimal(data);
    } catch (error: any) {
      toast.error(error.message || 'Error al cargar animal');
      router.push('/dashboard/animales');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!animal) {
    return null;
  }

  const getEstadoBadgeVariant = (estado: string) => {
    switch (estado) {
      case 'ACTIVO':
        return 'default';
      case 'VENDIDO':
        return 'secondary';
      case 'MUERTO':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/animales">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Detalle del Animal</h1>
            <p className="text-muted-foreground">
              Información completa del animal
            </p>
          </div>
        </div>
        <Button asChild>
          <Link href={`/dashboard/animales/${animal.id}/editar`}>
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Información General
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Especie</p>
              <p className="font-medium capitalize">{animal.especie}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground">Sexo</p>
              <p className="font-medium">{animal.sexo || 'No especificado'}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground">Fecha de Nacimiento</p>
              <p className="font-medium">
                {animal.fechaNacimiento
                  ? new Date(animal.fechaNacimiento).toLocaleDateString('es-CL')
                  : 'No especificada'}
              </p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground">Estado</p>
              <Badge variant={getEstadoBadgeVariant(animal.estado)}>
                {animal.estado}
              </Badge>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground">Fecha de Alta</p>
              <p className="font-medium">
                {new Date(animal.fechaAlta).toLocaleDateString('es-CL')}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Ubicación
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Titular</p>
              <p className="font-medium">
                {animal.titularActual?.nombreRazonSocial || 'No asignado'}
              </p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground">Establecimiento</p>
              <p className="font-medium">
                {animal.establecimientoActual?.nombre || 'No asignado'}
              </p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground">Lote</p>
              <p className="font-medium">
                {animal.lote?.nombre || 'Sin lote asignado'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Identificadores
          </CardTitle>
        </CardHeader>
        <CardContent>
          {animal.identificadores && animal.identificadores.length > 0 ? (
            <div className="space-y-3">
              {animal.identificadores.map((id) => (
                <div
                  key={id.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{id.tipo}</Badge>
                      <span className="font-mono font-medium">{id.codigo}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Asignado: {new Date(id.fechaAsignacion).toLocaleDateString('es-CL')}
                    </p>
                  </div>
                  <Badge variant={id.activo ? 'default' : 'secondary'}>
                    {id.activo ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-4">
              No hay identificadores registrados
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5" />
            Historial de Pesajes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {animal.pesajes && animal.pesajes.length > 0 ? (
            <div className="space-y-3">
              {animal.pesajes.slice(0, 5).map((pesaje) => (
                <div
                  key={pesaje.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{pesaje.peso} kg</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(pesaje.fechaHora).toLocaleDateString('es-CL')}
                    </p>
                  </div>
                  <Badge variant="outline">{pesaje.origenDato}</Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-4">
              No hay pesajes registrados
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
