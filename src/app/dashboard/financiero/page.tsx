'use client';

import { useState, useEffect } from 'react';
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Plus,
  Loader2,
  RefreshCw,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Receipt,
  ShoppingCart,
  Trash2,
  Download,
  CheckCircle,
  Clock,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  costosService,
  ventasService,
  Costo,
  Venta,
  CreateCostoDto,
  CreateVentaDto,
  TipoCosto,
  FormaPago,
} from '@/lib/api/financiero';
import { toast } from 'sonner';

const TIPOS_COSTO: { value: TipoCosto; label: string }[] = [
  { value: 'ALIMENTACION', label: 'Alimentación' },
  { value: 'SANITARIO', label: 'Sanitario' },
  { value: 'MANO_OBRA', label: 'Mano de obra' },
  { value: 'TRANSPORTE', label: 'Transporte' },
  { value: 'INFRAESTRUCTURA', label: 'Infraestructura' },
  { value: 'OTRO', label: 'Otro' },
];

const FORMAS_PAGO: { value: FormaPago; label: string }[] = [
  { value: 'EFECTIVO', label: 'Efectivo' },
  { value: 'TRANSFERENCIA', label: 'Transferencia' },
  { value: 'CHEQUE', label: 'Cheque' },
  { value: 'CREDITO', label: 'Crédito' },
  { value: 'OTRO', label: 'Otro' },
];

