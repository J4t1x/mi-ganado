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
  CheckCircle,
  XCircle,
  File,
} from 'lucide-react';
import { useRef } from 'react';
import { pesajesService, SesionPesaje } from '@/lib/api/pesajes';
import { lotesService, LoteWithStats } from '@/lib/api/lotes';
import { toast } from 'sonner';

interface ParsedRow {
  codigo: string;
  peso: number;
  fechaHora?: string;
}

function parseXR5000File(content: string): ParsedRow[] {
  const lines = content.split(/\r?\n/).filter((l) => l.trim());
  const results: ParsedRow[] = [];

  for (const line of lines) {
    // Skip header lines
    if (line.toLowerCase().includes('codigo') || line.toLowerCase().includes('peso') || line.startsWith('#')) {
      continue;
    }

    // Try different delimiters: semicolon, comma, tab
    let parts: string[] = [];
    if (line.includes(';')) {
      parts = line.split(';').map((p) => p.trim());
    } else if (line.includes(',')) {
      parts = line.split(',').map((p) => p.trim());
    } else if (line.includes('\t')) {
      parts = line.split('\t').map((p) => p.trim());
    } else {
      // Try space-separated
      parts = line.split(/\s+/).map((p) => p.trim());
    }

    if (parts.length >= 2) {
      const codigo = parts[0];
      const peso = parseFloat(parts[1].replace(',', '.'));
      const fechaHora = parts[2] || undefined;

      if (codigo && !isNaN(peso) && peso > 0) {
        results.push({ codigo, peso, fechaHora });
      }
    }
  }

  return results;
}

export default function PesajesPage() {
  const searchParams = useSearchParams();
  const loteIdFromUrl = searchParams.get('loteId');
  
  const [sesiones, setSesiones] = useState<SesionPesaje[]>([]);
  const [lotes, setLotes] = useState<LoteWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  // XR5000 import state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedRow[]>([]);
  const [importLoteId, setImportLoteId] = useState('');
  const [importOperador, setImportOperador] = useState('');
  const [importing, setImporting] = useState(false);

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
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportFile(file);
    try {
      const content = await file.text();
      const parsed = parseXR5000File(content);
      setParsedData(parsed);
      if (parsed.length === 0) {
        toast.error('No se encontraron datos válidos en el archivo. Formato esperado: CODIGO;PESO o CODIGO,PESO');
      } else {
        toast.success(`${parsed.length} registro(s) encontrado(s)`);
      }
    } catch {
      toast.error('Error al leer el archivo');
    }
  };

  const handleImport = async () => {
    if (parsedData.length === 0) {
      toast.error('No hay datos para importar');
      return;
    }

    setImporting(true);
    try {
      const result = await pesajesService.importarXR5000(
        parsedData,
        importLoteId || undefined,
        importOperador || undefined
      );
      toast.success(
        `Importación completada: ${result.exitosos} exitosos, ${result.fallidos} fallidos`
      );
      if (result.errores && result.errores.length > 0) {
        result.errores.slice(0, 3).forEach((err) => toast.error(err));
      }
      setImportDialogOpen(false);
      setImportFile(null);
      setParsedData([]);
      setImportLoteId('');
      setImportOperador('');
      loadData();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Error al importar datos');
    } finally {
      setImporting(false);
    }
  };

  const resetImport = () => {
    setImportFile(null);
    setParsedData([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
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
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Error al crear sesión');
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
          <Button variant="outline" size="sm" onClick={loadData} className="hidden sm:flex">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
          <Button variant="outline" size="icon" onClick={loadData} className="sm:hidden h-9 w-9">
            <RefreshCw className="h-4 w-4" />
          </Button>

          <Dialog open={importDialogOpen} onOpenChange={(open) => {
            setImportDialogOpen(open);
            if (!open) resetImport();
          }}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Importar XR5000</span>
                <span className="sm:hidden">Importar</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Importar desde XR5000</DialogTitle>
                <DialogDescription>
                  Sube el archivo CSV/TXT exportado desde tu equipo XR5000
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.txt"
                  className="hidden"
                  onChange={handleFileSelect}
                />

                {!importFile ? (
                  <div
                    className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const file = e.dataTransfer.files[0];
                      if (file && fileInputRef.current) {
                        const dt = new DataTransfer();
                        dt.items.add(file);
                        fileInputRef.current.files = dt.files;
                        fileInputRef.current.dispatchEvent(new Event('change', { bubbles: true }));
                      }
                    }}
                  >
                    <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Arrastra tu archivo aquí o haz clic para seleccionar
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Formatos: CSV, TXT — Columnas: CODIGO;PESO o CODIGO,PESO
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/50">
                      <File className="h-8 w-8 text-primary flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{importFile.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(importFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        {parsedData.length > 0 ? (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {parsedData.length} registros
                          </Badge>
                        ) : (
                          <Badge variant="destructive">
                            <XCircle className="h-3 w-3 mr-1" />
                            Sin datos
                          </Badge>
                        )}
                      </div>
                      <Button variant="ghost" size="sm" onClick={resetImport}>
                        Cambiar
                      </Button>
                    </div>

                    {parsedData.length > 0 && (
                      <div className="border rounded-md max-h-40 overflow-y-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Código</TableHead>
                              <TableHead className="text-right">Peso (kg)</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {parsedData.slice(0, 10).map((row, idx) => (
                              <TableRow key={idx}>
                                <TableCell className="font-mono text-sm">{row.codigo}</TableCell>
                                <TableCell className="text-right">{row.peso}</TableCell>
                              </TableRow>
                            ))}
                            {parsedData.length > 10 && (
                              <TableRow>
                                <TableCell colSpan={2} className="text-center text-muted-foreground text-sm">
                                  ... y {parsedData.length - 10} más
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Asociar a lote (opcional)</Label>
                  <Select value={importLoteId} onValueChange={setImportLoteId}>
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
                  <Label>Operador (opcional)</Label>
                  <Input
                    placeholder="Nombre del operador"
                    value={importOperador}
                    onChange={(e) => setImportOperador(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setImportDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button
                  onClick={handleImport}
                  disabled={parsedData.length === 0 || importing}
                >
                  {importing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Importar {parsedData.length > 0 ? `(${parsedData.length})` : ''}
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
