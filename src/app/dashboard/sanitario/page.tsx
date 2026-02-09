'use client';

import { useState, useEffect } from 'react';
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Plus,
  Loader2,
  RefreshCw,
  Syringe,
  Pill,
  Bug,
  Stethoscope,
  Calendar,
  Download,
  Trash2,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { sanitarioService, EventoSanitario, CreateEventoSanitarioDto } from '@/lib/api/sanitario';
import { toast } from 'sonner';

const TIPOS = [
  { value: 'VACUNACION', label: 'Vacunación', icon: Syringe },
  { value: 'TRATAMIENTO', label: 'Tratamiento', icon: Pill },
  { value: 'DESPARASITACION', label: 'Desparasitación', icon: Bug },
  { value: 'DIAGNOSTICO', label: 'Diagnóstico', icon: Stethoscope },
  { value: 'OTRO', label: 'Otro', icon: Calendar },
] as const;

const ESTADOS = [
  { value: 'PROGRAMADO', label: 'Programado', variant: 'outline' as const },
  { value: 'APLICADO', label: 'Aplicado', variant: 'default' as const },
  { value: 'VENCIDO', label: 'Vencido', variant: 'destructive' as const },
  { value: 'CANCELADO', label: 'Cancelado', variant: 'secondary' as const },
];

const VIAS = ['SUBCUTANEA', 'INTRAMUSCULAR', 'ORAL', 'TOPICA', 'INTRAVENOSA', 'POUR_ON'];

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

function getEstadoBadgeVariant(estado: string) {
  return ESTADOS.find((e) => e.value === estado)?.variant || 'outline';
}

function getTipoIcon(tipo: string) {
  const found = TIPOS.find((t) => t.value === tipo);
  return found?.icon || Calendar;
}

