'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Plus,
  Search,
  Loader2,
  RefreshCw,
  MoreVertical,
  Pencil,
  Trash2,
  Dna,
} from 'lucide-react';
import { razasService, CreateRazaDto, UpdateRazaDto } from '@/lib/api/razas';
import { Raza, Especie } from '@/types';
import { toast } from 'sonner';

const ESPECIES = [
  { value: 'BOVINO', label: 'Bovino' },
  { value: 'OVINO', label: 'Ovino' },
  { value: 'CAPRINO', label: 'Caprino' },
  { value: 'PORCINO', label: 'Porcino' },
  { value: 'EQUINO', label: 'Equino' },
  { value: 'CAMELLIDO', label: 'Camélido' },
];

export default function RazasPage() {
  const [razas, setRazas] = useState<Raza[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [especieFilter, setEspecieFilter] = useState<string>('todas');

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRaza, setEditingRaza] = useState<Raza | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    nombre: '',
    especie: '' as Especie | '',
    descripcion: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await razasService.getAll({ limit: 200 });
      setRazas(res.data);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Error al cargar razas');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingRaza(null);
    setFormData({ nombre: '', especie: '', descripcion: '' });
    setDialogOpen(true);
  };

  const openEdit = (raza: Raza) => {
    setEditingRaza(raza);
    setFormData({
      nombre: raza.nombre,
      especie: raza.especie,
      descripcion: raza.descripcion || '',
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.nombre.trim()) {
      toast.error('El nombre es requerido');
      return;
    }
    if (!formData.especie) {
      toast.error('La especie es requerida');
      return;
    }

    setSaving(true);
    try {
      if (editingRaza) {
        await razasService.update(editingRaza.id, {
          nombre: formData.nombre,
          especie: formData.especie as Especie,
          descripcion: formData.descripcion || undefined,
        });
        toast.success('Raza actualizada exitosamente');
      } else {
        await razasService.create({
          nombre: formData.nombre,
          especie: formData.especie as Especie,
          descripcion: formData.descripcion || undefined,
        });
        toast.success('Raza creada exitosamente');
      }
      setDialogOpen(false);
      loadData();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Error al guardar raza');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleEstado = async (raza: Raza) => {
    try {
      const newEstado = raza.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';
      await razasService.update(raza.id, { estado: newEstado });
      toast.success(`Raza ${newEstado === 'ACTIVO' ? 'activada' : 'desactivada'}`);
      loadData();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Error al cambiar estado');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await razasService.delete(deleteId);
      toast.success('Raza eliminada');
      setDeleteId(null);
      loadData();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Error al eliminar raza');
    } finally {
      setDeleting(false);
    }
  };

  const filteredRazas = razas.filter((raza) => {
    const matchesSearch = raza.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEspecie = especieFilter === 'todas' || raza.especie === especieFilter;
    return matchesSearch && matchesEspecie;
  });

  const razasByEspecie = ESPECIES.map((esp) => ({
    ...esp,
    count: razas.filter((r) => r.especie === esp.value).length,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Razas</h1>
          <p className="text-muted-foreground">
            Gestiona el catálogo de razas por especie
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={loadData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Raza
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {razasByEspecie.map((esp) => (
          <Card
            key={esp.value}
            className={`cursor-pointer transition-colors ${
              especieFilter === esp.value ? 'border-primary' : ''
            }`}
            onClick={() =>
              setEspecieFilter(especieFilter === esp.value ? 'todas' : esp.value)
            }
          >
            <CardContent className="pt-4 pb-3">
              <div className="text-center">
                <p className="text-2xl font-bold">{esp.count}</p>
                <p className="text-xs text-muted-foreground">{esp.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <CardTitle className="flex items-center gap-2">
              <Dna className="h-5 w-5" />
              Catálogo de Razas ({filteredRazas.length})
            </CardTitle>
            <div className="relative flex-1 max-w-sm ml-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar razas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : filteredRazas.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Dna className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No se encontraron razas</p>
              <p className="text-sm mt-1">Crea una nueva raza para comenzar</p>
              <Button className="mt-4" onClick={openCreate}>
                <Plus className="h-4 w-4 mr-2" />
                Nueva Raza
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Especie</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRazas.map((raza) => (
                    <TableRow key={raza.id}>
                      <TableCell className="font-medium">{raza.nombre}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {ESPECIES.find((e) => e.value === raza.especie)?.label || raza.especie}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground max-w-xs truncate">
                        {raza.descripcion || '-'}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={raza.estado === 'ACTIVO' ? 'default' : 'secondary'}
                          className="cursor-pointer"
                          onClick={() => handleToggleEstado(raza)}
                        >
                          {raza.estado}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEdit(raza)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => setDeleteId(raza.id)}
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
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingRaza ? 'Editar Raza' : 'Nueva Raza'}</DialogTitle>
            <DialogDescription>
              {editingRaza
                ? 'Modifica los datos de la raza'
                : 'Agrega una nueva raza al catálogo'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nombre</Label>
              <Input
                placeholder="Ej: Angus, Hereford, Holstein..."
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Especie</Label>
              <Select
                value={formData.especie}
                onValueChange={(val) => setFormData({ ...formData, especie: val as Especie })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona la especie" />
                </SelectTrigger>
                <SelectContent>
                  {ESPECIES.map((esp) => (
                    <SelectItem key={esp.value} value={esp.value}>
                      {esp.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Descripción (opcional)</Label>
              <Textarea
                placeholder="Características de la raza..."
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingRaza ? 'Guardar' : 'Crear'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar raza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La raza será eliminada permanentemente.
              Si tiene animales asociados, considera desactivarla en su lugar.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting}>
              {deleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
