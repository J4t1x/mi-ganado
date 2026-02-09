'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
  Loader2,
  Beef,
  Scale,
  Building2,
  Package,
  Plus,
  Trash2,
  Search,
  RefreshCw,
  TrendingUp,
} from 'lucide-react';
import { lotesService, LoteWithStats } from '@/lib/api/lotes';
import { animalesService } from '@/lib/api/animales';
import { pesajesService, SesionPesaje } from '@/lib/api/pesajes';
import { toast } from 'sonner';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface AnimalInLote {
  id: string;
  especie: string;
  sexo?: string;
  estado: string;
  loteId?: string;
  identificadores?: Array<{
    id: string;
    tipo: string;
    codigo: string;
    activo: boolean;
  }>;
  establecimientoActual?: {
    id: string;
    nombre: string;
  };
}

export default function LoteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [lote, setLote] = useState<LoteWithStats | null>(null);
  const [animales, setAnimales] = useState<AnimalInLote[]>([]);
  const [loading, setLoading] = useState(true);
  const [addAnimalsDialogOpen, setAddAnimalsDialogOpen] = useState(false);
  const [availableAnimals, setAvailableAnimals] = useState<AnimalInLote[]>([]);
  const [selectedAnimalIds, setSelectedAnimalIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [animalToRemove, setAnimalToRemove] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState(false);
  const [sesiones, setSesiones] = useState<SesionPesaje[]>([]);

  useEffect(() => {
    loadData();
  }, [params.id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [loteData, animalesData, sesionesData] = await Promise.all([
        lotesService.getById(params.id as string),
        lotesService.getAnimales(params.id as string),
        pesajesService.getSesiones({ loteId: params.id as string, limit: 100 }),
      ]);
      setLote(loteData);
      setAnimales(animalesData);
      setSesiones(sesionesData.data);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Error al cargar datos del lote');
      router.push('/dashboard/lotes');
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableAnimals = async () => {
    if (!lote) return;
    
    try {
      const response = await animalesService.getAll({
        establecimientoId: lote.establecimientoId,
        limit: 100,
      });
      
      const available = response.data.filter(
        (animal) => !animal.loteId || animal.loteId === lote.id
      );
      setAvailableAnimals(available);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Error al cargar animales disponibles');
    }
  };

  const handleOpenAddAnimalsDialog = () => {
    setAddAnimalsDialogOpen(true);
    setSelectedAnimalIds([]);
    loadAvailableAnimals();
  };

  const handleAddAnimals = async () => {
    if (selectedAnimalIds.length === 0) {
      toast.error('Selecciona al menos un animal');
      return;
    }

    setLoadingAction(true);
    try {
      await lotesService.addAnimales(params.id as string, selectedAnimalIds);
      toast.success(`${selectedAnimalIds.length} animal(es) agregado(s) al lote`);
      setAddAnimalsDialogOpen(false);
      setSelectedAnimalIds([]);
      loadData();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Error al agregar animales');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleRemoveAnimal = async () => {
    if (!animalToRemove) return;

    setLoadingAction(true);
    try {
      await lotesService.removeAnimales(params.id as string, [animalToRemove]);
      toast.success('Animal removido del lote');
      setRemoveDialogOpen(false);
      setAnimalToRemove(null);
      loadData();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Error al remover animal');
    } finally {
      setLoadingAction(false);
    }
  };

  const toggleAnimalSelection = (animalId: string) => {
    setSelectedAnimalIds((prev) =>
      prev.includes(animalId)
        ? prev.filter((id) => id !== animalId)
        : [...prev, animalId]
    );
  };

  const filteredAvailableAnimals = availableAnimals.filter((animal) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      animal.identificadores?.some((id) =>
        id.codigo.toLowerCase().includes(searchLower)
      ) || animal.especie.toLowerCase().includes(searchLower)
    );
  });

  const getIdentificadorPrincipal = (animal: AnimalInLote) => {
    const diio = animal.identificadores?.find(
      (id) => id.tipo === 'DIIO_VISUAL' && id.activo
    );
    if (diio) return diio.codigo;

    const rfid = animal.identificadores?.find(
      (id) => id.tipo === 'RFID' && id.activo
    );
    if (rfid) return rfid.codigo;

    const activo = animal.identificadores?.find((id) => id.activo);
    return activo?.codigo || 'Sin identificador';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!lote) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold">{lote.nombre}</h1>
          <p className="text-muted-foreground">
            Detalle del lote y animales asignados
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={loadData}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualizar
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Animales</CardTitle>
            <Beef className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lote._count?.animales || 0}</div>
            <p className="text-xs text-muted-foreground">
              Total en el lote
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Peso Promedio</CardTitle>
            <Scale className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {lote.pesoPromedio ? `${Math.round(lote.pesoPromedio)} kg` : '-'}
            </div>
            <p className="text-xs text-muted-foreground">
              Última sesión de pesaje
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Establecimiento</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold truncate">
              {lote.establecimiento?.nombre || 'Sin establecimiento'}
            </div>
            <Badge variant={lote.estado === 'ACTIVO' ? 'default' : 'secondary'}>
              {lote.estado}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {lote.descripcion && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Descripción</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{lote.descripcion}</p>
          </CardContent>
        </Card>
      )}

      {/* SP-15: Advanced Stats */}
      {sesiones.length > 0 && (() => {
        const sorted = [...sesiones]
          .filter((s) => s.pesoPromedio)
          .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

        const chartData = sorted.map((s) => ({
          fecha: new Date(s.fecha).toLocaleDateString('es-CL'),
          peso: Math.round(s.pesoPromedio || 0),
          pesajes: s.totalPesajes || 0,
        }));

        let gdp: number | null = null;
        if (sorted.length >= 2) {
          const first = sorted[0];
          const last = sorted[sorted.length - 1];
          const days = Math.max(
            1,
            Math.round(
              (new Date(last.fecha).getTime() - new Date(first.fecha).getTime()) /
                (1000 * 60 * 60 * 24)
            )
          );
          gdp = ((last.pesoPromedio || 0) - (first.pesoPromedio || 0)) / days;
        }

        const pesos = sorted.map((s) => s.pesoPromedio || 0);
        const pesoMin = Math.round(Math.min(...pesos));
        const pesoMax = Math.round(Math.max(...pesos));
        const dispersion = pesoMax - pesoMin;
        const totalPesajes = sesiones.reduce((a, s) => a + (s.totalPesajes || 0), 0);

        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Evolución de Peso del Lote
              </CardTitle>
              <CardDescription>
                {sorted.length} sesiones de pesaje — {totalPesajes} pesajes totales
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="text-center p-2 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">Peso Prom. Actual</p>
                  <p className="text-lg font-bold">
                    {lote.pesoPromedio ? `${Math.round(lote.pesoPromedio)} kg` : '-'}
                  </p>
                </div>
                <div className="text-center p-2 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">Mínimo</p>
                  <p className="text-lg font-bold">{pesoMin} kg</p>
                </div>
                <div className="text-center p-2 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">Máximo</p>
                  <p className="text-lg font-bold">{pesoMax} kg</p>
                </div>
                <div className="text-center p-2 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">Dispersión</p>
                  <p className="text-lg font-bold">{dispersion} kg</p>
                </div>
                <div className="text-center p-2 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">GDP</p>
                  <p className={`text-lg font-bold ${gdp !== null && gdp >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {gdp !== null ? `${gdp >= 0 ? '+' : ''}${gdp.toFixed(2)} kg/d` : '-'}
                  </p>
                </div>
              </div>

              {sorted.length >= 2 && (
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="fecha" tick={{ fontSize: 11 }} />
                    <YAxis
                      domain={[Math.floor(pesoMin * 0.95), Math.ceil(pesoMax * 1.05)]}
                      tick={{ fontSize: 11 }}
                      unit=" kg"
                    />
                    <Tooltip
                      formatter={(value, name) => {
                        if (name === 'peso') return [`${value} kg`, 'Peso Prom.'];
                        return [value, 'Pesajes'];
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="peso"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        );
      })()}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Animales en el Lote</CardTitle>
              <CardDescription>
                Listado de animales asignados a este lote
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleOpenAddAnimalsDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Agregar Animales
              </Button>
              <Button asChild>
                <Link href={`/dashboard/pesajes?loteId=${lote.id}`}>
                  <Scale className="h-4 w-4 mr-2" />
                  Registrar Pesaje
                </Link>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {animales.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-center">
                No hay animales asignados a este lote
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={handleOpenAddAnimalsDialog}
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Animales
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Identificador</TableHead>
                  <TableHead>Especie</TableHead>
                  <TableHead>Sexo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {animales.map((animal) => (
                  <TableRow key={animal.id}>
                    <TableCell className="font-medium">
                      {getIdentificadorPrincipal(animal)}
                    </TableCell>
                    <TableCell>{animal.especie}</TableCell>
                    <TableCell>{animal.sexo || '-'}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          animal.estado === 'ACTIVO' ? 'default' : 'secondary'
                        }
                      >
                        {animal.estado}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/dashboard/animales/${animal.id}`}>
                            Ver detalle
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setAnimalToRemove(animal.id);
                            setRemoveDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={addAnimalsDialogOpen} onOpenChange={setAddAnimalsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Agregar Animales al Lote</DialogTitle>
            <DialogDescription>
              Selecciona los animales que deseas agregar a este lote
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por identificador..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Separator />
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {filteredAvailableAnimals.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No hay animales disponibles para agregar
                </p>
              ) : (
                filteredAvailableAnimals.map((animal) => (
                  <div
                    key={animal.id}
                    className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent cursor-pointer"
                    onClick={() => toggleAnimalSelection(animal.id)}
                  >
                    <Checkbox
                      checked={selectedAnimalIds.includes(animal.id)}
                      onCheckedChange={() => toggleAnimalSelection(animal.id)}
                    />
                    <div className="flex-1">
                      <p className="font-medium">
                        {getIdentificadorPrincipal(animal)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {animal.especie} - {animal.sexo || 'Sin sexo'}
                      </p>
                    </div>
                    <Badge
                      variant={animal.estado === 'ACTIVO' ? 'default' : 'secondary'}
                    >
                      {animal.estado}
                    </Badge>
                  </div>
                ))
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              {selectedAnimalIds.length} animal(es) seleccionado(s)
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAddAnimalsDialogOpen(false)}
              disabled={loadingAction}
            >
              Cancelar
            </Button>
            <Button onClick={handleAddAnimals} disabled={loadingAction}>
              {loadingAction ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Agregando...
                </>
              ) : (
                <>Agregar Animales</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Remover animal del lote?</AlertDialogTitle>
            <AlertDialogDescription>
              El animal será removido del lote pero no será eliminado del sistema.
              Podrás agregarlo nuevamente más tarde.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loadingAction}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveAnimal}
              disabled={loadingAction}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {loadingAction ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Removiendo...
                </>
              ) : (
                <>Remover</>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