export default function SanitarioPage() {
  const [eventos, setEventos] = useState<EventoSanitario[]>([]);
  const [loading, setLoading] = useState(true);
  const [tipoFilter, setTipoFilter] = useState<string>('todos');
  const [estadoFilter, setEstadoFilter] = useState<string>('todos');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Create dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState<CreateEventoSanitarioDto>({
    tipo: 'VACUNACION',
    fecha: new Date().toISOString().split('T')[0],
    producto: '',
    estado: 'APLICADO',
  });

  // Delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventoToDelete, setEventoToDelete] = useState<string | null>(null);

  // Calendar data
  const [proximos, setProximos] = useState<EventoSanitario[]>([]);

  useEffect(() => {
    loadEventos();
  }, [currentPage, tipoFilter, estadoFilter]);

  useEffect(() => {
    loadProximos();
  }, []);

  const loadEventos = async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page: currentPage, limit: 15 };
      if (tipoFilter !== 'todos') params.tipo = tipoFilter;
      if (estadoFilter !== 'todos') params.estado = estadoFilter;

      const response = await sanitarioService.getAll(params);
      setEventos(response.data);
      setTotal(response.meta.total);
      setTotalPages(response.meta.totalPages);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Error al cargar eventos sanitarios');
      setEventos([]);
    } finally {
      setLoading(false);
    }
  };

  const loadProximos = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);
      const response = await sanitarioService.getAll({
        estado: 'PROGRAMADO',
        fechaDesde: today,
        fechaHasta: futureDate.toISOString().split('T')[0],
        limit: 10,
      });
      setProximos(response.data);
    } catch {
      // silently fail for calendar
    }
  };

  const handleCreate = async () => {
    if (!formData.producto.trim()) {
      toast.error('Ingresa el nombre del producto');
      return;
    }

    setCreating(true);
    try {
      await sanitarioService.create(formData);
      toast.success('Evento sanitario registrado');
      setDialogOpen(false);
      setFormData({
        tipo: 'VACUNACION',
        fecha: new Date().toISOString().split('T')[0],
        producto: '',
        estado: 'APLICADO',
      });
      loadEventos();
      loadProximos();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Error al crear evento');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async () => {
    if (!eventoToDelete) return;
    try {
      await sanitarioService.delete(eventoToDelete);
      toast.success('Evento eliminado');
      setDeleteDialogOpen(false);
      setEventoToDelete(null);
      loadEventos();
      loadProximos();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Error al eliminar');
    }
  };

  const handleExport = () => {
    if (eventos.length === 0) return;
    const headers = ['Fecha', 'Tipo', 'Producto', 'Dosis', 'Vía', 'Veterinario', 'Estado', 'Observaciones'];
    const rows = eventos.map((e) => [
      new Date(e.fecha).toLocaleDateString('es-CL'),
      e.tipo,
      e.producto,
      e.dosis || '-',
      e.viaAplicacion || '-',
      e.veterinario || '-',
      e.estado,
      e.observaciones || '-',
    ]);
    downloadCSV(`sanitario_${new Date().toISOString().split('T')[0]}.csv`, headers, rows);
    toast.success('Eventos exportados');
  };

  // Stats
  const totalAplicados = eventos.filter((e) => e.estado === 'APLICADO').length;
  const totalProgramados = eventos.filter((e) => e.estado === 'PROGRAMADO').length;
  const totalVencidos = eventos.filter((e) => e.estado === 'VENCIDO').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Manejo Sanitario</h1>
          <p className="text-muted-foreground">
            Vacunaciones, tratamientos y calendario sanitario
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={loadEventos}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport} disabled={eventos.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Evento
          </Button>
        </div>
      </div>

      <Tabs defaultValue="listado">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="listado">Listado</TabsTrigger>
          <TabsTrigger value="calendario" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Próximos
            {proximos.length > 0 && (
              <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-[10px]">
                {proximos.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* ===== LISTADO TAB ===== */}
        <TabsContent value="listado" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-4 pb-3 flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-green-600">{totalAplicados}</p>
                  <p className="text-xs text-muted-foreground">Aplicados</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 pb-3 flex items-center gap-3">
                <Clock className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-blue-600">{totalProgramados}</p>
                  <p className="text-xs text-muted-foreground">Programados</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 pb-3 flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-2xl font-bold text-red-600">{totalVencidos}</p>
                  <p className="text-xs text-muted-foreground">Vencidos</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex gap-2 flex-1">
                  <Select value={tipoFilter} onValueChange={(v) => { setTipoFilter(v); setCurrentPage(1); }}>
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos los tipos</SelectItem>
                      {TIPOS.map((t) => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={estadoFilter} onValueChange={(v) => { setEstadoFilter(v); setCurrentPage(1); }}>
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos los estados</SelectItem>
                      {ESTADOS.map((e) => (
                        <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-sm text-muted-foreground">
                  {total} evento(s)
                </p>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : eventos.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Syringe className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No hay eventos sanitarios registrados</p>
                  <Button variant="outline" className="mt-4" onClick={() => setDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Registrar primer evento
                  </Button>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Fecha</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead>Producto</TableHead>
                          <TableHead>Dosis</TableHead>
                          <TableHead>Vía</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {eventos.map((evento) => {
                          const TipoIcon = getTipoIcon(evento.tipo);
                          return (
                            <TableRow key={evento.id}>
                              <TableCell className="text-muted-foreground">
                                {new Date(evento.fecha).toLocaleDateString('es-CL')}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <TipoIcon className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">{TIPOS.find((t) => t.value === evento.tipo)?.label || evento.tipo}</span>
                                </div>
                              </TableCell>
                              <TableCell className="font-medium">{evento.producto}</TableCell>
                              <TableCell>{evento.dosis || '-'}</TableCell>
                              <TableCell>{evento.viaAplicacion || '-'}</TableCell>
                              <TableCell>
                                <Badge variant={getEstadoBadgeVariant(evento.estado)}>
                                  {evento.estado}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-1">
                                  <Button variant="ghost" size="icon" asChild>
                                    <Link href={`/dashboard/sanitario/${evento.id}`}>
                                      <Eye className="h-4 w-4" />
                                    </Link>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                      setEventoToDelete(evento.id);
                                      setDeleteDialogOpen(true);
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-muted-foreground">
                      Página {currentPage} de {totalPages}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                      >
                        Anterior
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Siguiente
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== CALENDARIO TAB ===== */}
        <TabsContent value="calendario" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Próximos 30 días
              </CardTitle>
              <CardDescription>
                Eventos sanitarios programados
              </CardDescription>
            </CardHeader>
            <CardContent>
              {proximos.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No hay eventos programados en los próximos 30 días</p>
                  <Button variant="outline" className="mt-4" onClick={() => {
                    setFormData((prev) => ({ ...prev, estado: 'PROGRAMADO' }));
                    setDialogOpen(true);
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Programar evento
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {proximos.map((evento) => {
                    const TipoIcon = getTipoIcon(evento.tipo);
                    const diasRestantes = Math.ceil(
                      (new Date(evento.fecha).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                    );
                    return (
                      <div
                        key={evento.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                            diasRestantes <= 3 ? 'bg-red-100 text-red-600' :
                            diasRestantes <= 7 ? 'bg-yellow-100 text-yellow-600' :
                            'bg-blue-100 text-blue-600'
                          }`}>
                            <TipoIcon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium">{evento.producto}</p>
                            <p className="text-sm text-muted-foreground">
                              {TIPOS.find((t) => t.value === evento.tipo)?.label} — {evento.veterinario || 'Sin veterinario'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {new Date(evento.fecha).toLocaleDateString('es-CL')}
                          </p>
                          <p className={`text-xs ${
                            diasRestantes <= 3 ? 'text-red-600 font-medium' :
                            diasRestantes <= 7 ? 'text-yellow-600' :
                            'text-muted-foreground'
                          }`}>
                            {diasRestantes === 0 ? 'Hoy' :
                             diasRestantes === 1 ? 'Mañana' :
                             `En ${diasRestantes} días`}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ===== CREATE DIALOG ===== */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nuevo Evento Sanitario</DialogTitle>
            <DialogDescription>
              Registra una vacunación, tratamiento u otro evento
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select
                  value={formData.tipo}
                  onValueChange={(v) => setFormData({ ...formData, tipo: v as EventoSanitario['tipo'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIPOS.map((t) => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Estado</Label>
                <Select
                  value={formData.estado || 'APLICADO'}
                  onValueChange={(v) => setFormData({ ...formData, estado: v as EventoSanitario['estado'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ESTADOS.map((e) => (
                      <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Producto / Vacuna *</Label>
              <Input
                placeholder="Ej: Ivomec, Clostridial, Aftosa..."
                value={formData.producto}
                onChange={(e) => setFormData({ ...formData, producto: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Fecha</Label>
                <Input
                  type="date"
                  value={formData.fecha}
                  onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Fecha próxima dosis</Label>
                <Input
                  type="date"
                  value={formData.fechaProxima || ''}
                  onChange={(e) => setFormData({ ...formData, fechaProxima: e.target.value || undefined })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Dosis</Label>
                <Input
                  placeholder="Ej: 5 ml"
                  value={formData.dosis || ''}
                  onChange={(e) => setFormData({ ...formData, dosis: e.target.value || undefined })}
                />
              </div>
              <div className="space-y-2">
                <Label>Vía de aplicación</Label>
                <Select
                  value={formData.viaAplicacion || ''}
                  onValueChange={(v) => setFormData({ ...formData, viaAplicacion: v || undefined })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    {VIAS.map((v) => (
                      <SelectItem key={v} value={v}>{v.replace('_', ' ')}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Veterinario</Label>
                <Input
                  placeholder="Nombre del veterinario"
                  value={formData.veterinario || ''}
                  onChange={(e) => setFormData({ ...formData, veterinario: e.target.value || undefined })}
                />
              </div>
              <div className="space-y-2">
                <Label>Período resguardo (días)</Label>
                <Input
                  type="number"
                  min={0}
                  placeholder="0"
                  value={formData.periodoResguardo || ''}
                  onChange={(e) => setFormData({ ...formData, periodoResguardo: e.target.value ? parseInt(e.target.value) : undefined })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Lote (nombre/número)</Label>
              <Input
                placeholder="Ej: Lote vacunas Dic 2025"
                value={formData.lote || ''}
                onChange={(e) => setFormData({ ...formData, lote: e.target.value || undefined })}
              />
            </div>

            <div className="space-y-2">
              <Label>Observaciones</Label>
              <Input
                placeholder="Notas adicionales..."
                value={formData.observaciones || ''}
                onChange={(e) => setFormData({ ...formData, observaciones: e.target.value || undefined })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={creating}>
              Cancelar
            </Button>
            <Button onClick={handleCreate} disabled={creating}>
              {creating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                'Registrar Evento'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== DELETE DIALOG ===== */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar evento sanitario?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El registro será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
