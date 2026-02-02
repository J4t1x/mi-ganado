'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EstablecimientoWithRelations, EstadoGeneral, TipoEstablecimiento } from '@/types';
import { MoreHorizontal, Pencil, Trash2, MapPin, Building2 } from 'lucide-react';

interface EstablecimientosTableProps {
  establecimientos: EstablecimientoWithRelations[];
  onEdit: (establecimiento: EstablecimientoWithRelations) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

const tipoLabels: Record<TipoEstablecimiento, string> = {
  [TipoEstablecimiento.PROPIO]: 'Propio',
  [TipoEstablecimiento.SOCIO]: 'Socio',
  [TipoEstablecimiento.EXTERNO]: 'Externo',
};

const tipoColors: Record<TipoEstablecimiento, string> = {
  [TipoEstablecimiento.PROPIO]: 'bg-blue-100 text-blue-800',
  [TipoEstablecimiento.SOCIO]: 'bg-green-100 text-green-800',
  [TipoEstablecimiento.EXTERNO]: 'bg-orange-100 text-orange-800',
};

export function EstablecimientosTable({
  establecimientos,
  onEdit,
  onDelete,
  isLoading = false,
}: EstablecimientosTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Cargando...</div>
      </div>
    );
  }

  if (establecimientos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No hay establecimientos</h3>
        <p className="text-muted-foreground">
          Comienza creando tu primer establecimiento
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Titular</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Rol Predial</TableHead>
            <TableHead>Ubicación</TableHead>
            <TableHead>Lotes</TableHead>
            <TableHead>Animales</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {establecimientos.map((establecimiento) => (
            <TableRow key={establecimiento.id}>
              <TableCell className="font-medium">
                {establecimiento.nombre}
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {establecimiento.titular?.nombreRazonSocial}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {establecimiento.titular?.rut}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={tipoColors[establecimiento.tipo]}
                >
                  {tipoLabels[establecimiento.tipo]}
                </Badge>
              </TableCell>
              <TableCell>
                {establecimiento.rolPredial || (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell>
                {establecimiento.ubicacion ? (
                  <div className="flex items-center gap-1 max-w-[200px]">
                    <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm truncate">
                      {establecimiento.ubicacion}
                    </span>
                  </div>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell>
                <span className="text-sm">
                  {establecimiento._count?.lotes || 0}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-sm">
                  {establecimiento._count?.animales || 0}
                </span>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    establecimiento.estado === EstadoGeneral.ACTIVO
                      ? 'default'
                      : 'secondary'
                  }
                >
                  {establecimiento.estado === EstadoGeneral.ACTIVO
                    ? 'Activo'
                    : 'Inactivo'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(establecimiento)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(establecimiento.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
