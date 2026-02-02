'use client';

import { useState } from 'react';
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TitularWithEstablecimientos, TipoTitular, EstadoGeneral } from '@/types';
import {
  MoreVertical,
  Pencil,
  Trash2,
  Building2,
  Eye,
  Power,
  User,
  Building,
} from 'lucide-react';
import Link from 'next/link';

interface TitularesTableProps {
  titulares: TitularWithEstablecimientos[];
  onEdit: (titular: TitularWithEstablecimientos) => void;
  onDelete: (id: string) => Promise<void>;
  onToggleEstado: (id: string) => Promise<void>;
  isLoading?: boolean;
}

export function TitularesTable({
  titulares,
  onEdit,
  onDelete,
  onToggleEstado,
}: TitularesTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [titularToDelete, setTitularToDelete] = useState<TitularWithEstablecimientos | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (titular: TitularWithEstablecimientos) => {
    setTitularToDelete(titular);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!titularToDelete) return;
    setIsDeleting(true);
    try {
      await onDelete(titularToDelete.id);
      setDeleteDialogOpen(false);
      setTitularToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const getTipoLabel = (tipo: TipoTitular) => {
    return tipo === TipoTitular.PERSONA_NATURAL ? 'Persona Natural' : 'Empresa';
  };

  const getTipoIcon = (tipo: TipoTitular) => {
    return tipo === TipoTitular.PERSONA_NATURAL ? User : Building;
  };

  if (titulares.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
        <User className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No hay titulares</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Comienza agregando un nuevo titular para gestionar tus establecimientos y ganado.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>RUT</TableHead>
              <TableHead>Nombre / Razón Social</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead className="text-center">Establecimientos</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {titulares.map((titular) => {
              const TipoIcon = getTipoIcon(titular.tipo);
              return (
                <TableRow key={titular.id}>
                  <TableCell className="font-mono text-sm">
                    {titular.rut}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <TipoIcon className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-medium">{titular.nombreRazonSocial}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {getTipoLabel(titular.tipo)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {titular.contacto || '-'}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary">
                      {titular._count?.establecimientos ?? titular.establecimientos?.length ?? 0}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={titular.estado === EstadoGeneral.ACTIVO ? 'default' : 'secondary'}
                      className={
                        titular.estado === EstadoGeneral.ACTIVO
                          ? 'bg-green-100 text-green-800 hover:bg-green-100'
                          : 'bg-gray-100 text-gray-600'
                      }
                    >
                      {titular.estado === EstadoGeneral.ACTIVO ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Abrir menú</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/configuracion/titulares/${titular.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver detalle
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(titular)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/configuracion/establecimientos?titular=${titular.id}`}>
                            <Building2 className="mr-2 h-4 w-4" />
                            Ver establecimientos
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onToggleEstado(titular.id)}>
                          <Power className="mr-2 h-4 w-4" />
                          {titular.estado === EstadoGeneral.ACTIVO ? 'Desactivar' : 'Activar'}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(titular)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Titular</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar a{' '}
              <strong>{titularToDelete?.nombreRazonSocial}</strong>?
              <br />
              <br />
              Esta acción no se puede deshacer. Se eliminarán también todos los
              establecimientos y datos asociados a este titular.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Eliminando...' : 'Eliminar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
