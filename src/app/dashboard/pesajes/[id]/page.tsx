'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  ArrowLeft,
  Scale,
  Plus,
  Trash2,
  Loader2,
  Calendar,
  User,
  Package,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';
import { pesajesService, SesionPesaje, Pesaje } from '@/lib/api/pesajes';
import { animalesService } from '@/lib/api/animales';
import { AnimalWithRelations } from '@/types';
import { toast } from 'sonner';

interface SesionFull extends SesionPesaje {
  pesajes: Pesaje[];
  estadisticas: {
    total?: number;
    promedio?: number;
    minimo?: number;
    maximo?: number;
    desviacion?: number;
  };
}

export default function SesionPesajeDetallePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [sesion, setSesion] = useState<SesionFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [adding, setAdding] = useState(false);

  // Search animals for adding pesaje
  const [animalSearch, setAnimalSearch] = useState('');
  const [searchResults, setSearchResults] = useState<AnimalWithRelations[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedAnimalId, setSelectedAnimalId] = useState('');
  const [selectedAnimalLabel, setSelectedAnimalLabel] = useState('');
  const [pesoInput, setPesoInput] = useState('');

  useEffect(() => {
    loadSesion();
  }, [id]);

  const loadSesion = async () => {
    setLoading(true);
    try {
      const data = await pesajesService.getSesionById(id);
      setSesion(data as SesionFull);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Error al cargar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchAnimals = async (search: string) => {
    setAnimalSearch(search);
    if (search.length < 2) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    try {
      const res = await animalesService.getAll({ search, limit: 20 });
      setSearchResults(res.data);
    } catch {
      // silent fail on search
    } finally {
      setSearching(false);
    }
  };

  const handleSelectAnimal = (animal: AnimalWithRelations) => {
    setSelectedAnimalId(animal.id);
    const diio = animal.identificadores?.find((i) => i.tipo === 'DIIO_VISUAL')?.codigo || animal.id.slice(0, 8);
    setSelectedAnimalLabel(`${diio} - ${animal.categoria || ''} ${animal.raza?.nombre || ''}`);
    setSearchResults([]);
    setAnimalSearch('');
  };

  const handleAddPesaje = async () => {
    if (!selectedAnimalId) {
      toast.error('Selecciona un animal');
      return;
    }
    const peso = parseFloat(pesoInput);
    if (isNaN(peso) || peso <= 0) {
      toast.error('Ingresa un peso válido');
      return;
    }

    setAdding(true);
    try {
      await pesajesService.addPesaje(id, {
        animalId: selectedAnimalId,
        peso,
        origenDato: 'MANUAL',
      });
      toast.success('Pesaje agregado exitosamente');
      setAddDialogOpen(false);
      setSelectedAnimalId('');
      setSelectedAnimalLabel('');
      setPesoInput('');
      loadSesion();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Error al agregar pesaje');
    } finally {
      setAdding(false);
    }
  };

  const handleDeletePesaje = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await pesajesService.deletePesaje(deleteId);
      toast.success('Pesaje eliminado');
      setDeleteId(null);
      loadSesion();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Error al eliminar pesaje');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!sesion) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <div className="text-center py-20 text-muted-foreground">
          Sesión de pesaje no encontrada
        </div>
      </div>
    );
  }

  const pesajes = sesion.pesajes || [];
  const stats = sesion.estadisticas || {};
  const promedio = stats.promedio || (pesajes.length > 0 ? pesajes.reduce((a, p) => a + p.peso, 0) / pesajes.length : 0);
  const minimo = stats.minimo || (pesajes.length > 0 ? Math.min(...pesajes.map((p) => p.peso)) : 0);
  const maximo = stats.maximo || (pesajes.length > 0 ? Math.max(...pesajes.map((p) => p.peso)) : 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold">
            Sesión de Pesaje
          </h1>
          <p className="text-muted-foreground">
            {new Date(sesion.fecha).toLocaleDateString('es-CL', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <Button onClick={() => setAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Agregar Pesaje
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Package className="h-4 w-4" />
              Lote
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">{sesion.lote?.nombre || 'Sin lote'}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <User className="h-4 w-4" />
              Operador
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">{sesion.operador || '-'}</p>
            <p className="text-xs text-muted-foreground">{sesion.equipo || '-'}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Scale className="h-4 w-4" />
              Pesajes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{pesajes.length}</p>
            <p className="text-xs text-muted-foreground">animales pesados</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Promedio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {promedio > 0 ? `${Math.round(promedio)} kg` : '-'}
            </p>
            <p className="text-xs text-muted-foreground">
              {minimo > 0 && maximo > 0 ? `Min: ${Math.round(minimo)} / Max: ${Math.round(maximo)} kg` : ''}
            </p>
          </CardContent>
        </Card>
      </div>

      {sesion.observaciones && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Observaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{sesion.observaciones}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Pesajes Registrados</CardTitle>
              <CardDescription>{pesajes.length} pesaje(s) en esta sesión</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {pesajes.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Scale className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Sin pesajes registrados</p>
              <p className="text-sm mt-1">Agrega pesajes manualmente o importa desde XR5000</p>
              <Button className="mt-4" onClick={() => setAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Agregar Pesaje
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>DIIO</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead className="text-right">Peso (kg)</TableHead>
                    <TableHead>Origen</TableHead>
                    <TableHead>Hora</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pesajes.map((pesaje, idx) => {
                    const animal = pesaje.animal;
                    const diio = (animal as AnimalWithRelations)?.identificadores?.find(
                      (i) => i.tipo === 'DIIO_VISUAL'
                    )?.codigo || '-';
                    const diffFromAvg = promedio > 0 ? pesaje.peso - promedio : 0;

                    return (
                      <TableRow key={pesaje.id}>
                        <TableCell className="text-muted-foreground">{idx + 1}</TableCell>
                        <TableCell>
                          <Link
                            href={`/dashboard/animales/${pesaje.animalId}`}
                            className="font-mono text-sm text-primary hover:underline"
                          >
                            {diio}
                          </Link>
                        </TableCell>
                        <TableCell>{(animal as AnimalWithRelations)?.categoria || '-'}</TableCell>
                        <TableCell className="text-right">
                          <span className="font-semibold text-lg">{pesaje.peso}</span>
                          {diffFromAvg !== 0 && (
                            <span className={`ml-2 text-xs ${diffFromAvg > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {diffFromAvg > 0 ? (
                                <TrendingUp className="h-3 w-3 inline mr-0.5" />
                              ) : (
                                <TrendingDown className="h-3 w-3 inline mr-0.5" />
                              )}
                              {diffFromAvg > 0 ? '+' : ''}{Math.round(diffFromAvg)}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={pesaje.origenDato === 'XR5000' ? 'default' : 'outline'}>
                            {pesaje.origenDato}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {new Date(pesaje.fechaHora).toLocaleTimeString('es-CL', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </TableCell>
                        <TableCell>
                          {pesaje.valido ? (
                            <Badge variant="outline" className="text-green-600 border-green-600">Válido</Badge>
                          ) : (
                            <Badge variant="destructive">Inválido</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => setDeleteId(pesaje.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Pesaje Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Pesaje Manual</DialogTitle>
            <DialogDescription>
              Registra el peso de un animal en esta sesión
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Animal</Label>
              {selectedAnimalId ? (
                <div className="flex items-center gap-2">
                  <div className="flex-1 p-2 border rounded-md text-sm bg-muted">
                    {selectedAnimalLabel}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedAnimalId('');
                      setSelectedAnimalLabel('');
                    }}
                  >
                    Cambiar
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Input
                    placeholder="Buscar por DIIO, categoría..."
                    value={animalSearch}
                    onChange={(e) => handleSearchAnimals(e.target.value)}
                  />
                  {searching && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Buscando...
                    </div>
                  )}
                  {searchResults.length > 0 && (
                    <div className="border rounded-md max-h-40 overflow-y-auto">
                      {searchResults.map((animal) => {
                        const diio = animal.identificadores?.find((i) => i.tipo === 'DIIO_VISUAL')?.codigo || '-';
                        return (
                          <div
                            key={animal.id}
                            className="p-2 hover:bg-muted cursor-pointer text-sm flex items-center gap-2"
                            onClick={() => handleSelectAnimal(animal)}
                          >
                            <span className="font-mono">{diio}</span>
                            <span className="text-muted-foreground">
                              {animal.categoria || ''} {animal.raza?.nombre || ''}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label>Peso (kg)</Label>
              <Input
                type="number"
                step="0.1"
                min="0"
                placeholder="Ej: 450.5"
                value={pesoInput}
                onChange={(e) => setPesoInput(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddPesaje} disabled={adding}>
              {adding && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Agregar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar pesaje?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El pesaje será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePesaje} disabled={deleting}>
              {deleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
