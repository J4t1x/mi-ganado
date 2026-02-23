'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Scale,
  Trash2,
  Download,
  Upload,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { animalesService } from '@/lib/api/animales';
import { AnimalWithRelations, TipoIdentificador } from '@/types';
import { toast } from 'sonner';
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

function downloadCSV(filename: string, headers: string[], rows: string[][]) {
  const bom = '\uFEFF';
  const csv = bom + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function getStatusBadgeVariant(estado: string) {
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
}

export default function AnimalesPage() {
  const [animales, setAnimales] = useState<AnimalWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [estadoFilter, setEstadoFilter] = useState<string>('todos');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [animalToDelete, setAnimalToDelete] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    loadAnimales();
  }, [currentPage, estadoFilter]);

  const loadAnimales = async () => {
    setLoading(true);
    try {
      const params: { page: number; limit: number; estado?: string; search?: string } = {
        page: currentPage,
        limit: 10,
      };
      
      if (estadoFilter !== 'todos') {
        params.estado = estadoFilter;
      }
      
      if (searchTerm) {
        params.search = searchTerm;
      }

      const response = await animalesService.getAll(params);
      setAnimales(response.data);
      setTotal(response.meta.total);
      setTotalPages(response.meta.totalPages);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Error al cargar animales');
      setAnimales([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    loadAnimales();
  };

  const handleDelete = async () => {
    if (!animalToDelete) return;

    try {
      await animalesService.delete(animalToDelete);
      toast.success('Animal eliminado exitosamente');
      loadAnimales();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Error al eliminar animal');
    } finally {
      setDeleteDialogOpen(false);
      setAnimalToDelete(null);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const params: { limit: number; estado?: string; search?: string } = { limit: 1000 };
      if (estadoFilter !== 'todos') params.estado = estadoFilter;
      if (searchTerm) params.search = searchTerm;

      const response = await animalesService.getAll(params);
      const headers = ['DIIO', 'RFID', 'Especie', 'Raza', 'Sexo', 'Categoría', 'Estado', 'Establecimiento', 'Lote', 'Último Peso (kg)', 'Fecha Alta'];
      const rows = response.data.map((a) => [
        a.identificadores?.find((i) => i.tipo === 'DIIO_VISUAL' && i.activo)?.codigo || '-',
        a.identificadores?.find((i) => i.tipo === 'RFID' && i.activo)?.codigo || '-',
        a.especie || '-',
        a.raza?.nombre || '-',
        a.sexo || '-',
        a.categoria || '-',
        a.estado,
        a.establecimientoActual?.nombre || '-',
        a.lote?.nombre || '-',
        a.pesajes && a.pesajes.length > 0
          ? [...a.pesajes].sort((x, y) => new Date(y.fechaHora).getTime() - new Date(x.fechaHora).getTime())[0].peso.toString()
          : '-',
        new Date(a.fechaAlta).toLocaleDateString('es-CL'),
      ]);
      downloadCSV(`animales_${new Date().toISOString().split('T')[0]}.csv`, headers, rows);
      toast.success(`${response.data.length} animales exportados`);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Error al exportar');
    } finally {
      setExporting(false);
    }
  };

  const getIdentificador = (animal: AnimalWithRelations, tipo: TipoIdentificador) => {
    const id = animal.identificadores?.find(i => i.tipo === tipo && i.activo);
    return id?.codigo || '-';
  };

  const getUltimoPeso = (animal: AnimalWithRelations) => {
    if (!animal.pesajes || animal.pesajes.length === 0) return null;
    const sorted = [...animal.pesajes].sort((a, b) => 
      new Date(b.fechaHora).getTime() - new Date(a.fechaHora).getTime()
    );
    return sorted[0]?.peso;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Ganado</h1>
          <p className="text-muted-foreground">
            Gestiona tu inventario de animales
          </p>
        </div>
        <div className="flex gap-2">
          {/* Secondary actions: visible on sm+, collapsed to dropdown on mobile */}
          <div className="hidden sm:flex gap-2">
            <Button variant="outline" size="sm" onClick={loadAnimales}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualizar
            </Button>
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Importar
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport} disabled={exporting}>
              {exporting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
              Exportar
            </Button>
          </div>
          <div className="sm:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={loadAnimales}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Actualizar
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Upload className="mr-2 h-4 w-4" />
                  Importar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExport} disabled={exporting}>
                  <Download className="mr-2 h-4 w-4" />
                  Exportar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Button asChild size="sm">
            <Link href="/dashboard/animales/nuevo">
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Nuevo Animal</span>
              <span className="sm:hidden">Nuevo</span>
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por DIIO o RFID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Select value={estadoFilter} onValueChange={setEstadoFilter}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="ACTIVO">Activo</SelectItem>
                  <SelectItem value="VENDIDO">Vendido</SelectItem>
                  <SelectItem value="MUERTO">Muerto</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleSearch} size="sm">
                Buscar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : animales.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Scale className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay animales registrados</p>
              <Button variant="outline" className="mt-4" asChild>
                <Link href="/dashboard/animales/nuevo">
                  <Plus className="h-4 w-4 mr-2" />
                  Registrar primer animal
                </Link>
              </Button>
            </div>
          ) : (
            <>
              {/* Mobile card view */}
              <div className="md:hidden space-y-3">
                {animales.map((animal) => (
                    <Link
                      key={animal.id}
                      href={`/dashboard/animales/${animal.id}`}
                      className="block border rounded-lg p-3 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono font-medium text-sm">
                          {getIdentificador(animal, TipoIdentificador.DIIO_VISUAL)}
                        </span>
                        <Badge variant={getStatusBadgeVariant(animal.estado)} className="text-xs">
                          {animal.estado}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                        <div className="text-muted-foreground">Sexo</div>
                        <div className="text-right">{animal.sexo || '-'}</div>
                        <div className="text-muted-foreground">Establecimiento</div>
                        <div className="text-right truncate">{animal.establecimientoActual?.nombre || '-'}</div>
                        <div className="text-muted-foreground">Lote</div>
                        <div className="text-right truncate">{animal.lote?.nombre || 'Sin lote'}</div>
                        <div className="text-muted-foreground">Último Peso</div>
                        <div className="text-right font-medium">
                          {getUltimoPeso(animal) ? `${getUltimoPeso(animal)} kg` : '-'}
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>

              {/* Desktop table view */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>DIIO</TableHead>
                      <TableHead>RFID</TableHead>
                      <TableHead>Sexo</TableHead>
                      <TableHead>Establecimiento</TableHead>
                      <TableHead>Lote</TableHead>
                      <TableHead className="text-right">Último Peso</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {animales.map((animal) => (
                        <TableRow key={animal.id} className="hover:bg-muted/50">
                          <TableCell className="font-mono font-medium">
                            {getIdentificador(animal, TipoIdentificador.DIIO_VISUAL)}
                          </TableCell>
                          <TableCell className="font-mono text-muted-foreground">
                            {getIdentificador(animal, TipoIdentificador.RFID)}
                          </TableCell>
                          <TableCell>{animal.sexo || '-'}</TableCell>
                          <TableCell>{animal.establecimientoActual?.nombre || '-'}</TableCell>
                          <TableCell>
                            {animal.lote?.nombre || (
                              <span className="text-muted-foreground">Sin lote</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {getUltimoPeso(animal) ? `${getUltimoPeso(animal)} kg` : '-'}
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(animal.estado)}>
                              {animal.estado}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                  <span className="sr-only">Acciones</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <Link href={`/dashboard/animales/${animal.id}`}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Ver detalle
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link href={`/dashboard/animales/${animal.id}/editar`}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Editar
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Scale className="mr-2 h-4 w-4" />
                                  Registrar pesaje
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-destructive"
                                  onClick={() => {
                                    setAnimalToDelete(animal.id);
                                    setDeleteDialogOpen(true);
                                  }}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Dar de baja
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between mt-4 gap-2">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  <span className="hidden sm:inline">Mostrando {animales.length} de {total} animales</span>
                  <span className="sm:hidden">{animales.length}/{total}</span>
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <span className="hidden sm:inline">Anterior</span>
                    <span className="sm:hidden">&lt;</span>
                  </Button>
                  <span className="text-xs sm:text-sm whitespace-nowrap">
                    {currentPage}/{totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <span className="hidden sm:inline">Siguiente</span>
                    <span className="sm:hidden">&gt;</span>
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El animal será eliminado permanentemente del sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
