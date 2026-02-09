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
import { TitularesTable, TitularForm } from '@/components/titulares';
import { titularesService } from '@/lib/api/titulares';
import {
  TitularWithEstablecimientos,
  TipoTitular,
  EstadoGeneral,
  CreateTitularDto,
  UpdateTitularDto,
} from '@/types';
import { Plus, Search, Users, Building, UserCheck } from 'lucide-react';
import { toast } from 'sonner';

export default function TitularesPage() {
  const [titulares, setTitulares] = useState<TitularWithEstablecimientos[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTitular, setEditingTitular] = useState<TitularWithEstablecimientos | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState<string>('all');
  const [filterTipo, setFilterTipo] = useState<string>('all');

  const [stats, setStats] = useState({
    total: 0,
    activos: 0,
    empresas: 0,
  });

  const fetchTitulares = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: Record<string, string> = {};
      if (searchTerm) params.search = searchTerm;
      if (filterEstado !== 'all') params.estado = filterEstado;
      if (filterTipo !== 'all') params.tipo = filterTipo;

      const response = await titularesService.getAll(params);
      setTitulares(response.data);

      const activos = response.data.filter(
        (t) => t.estado === EstadoGeneral.ACTIVO
      ).length;
      const empresas = response.data.filter(
        (t) => t.tipo === TipoTitular.EMPRESA
      ).length;

      setStats({
        total: response.meta.total,
        activos,
        empresas,
      });
    } catch (error) {
      console.error('Error fetching titulares:', error);
      toast.error('Error al cargar los titulares');
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, filterEstado, filterTipo]);

  useEffect(() => {
    fetchTitulares();
  }, [fetchTitulares]);

  const handleCreate = () => {
    setEditingTitular(null);
    setDialogOpen(true);
  };

  const handleEdit = (titular: TitularWithEstablecimientos) => {
    setEditingTitular(titular);
    setDialogOpen(true);
  };

  const handleSubmit = async (data: CreateTitularDto | UpdateTitularDto) => {
    setIsSubmitting(true);
    try {
      if (editingTitular) {
        // Filtrar el campo 'rut' que no es aceptado en UpdateTitularDto
        const { rut: _rut, ...updateData } = data as UpdateTitularDto & { rut?: string };
        await titularesService.update(editingTitular.id, updateData as UpdateTitularDto);
        toast.success('Titular actualizado correctamente');
      } else {
        // Filtrar el campo 'estado' que no es aceptado en CreateTitularDto
        const { estado: _estado, ...createData } = data as CreateTitularDto & { estado?: string };
        await titularesService.create(createData as CreateTitularDto);
        toast.success('Titular creado correctamente');
      }
      setDialogOpen(false);
      setEditingTitular(null);
      fetchTitulares();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al guardar el titular';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await titularesService.delete(id);
      toast.success('Titular eliminado correctamente');
      fetchTitulares();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al eliminar el titular';
      toast.error(errorMessage);
    }
  };

  const handleToggleEstado = async (id: string) => {
    try {
      await titularesService.toggleEstado(id);
      toast.success('Estado actualizado correctamente');
      fetchTitulares();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al cambiar el estado';
      toast.error(errorMessage);
    }
  };

  const handleCancel = () => {
    setDialogOpen(false);
    setEditingTitular(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Titulares</h1>
          <p className="text-muted-foreground">
            Gestiona los titulares de establecimientos y ganado
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Titular
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Titulares</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activos</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activos}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Empresas</CardTitle>
            <Building className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.empresas}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por RUT o nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterTipo} onValueChange={setFilterTipo}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value={TipoTitular.PERSONA_NATURAL}>
                  Persona Natural
                </SelectItem>
                <SelectItem value={TipoTitular.EMPRESA}>Empresa</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterEstado} onValueChange={setFilterEstado}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value={EstadoGeneral.ACTIVO}>Activo</SelectItem>
                <SelectItem value={EstadoGeneral.INACTIVO}>Inactivo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <TitularesTable
              titulares={titulares}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleEstado={handleToggleEstado}
            />
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingTitular ? 'Editar Titular' : 'Nuevo Titular'}
            </DialogTitle>
          </DialogHeader>
          <TitularForm
            titular={editingTitular || undefined}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isSubmitting}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
