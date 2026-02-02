'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
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
  ArrowRightLeft,
  Truck,
  DollarSign,
  ShoppingCart,
  AlertTriangle,
  MoreVertical,
  Eye,
  CheckCircle,
  FileText,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { movimientosService, Movimiento, TipoMovimiento, MovimientosEstadisticas } from '@/lib/api/movimientos';
import { establecimientosService } from '@/lib/api/establecimientos';
import { toast } from 'sonner';

interface Establecimiento {
  id: string;
  nombre: string;
}

function getMovementIcon(tipo: string) {
  switch (tipo) {
    case 'TRASLADO':
      return Truck;
    case 'VENTA':
      return DollarSign;
    case 'COMPRA':
      return ShoppingCart;
    case 'MUERTE':
      return AlertTriangle;
    default:
      return ArrowRightLeft;
  }
}

function getMovementBadgeVariant(tipo: string) {
  switch (tipo) {
    case 'TRASLADO':
      return 'secondary';
    case 'VENTA':
      return 'default';
    case 'COMPRA':
      return 'outline';
    case 'MUERTE':
      return 'destructive';
    default:
      return 'secondary';
  }
}

function getStatusBadgeVariant(estado: string) {
  switch (estado) {
    case 'CONFIRMADO':
      return 'default';
    case 'BORRADOR':
      return 'outline';
    case 'INFORMADO':
      return 'secondary';
    default:
      return 'outline';
  }
}

export default function MovimientosPage() {
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [establecimientos, setEstablecimientos] = useState<Establecimiento[]>([]);
  const [estadisticas, setEstadisticas] = useState<MovimientosEstadisticas | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFilter, setTipoFilter] = useState<string>('todos');
  const [dialogOpen, setDialogOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    tipo: '' as TipoMovimiento | '',
    fecha: new Date().toISOString().split('T')[0],
    establecimientoOrigenId: '',
    establecimientoDestinoId: '',
  });

  useEffect(() => {
    loadData();
  }, [tipoFilter]);

  const loadData = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (tipoFilter !== 'todos') {
        params.tipo = tipoFilter;
      }

      const [movRes, estRes, statsRes] = await Promise.all([
        movimientosService.getAll(params),
        establecimientosService.getAll({ limit: '100' }),
        movimientosService.getEstadisticas(),
      ]);

      setMovimientos(movRes.data);
      setEstablecimientos(estRes.data);
      setEstadisticas(statsRes);
    } catch (error: any) {
      toast.error(error.message || 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmar = async (id: string) => {
    try {
      await movimientosService.confirmar(id);
      toast.success('Movimiento confirmado exitosamente');
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'Error al confirmar movimiento');
    }
  };

  const filteredMovimientos = movimientos.filter((mov) => {
    const matchesSearch =
      mov.establecimientoOrigen?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mov.establecimientoDestino?.nombre?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Movimientos</h1>
          <p className="text-muted-foreground">
            Registra traslados, ventas, compras y bajas
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={loadData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Movimiento
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Nuevo Movimiento</DialogTitle>
                <DialogDescription>
                  Registra un nuevo movimiento de ganado
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo de movimiento</Label>
                  <Select value={formData.tipo} onValueChange={(val) => setFormData({ ...formData, tipo: val as TipoMovimiento })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TRASLADO">Traslado</SelectItem>
                      <SelectItem value="VENTA">Venta</SelectItem>
                      <SelectItem value="COMPRA">Compra</SelectItem>
                      <SelectItem value="MUERTE">Muerte</SelectItem>
                      <SelectItem value="AJUSTE">Ajuste</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fecha">Fecha</Label>
                  <Input
                    id="fecha"
                    type="date"
                    value={formData.fecha}
                    onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="origen">Origen</Label>
                    <Select
                      value={formData.establecimientoOrigenId}
                      onValueChange={(val) => setFormData({ ...formData, establecimientoOrigenId: val })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Establecimiento" />
                      </SelectTrigger>
                      <SelectContent>
                        {establecimientos.map((est) => (
                          <SelectItem key={est.id} value={est.id}>
                            {est.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="destino">Destino</Label>
                    <Select
                      value={formData.establecimientoDestinoId}
                      onValueChange={(val) => setFormData({ ...formData, establecimientoDestinoId: val })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Establecimiento" />
                      </SelectTrigger>
                      <SelectContent>
                        {establecimientos.map((est) => (
                          <SelectItem key={est.id} value={est.id}>
                            {est.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">
                    Animales seleccionados: <span className="font-medium text-foreground">0</span>
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Seleccionar animales
                  </Button>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => setDialogOpen(false)}>
                  Crear Borrador
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { tipo: 'TRASLADO', label: 'Traslados', count: estadisticas?.traslados || 0, icon: Truck },
          { tipo: 'VENTA', label: 'Ventas', count: estadisticas?.ventas || 0, icon: DollarSign },
          { tipo: 'COMPRA', label: 'Compras', count: estadisticas?.compras || 0, icon: ShoppingCart },
          { tipo: 'MUERTE', label: 'Muertes', count: estadisticas?.muertes || 0, icon: AlertTriangle },
        ].map((item) => (
          <Card
            key={item.tipo}
            className={`cursor-pointer transition-colors ${tipoFilter === item.tipo ? 'border-primary' : ''
              }`}
            onClick={() => setTipoFilter(tipoFilter === item.tipo ? 'todos' : item.tipo)}
          >
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                  <item.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{item.count}</p>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <CardTitle>Historial de Movimientos</CardTitle>
            <div className="relative flex-1 max-w-sm ml-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por origen o destino..."
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
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead className="text-center">Animales</TableHead>
                    <TableHead>Origen</TableHead>
                    <TableHead>Destino</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMovimientos.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No se encontraron movimientos
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredMovimientos.map((mov) => {
                      const Icon = getMovementIcon(mov.tipo);
                      return (
                        <TableRow key={mov.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4 text-muted-foreground" />
                              <Badge variant={getMovementBadgeVariant(mov.tipo) as any}>
                                {mov.tipo}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(mov.fecha).toLocaleDateString('es-CL')}
                          </TableCell>
                          <TableCell className="text-center font-medium">
                            {mov.cantidadAnimales || 0}
                          </TableCell>
                          <TableCell>{mov.establecimientoOrigen?.nombre || '-'}</TableCell>
                          <TableCell>{mov.establecimientoDestino?.nombre || '-'}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(mov.estado) as any}>
                              {mov.estado}
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
                                <DropdownMenuItem asChild>
                                  <Link href={`/dashboard/movimientos/${mov.id}`}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Ver detalle
                                  </Link>
                                </DropdownMenuItem>
                                {mov.estado === 'BORRADOR' && (
                                  <DropdownMenuItem onClick={() => handleConfirmar(mov.id)}>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Confirmar
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem>
                                  <FileText className="mr-2 h-4 w-4" />
                                  Adjuntar documento
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
