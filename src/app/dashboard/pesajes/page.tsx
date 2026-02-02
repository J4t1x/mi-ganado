'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Plus,
  Search,
  Scale,
  Upload,
  Calendar,
  User,
  Package,
  FileText,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { pesajesService, SesionPesaje } from '@/lib/api/pesajes';
import { lotesService, LoteWithStats } from '@/lib/api/lotes';
import { toast } from 'sonner';

export default function PesajesPage() {
  const searchParams = useSearchParams();
  const loteIdFromUrl = searchParams.get('loteId');
  
  const [sesiones, setSesiones] = useState<SesionPesaje[]>([]);
  const [lotes, setLotes] = useState<LoteWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    loteId: loteIdFromUrl || '',
    equipo: 'XR5000',
    operador: '',
    observaciones: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (loteIdFromUrl && lotes.length > 0) {
      setFormData(prev => ({ ...prev, loteId: loteIdFromUrl }));
      setDialogOpen(true);
    }
  }, [loteIdFromUrl, lotes]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [sesionesRes, lotesRes] = await Promise.all([
        pesajesService.getSesiones(),
        lotesService.getAll({ limit: 100 }), // LotesQueryParams accepts number
      ]);
      setSesiones(sesionesRes.data);
      setLotes(lotesRes.data);
    } catch (error: any) {
      toast.error(error.message || 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.fecha) {
      toast.error('La fecha es requerida');
      return;
    }

    try {
      await pesajesService.createSesion({
        fecha: formData.fecha,
        loteId: formData.loteId || undefined,
        equipo: formData.equipo || undefined,
        operador: formData.operador || undefined,
        observaciones: formData.observaciones || undefined,
      });
      toast.success('Sesión de pesaje creada exitosamente');
      setDialogOpen(false);
      setFormData({
        fecha: new Date().toISOString().split('T')[0],
        loteId: '',
        equipo: 'XR5000',
        operador: '',
        observaciones: '',
      });
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'Error al crear sesión');
    }
  };

  const filteredSesiones = sesiones.filter((sesion) =>
    sesion.lote?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sesion.operador?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate stats
  const totalPesajes = sesiones.reduce((acc, s) => acc + (s.totalPesajes || 0), 0);
  const promedioGeneral = sesiones.length > 0
    ? sesiones.reduce((acc, s) => acc + (s.pesoPromedio || 0), 0) / sesiones.length
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Pesajes</h1>
          <p className="text-muted-foreground">
            Registra y gestiona sesiones de pesaje
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={loadData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>

          <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Importar XR5000
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Importar desde XR5000</DialogTitle>
                <DialogDescription>
                  Sube el archivo CSV exportado desde tu equipo XR5000
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Arrastra tu archivo aquí o haz clic para seleccionar
                  </p>
                  <Button variant="outline" size="sm">
                    Seleccionar archivo
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    Formatos soportados: CSV, TXT
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lote-import">Asociar a lote</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un lote" />
                    </SelectTrigger>
                    <SelectContent>
                      {lotes.map((lote) => (
                        <SelectItem key={lote.id} value={lote.id}>
                          {lote.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setImportDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => setImportDialogOpen(false)}>
                  Importar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nueva Sesión
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nueva Sesión de Pesaje</DialogTitle>
                <DialogDescription>
                  Crea una nueva sesión para registrar pesajes
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="fecha">Fecha</Label>
                  <Input
                    id="fecha"
                    type="date"
                    value={formData.fecha}
                    onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lote">Lote</Label>
                  <Select value={formData.loteId} onValueChange={(val) => setFormData({ ...formData, loteId: val })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un lote" />
                    </SelectTrigger>
                    <SelectContent>
                      {lotes.map((lote) => (
                        <SelectItem key={lote.id} value={lote.id}>
                          {lote.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="equipo">Equipo</Label>
                  <Select value={formData.equipo} onValueChange={(val) => setFormData({ ...formData, equipo: val })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona equipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="XR5000">XR5000</SelectItem>
                      <SelectItem value="Manual">Manual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="operador">Operador</Label>
                  <Input
                    id="operador"
                    placeholder="Nombre del operador"
                    value={formData.operador}
                    onChange={(e) => setFormData({ ...formData, operador: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="observaciones">Observaciones</Label>
                  <Textarea
                    id="observaciones"
                    placeholder="Notas adicionales..."
                    value={formData.observaciones}
                    onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreate}>
                  Crear Sesión
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pesajes registrados
            </CardTitle>
            <Scale className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPesajes}</div>
            <p className="text-xs text-muted-foreground">Total de pesajes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Peso promedio
            </CardTitle>
            <Scale className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{promedioGeneral > 0 ? `${Math.round(promedioGeneral)} kg` : '-'}</div>
            <p className="text-xs text-muted-foreground">Promedio general</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Sesiones activas
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sesiones.length}</div>
            <p className="text-xs text-muted-foreground">Sesiones de pesaje</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <CardTitle>Sesiones de Pesaje</CardTitle>
            <div className="relative flex-1 max-w-sm ml-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar sesiones..."
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
                    <TableHead>Fecha</TableHead>
                    <TableHead>Lote</TableHead>
                    <TableHead>Equipo</TableHead>
                    <TableHead>Operador</TableHead>
                    <TableHead className="text-center">Pesajes</TableHead>
                    <TableHead className="text-right">Peso Prom.</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSesiones.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No se encontraron sesiones de pesaje
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSesiones.map((sesion) => (
                      <TableRow key={sesion.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {new Date(sesion.fecha).toLocaleDateString('es-CL')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            {sesion.lote?.nombre || '-'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{sesion.equipo || '-'}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            {sesion.operador || '-'}
                          </div>
                        </TableCell>
                        <TableCell className="text-center font-medium">
                          {sesion.totalPesajes || 0}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {sesion.pesoPromedio ? `${Math.round(sesion.pesoPromedio)} kg` : '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/dashboard/pesajes/${sesion.id}`}>
                              Ver detalle
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
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