const PIE_COLORS = ['#2D8659', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#6B7280'];

function formatCLP(amount: number): string {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(amount);
}

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

export default function FinancieroPage() {
  // Costos state
  const [costos, setCostos] = useState<Costo[]>([]);
  const [loadingCostos, setLoadingCostos] = useState(true);
  const [costoPage, setCostoPage] = useState(1);
  const [costoTotalPages, setCostoTotalPages] = useState(1);
  const [costoTotal, setCostoTotal] = useState(0);
  const [tipoFilter, setTipoFilter] = useState<string>('todos');

  // Ventas state
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loadingVentas, setLoadingVentas] = useState(true);
  const [ventaPage, setVentaPage] = useState(1);
  const [ventaTotalPages, setVentaTotalPages] = useState(1);
  const [ventaTotal, setVentaTotal] = useState(0);

  // Dialogs
  const [costoDialogOpen, setCostoDialogOpen] = useState(false);
  const [ventaDialogOpen, setVentaDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; type: 'costo' | 'venta' } | null>(null);
  const [creating, setCreating] = useState(false);

  // Forms
  const [costoForm, setCostoForm] = useState<CreateCostoDto>({
    tipo: 'ALIMENTACION',
    concepto: '',
    monto: 0,
    fecha: new Date().toISOString().split('T')[0],
  });

  const [ventaForm, setVentaForm] = useState<CreateVentaDto>({
    fecha: new Date().toISOString().split('T')[0],
    comprador: '',
    cantidadAnimales: 1,
    precioUnitario: 0,
    precioTotal: 0,
    formaPago: 'TRANSFERENCIA',
  });

  useEffect(() => { loadCostos(); }, [costoPage, tipoFilter]);
  useEffect(() => { loadVentas(); }, [ventaPage]);

  const loadCostos = async () => {
    setLoadingCostos(true);
    try {
      const params: Record<string, string | number> = { page: costoPage, limit: 10 };
      if (tipoFilter !== 'todos') params.tipo = tipoFilter;
      const res = await costosService.getAll(params);
      setCostos(res.data);
      setCostoTotal(res.meta.total);
      setCostoTotalPages(res.meta.totalPages);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Error al cargar costos');
      setCostos([]);
    } finally {
      setLoadingCostos(false);
    }
  };

  const loadVentas = async () => {
    setLoadingVentas(true);
    try {
      const res = await ventasService.getAll({ page: ventaPage, limit: 10 });
      setVentas(res.data);
      setVentaTotal(res.meta.total);
      setVentaTotalPages(res.meta.totalPages);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Error al cargar ventas');
      setVentas([]);
    } finally {
      setLoadingVentas(false);
    }
  };

  const handleCreateCosto = async () => {
    if (!costoForm.concepto.trim() || costoForm.monto <= 0) {
      toast.error('Completa concepto y monto');
      return;
    }
    setCreating(true);
    try {
      await costosService.create(costoForm);
      toast.success('Costo registrado');
      setCostoDialogOpen(false);
      setCostoForm({ tipo: 'ALIMENTACION', concepto: '', monto: 0, fecha: new Date().toISOString().split('T')[0] });
      loadCostos();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Error al crear costo');
    } finally {
      setCreating(false);
    }
  };

  const handleCreateVenta = async () => {
    if (!ventaForm.comprador.trim() || ventaForm.precioTotal <= 0) {
      toast.error('Completa comprador y precio');
      return;
    }
    setCreating(true);
    try {
      await ventasService.create(ventaForm);
      toast.success('Venta registrada');
      setVentaDialogOpen(false);
      setVentaForm({ fecha: new Date().toISOString().split('T')[0], comprador: '', cantidadAnimales: 1, precioUnitario: 0, precioTotal: 0, formaPago: 'TRANSFERENCIA' });
      loadVentas();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Error al crear venta');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.type === 'costo') {
        await costosService.delete(deleteTarget.id);
        loadCostos();
      } else {
        await ventasService.delete(deleteTarget.id);
        loadVentas();
      }
      toast.success('Registro eliminado');
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Error al eliminar');
    } finally {
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
    }
  };

  // Summary calculations
  const sumCostos = costos.reduce((a, c) => a + Number(c.monto), 0);
  const sumVentas = ventas.reduce((a, v) => a + Number(v.precioTotal), 0);
  const ventasPagadas = ventas.filter((v) => v.pagado).length;
  const ventasPendientes = ventas.filter((v) => !v.pagado).length;

  // Chart data
  const costosPorTipo = TIPOS_COSTO.map((t) => ({
    name: t.label,
    value: costos.filter((c) => c.tipo === t.value).reduce((a, c) => a + Number(c.monto), 0),
  })).filter((d) => d.value > 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Módulo Financiero</h1>
          <p className="text-muted-foreground">Costos, ventas y rentabilidad</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => { loadCostos(); loadVentas(); }}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 pb-3 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
              <TrendingDown className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Costos</p>
              <p className="text-xl font-bold text-red-600">{formatCLP(sumCostos)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Ventas</p>
              <p className="text-xl font-bold text-green-600">{formatCLP(sumVentas)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Rentabilidad</p>
              <p className={`text-xl font-bold ${sumVentas - sumCostos >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCLP(sumVentas - sumCostos)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-yellow-100 flex items-center justify-center">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Ventas Pendientes</p>
              <p className="text-xl font-bold">{ventasPendientes}</p>
              <p className="text-xs text-muted-foreground">{ventasPagadas} pagadas</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      {costosPorTipo.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Distribución de Costos</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={costosPorTipo}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                >
                  {costosPorTipo.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCLP(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="costos">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="costos" className="flex items-center gap-2">
            <Receipt className="h-4 w-4" />
            Costos ({costoTotal})
          </TabsTrigger>
          <TabsTrigger value="ventas" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Ventas ({ventaTotal})
          </TabsTrigger>
        </TabsList>

        {/* ===== COSTOS TAB ===== */}
        <TabsContent value="costos" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Select value={tipoFilter} onValueChange={(v) => { setTipoFilter(v); setCostoPage(1); }}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los tipos</SelectItem>
                  {TIPOS_COSTO.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                disabled={costos.length === 0}
                onClick={() => {
                  const headers = ['Fecha', 'Tipo', 'Concepto', 'Monto', 'Proveedor', 'Observaciones'];
                  const rows = costos.map((c) => [
                    new Date(c.fecha).toLocaleDateString('es-CL'),
                    c.tipo, c.concepto, c.monto.toString(), c.proveedor || '-', c.observaciones || '-',
                  ]);
                  downloadCSV(`costos_${new Date().toISOString().split('T')[0]}.csv`, headers, rows);
                }}
              >
                <Download className="h-4 w-4 mr-1" />
                CSV
              </Button>
            </div>
            <Button onClick={() => setCostoDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Costo
            </Button>
          </div>

          <Card>
            <CardContent className="pt-4">
              {loadingCostos ? (
                <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
              ) : costos.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No hay costos registrados</p>
                </div>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Concepto</TableHead>
                        <TableHead className="text-right">Monto</TableHead>
                        <TableHead>Proveedor</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {costos.map((costo) => (
                        <TableRow key={costo.id}>
                          <TableCell className="text-muted-foreground">
                            {new Date(costo.fecha).toLocaleDateString('es-CL')}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{TIPOS_COSTO.find((t) => t.value === costo.tipo)?.label || costo.tipo}</Badge>
                          </TableCell>
                          <TableCell className="font-medium">{costo.concepto}</TableCell>
                          <TableCell className="text-right font-medium text-red-600">{formatCLP(Number(costo.monto))}</TableCell>
                          <TableCell>{costo.proveedor || '-'}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => { setDeleteTarget({ id: costo.id, type: 'costo' }); setDeleteDialogOpen(true); }}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-muted-foreground">Página {costoPage} de {costoTotalPages}</p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setCostoPage((p) => Math.max(1, p - 1))} disabled={costoPage === 1}>Anterior</Button>
                      <Button variant="outline" size="sm" onClick={() => setCostoPage((p) => Math.min(costoTotalPages, p + 1))} disabled={costoPage === costoTotalPages}>Siguiente</Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== VENTAS TAB ===== */}
        <TabsContent value="ventas" className="space-y-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              disabled={ventas.length === 0}
              onClick={() => {
                const headers = ['Fecha', 'Comprador', 'Cantidad', 'Precio Unit.', 'Total', 'Forma Pago', 'Pagado'];
                const rows = ventas.map((v) => [
                  new Date(v.fecha).toLocaleDateString('es-CL'),
                  v.comprador, v.cantidadAnimales.toString(), v.precioUnitario.toString(),
                  v.precioTotal.toString(), v.formaPago, v.pagado ? 'Sí' : 'No',
                ]);
                downloadCSV(`ventas_${new Date().toISOString().split('T')[0]}.csv`, headers, rows);
              }}
            >
              <Download className="h-4 w-4 mr-1" />
              CSV
            </Button>
            <Button onClick={() => setVentaDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Venta
            </Button>
          </div>

          <Card>
            <CardContent className="pt-4">
              {loadingVentas ? (
                <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
              ) : ventas.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No hay ventas registradas</p>
                </div>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Comprador</TableHead>
                        <TableHead className="text-center">Animales</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead>Pago</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ventas.map((venta) => (
                        <TableRow key={venta.id}>
                          <TableCell className="text-muted-foreground">
                            {new Date(venta.fecha).toLocaleDateString('es-CL')}
                          </TableCell>
                          <TableCell className="font-medium">{venta.comprador}</TableCell>
                          <TableCell className="text-center">{venta.cantidadAnimales}</TableCell>
                          <TableCell className="text-right font-medium text-green-600">{formatCLP(Number(venta.precioTotal))}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{FORMAS_PAGO.find((f) => f.value === venta.formaPago)?.label || venta.formaPago}</Badge>
                          </TableCell>
                          <TableCell>
                            {venta.pagado ? (
                              <Badge variant="default" className="bg-green-600"><CheckCircle className="h-3 w-3 mr-1" />Pagada</Badge>
                            ) : (
                              <Badge variant="outline" className="text-yellow-600 border-yellow-600"><Clock className="h-3 w-3 mr-1" />Pendiente</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => { setDeleteTarget({ id: venta.id, type: 'venta' }); setDeleteDialogOpen(true); }}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-muted-foreground">Página {ventaPage} de {ventaTotalPages}</p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setVentaPage((p) => Math.max(1, p - 1))} disabled={ventaPage === 1}>Anterior</Button>
                      <Button variant="outline" size="sm" onClick={() => setVentaPage((p) => Math.min(ventaTotalPages, p + 1))} disabled={ventaPage === ventaTotalPages}>Siguiente</Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ===== COSTO DIALOG ===== */}
      <Dialog open={costoDialogOpen} onOpenChange={setCostoDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Registrar Costo</DialogTitle>
            <DialogDescription>Ingresa los datos del gasto</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo *</Label>
                <Select value={costoForm.tipo} onValueChange={(v) => setCostoForm({ ...costoForm, tipo: v as TipoCosto })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {TIPOS_COSTO.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Fecha *</Label>
                <Input type="date" value={costoForm.fecha} onChange={(e) => setCostoForm({ ...costoForm, fecha: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Concepto *</Label>
              <Input placeholder="Ej: Fardo de alfalfa x50" value={costoForm.concepto} onChange={(e) => setCostoForm({ ...costoForm, concepto: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Monto (CLP) *</Label>
                <Input type="number" min={0} placeholder="0" value={costoForm.monto || ''} onChange={(e) => setCostoForm({ ...costoForm, monto: parseInt(e.target.value) || 0 })} />
              </div>
              <div className="space-y-2">
                <Label>Proveedor</Label>
                <Input placeholder="Nombre proveedor" value={costoForm.proveedor || ''} onChange={(e) => setCostoForm({ ...costoForm, proveedor: e.target.value || undefined })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Documento / Factura</Label>
              <Input placeholder="Nº factura o boleta" value={costoForm.documento || ''} onChange={(e) => setCostoForm({ ...costoForm, documento: e.target.value || undefined })} />
            </div>
            <div className="space-y-2">
              <Label>Observaciones</Label>
              <Input placeholder="Notas adicionales" value={costoForm.observaciones || ''} onChange={(e) => setCostoForm({ ...costoForm, observaciones: e.target.value || undefined })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCostoDialogOpen(false)} disabled={creating}>Cancelar</Button>
            <Button onClick={handleCreateCosto} disabled={creating}>
              {creating ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Guardando...</> : 'Registrar Costo'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== VENTA DIALOG ===== */}
      <Dialog open={ventaDialogOpen} onOpenChange={setVentaDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Registrar Venta</DialogTitle>
            <DialogDescription>Ingresa los datos de la venta</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Fecha *</Label>
                <Input type="date" value={ventaForm.fecha} onChange={(e) => setVentaForm({ ...ventaForm, fecha: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Forma de pago</Label>
                <Select value={ventaForm.formaPago} onValueChange={(v) => setVentaForm({ ...ventaForm, formaPago: v as FormaPago })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {FORMAS_PAGO.map((f) => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Comprador *</Label>
                <Input placeholder="Nombre comprador" value={ventaForm.comprador} onChange={(e) => setVentaForm({ ...ventaForm, comprador: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>RUT Comprador</Label>
                <Input placeholder="12.345.678-9" value={ventaForm.rutComprador || ''} onChange={(e) => setVentaForm({ ...ventaForm, rutComprador: e.target.value || undefined })} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Animales</Label>
                <Input
                  type="number" min={1} value={ventaForm.cantidadAnimales}
                  onChange={(e) => {
                    const cant = parseInt(e.target.value) || 1;
                    setVentaForm({ ...ventaForm, cantidadAnimales: cant, precioTotal: cant * ventaForm.precioUnitario });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Precio Unit.</Label>
                <Input
                  type="number" min={0} value={ventaForm.precioUnitario || ''}
                  onChange={(e) => {
                    const pu = parseInt(e.target.value) || 0;
                    setVentaForm({ ...ventaForm, precioUnitario: pu, precioTotal: ventaForm.cantidadAnimales * pu });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Total</Label>
                <Input type="number" min={0} value={ventaForm.precioTotal || ''} onChange={(e) => setVentaForm({ ...ventaForm, precioTotal: parseInt(e.target.value) || 0 })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Factura</Label>
              <Input placeholder="Nº factura" value={ventaForm.factura || ''} onChange={(e) => setVentaForm({ ...ventaForm, factura: e.target.value || undefined })} />
            </div>
            <div className="space-y-2">
              <Label>Observaciones</Label>
              <Input placeholder="Notas adicionales" value={ventaForm.observaciones || ''} onChange={(e) => setVentaForm({ ...ventaForm, observaciones: e.target.value || undefined })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setVentaDialogOpen(false)} disabled={creating}>Cancelar</Button>
            <Button onClick={handleCreateVenta} disabled={creating}>
              {creating ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Guardando...</> : 'Registrar Venta'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== DELETE DIALOG ===== */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar registro?</AlertDialogTitle>
            <AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
