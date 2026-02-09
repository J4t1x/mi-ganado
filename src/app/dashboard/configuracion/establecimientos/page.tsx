'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EstablecimientosTable, EstablecimientoForm } from '@/components/establecimientos';
import { establecimientosService } from '@/lib/api/establecimientos';
import { titularesService } from '@/lib/api/titulares';
import {
  EstablecimientoWithRelations,
  TipoEstablecimiento,
  EstadoGeneral,
  CreateEstablecimientoDto,
  UpdateEstablecimientoDto,
} from '@/types';
import { Plus, Search, Building2, MapPin, Users } from 'lucide-react';
import { toast } from 'sonner';

export default function EstablecimientosPage() {
  const [establecimientos, setEstablecimientos] = useState<EstablecimientoWithRelations[]>([]);
  const [titulares, setTitulares] = useState<Array<{ id: string; nombreRazonSocial: string; rut: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEstablecimiento, setEditingEstablecimiento] = useState<EstablecimientoWithRelations | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState<string>('all');
  const [filterTipo, setFilterTipo] = useState<string>('all');

  const [stats, setStats] = useState({
    total: 0,
    activos: 0,
    propios: 0,
  });

  const fetchTitulares = useCallback(async () => {
    try {
      const response = await titularesService.getAll({ limit: 100, page: 1 });
      setTitulares(response.data.map(t => ({
        id: t.id,
        nombreRazonSocial: t.nombreRazonSocial,
        rut: t.rut,
      })));
    } catch (error) {
      console.error('Error fetching titulares:', error);
      toast.error('Error al cargar los titulares');
    }
  }, []);

  const fetchEstablecimientos = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: Record<string, string> = {};
      if (searchTerm) params.search = searchTerm;
      if (filterEstado !== 'all') params.estado = filterEstado;
      if (filterTipo !== 'all') params.tipo = filterTipo;

      const response = await establecimientosService.getAll(params);
      setEstablecimientos(response.data);

      const activos = response.data.filter(
        (e) => e.estado === EstadoGeneral.ACTIVO
      ).length;
      const propios = response.data.filter(
        (e) => e.tipo === TipoEstablecimiento.PROPIO
      ).length;

      setStats({
        total: response.meta.total,
        activos,
        propios,
      });
    } catch (error) {
      console.error('Error fetching establecimientos:', error);
      toast.error('Error al cargar los establecimientos');
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, filterEstado, filterTipo]);

  useEffect(() => {
    fetchTitulares();
  }, [fetchTitulares]);

  useEffect(() => {
    fetchEstablecimientos();
  }, [fetchEstablecimientos]);

  const handleCreate = () => {
    setEditingEstablecimiento(null);
    setDialogOpen(true);
  };

  const handleEdit = (establecimiento: EstablecimientoWithRelations) => {
    setEditingEstablecimiento(establecimiento);
    setDialogOpen(true);
  };

  const handleSubmit = async (data: CreateEstablecimientoDto | UpdateEstablecimientoDto) => {
    setIsSubmitting(true);
    try {
      if (editingEstablecimiento) {
        await establecimientosService.update(editingEstablecimiento.id, data as UpdateEstablecimientoDto);
        toast.success('Establecimiento actualizado correctamente');
      } else {
        // Filtrar el campo 'estado' que no es aceptado en CreateEstablecimientoDto
        const { estado: _estado, ...createData } = data as CreateEstablecimientoDto & { estado?: string };
        await establecimientosService.create(createData as CreateEstablecimientoDto);
        toast.success('Establecimiento creado correctamente');
      }
      setDialogOpen(false);
      setEditingEstablecimiento(null);
      fetchEstablecimientos();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al guardar el establecimiento';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Está seguro de eliminar este establecimiento?')) {
      return;
    }

    try {
      await establecimientosService.delete(id);
      toast.success('Establecimiento eliminado correctamente');
      fetchEstablecimientos();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al eliminar el establecimiento';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Establecimientos</h1>
          <p className="text-muted-foreground">
            Gestiona los establecimientos ganaderos
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Establecimiento
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Establecimientos
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Registrados en el sistema
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Establecimientos Activos
            </CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activos}</div>
            <p className="text-xs text-muted-foreground">
              En operación
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Establecimientos Propios
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.propios}</div>
            <p className="text-xs text-muted-foreground">
              De propiedad directa
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre, ubicación o rol predial..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={filterEstado} onValueChange={setFilterEstado}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="ACTIVO">Activo</SelectItem>
                <SelectItem value="INACTIVO">Inactivo</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterTipo} onValueChange={setFilterTipo}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="PROPIO">Propio</SelectItem>
                <SelectItem value="SOCIO">Socio</SelectItem>
                <SelectItem value="EXTERNO">Externo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Listado de Establecimientos</CardTitle>
        </CardHeader>
        <CardContent>
          <EstablecimientosTable
            establecimientos={establecimientos}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingEstablecimiento ? 'Editar Establecimiento' : 'Nuevo Establecimiento'}
            </DialogTitle>
          </DialogHeader>
          <EstablecimientoForm
            establecimiento={editingEstablecimiento || undefined}
            titulares={titulares}
            onSubmit={handleSubmit}
            onCancel={() => setDialogOpen(false)}
            isLoading={isSubmitting}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
