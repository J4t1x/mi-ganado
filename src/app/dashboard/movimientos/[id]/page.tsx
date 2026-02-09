'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeft,
  Truck,
  DollarSign,
  ShoppingCart,
  AlertTriangle,
  ArrowRightLeft,
  CheckCircle,
  FileText,
  Loader2,
  Calendar,
  Building2,
  Users,
  Beef,
  Plus,
} from 'lucide-react';
import { movimientosService, Movimiento } from '@/lib/api/movimientos';
import { toast } from 'sonner';

function getMovementIcon(tipo: string) {
  switch (tipo) {
    case 'TRASLADO': return Truck;
    case 'VENTA': return DollarSign;
    case 'COMPRA': return ShoppingCart;
    case 'MUERTE': return AlertTriangle;
    default: return ArrowRightLeft;
  }
}

function getMovementBadgeVariant(tipo: string) {
  switch (tipo) {
    case 'TRASLADO': return 'secondary';
    case 'VENTA': return 'default';
    case 'COMPRA': return 'outline';
    case 'MUERTE': return 'destructive';
    default: return 'secondary';
  }
}

function getStatusBadgeVariant(estado: string) {
  switch (estado) {
    case 'CONFIRMADO': return 'default';
    case 'BORRADOR': return 'outline';
    case 'INFORMADO': return 'secondary';
    default: return 'outline';
  }
}

interface MovimientoDetalle {
  id: string;
  movimientoId: string;
  animalId: string;
  animal?: {
    id: string;
    especie?: string;
    sexo?: string;
    categoria?: string;
    raza?: { nombre: string };
    identificadores?: Array<{ tipo: string; codigo: string; activo: boolean }>;
  };
}

interface DocumentoMov {
  id: string;
  tipo: string;
  folio?: string;
  fecha?: string;
  archivoUrl?: string;
}

interface MovimientoFull extends Movimiento {
  detalles?: MovimientoDetalle[];
  documentos?: DocumentoMov[];
}

export default function MovimientoDetallePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [movimiento, setMovimiento] = useState<MovimientoFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [docDialogOpen, setDocDialogOpen] = useState(false);
  const [docForm, setDocForm] = useState({
    tipo: '',
    folio: '',
    fecha: '',
  });

  useEffect(() => {
    loadMovimiento();
  }, [id]);

  const loadMovimiento = async () => {
    setLoading(true);
    try {
      const data = await movimientosService.getById(id);
      setMovimiento(data as MovimientoFull);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Error al cargar movimiento');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmar = async () => {
    setConfirming(true);
    try {
      await movimientosService.confirmar(id);
      toast.success('Movimiento confirmado exitosamente');
      loadMovimiento();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Error al confirmar');
    } finally {
      setConfirming(false);
    }
  };

  const handleAddDocumento = async () => {
    if (!docForm.tipo) {
      toast.error('Selecciona el tipo de documento');
      return;
    }
    try {
      await movimientosService.addDocumento(id, {
        tipo: docForm.tipo,
        folio: docForm.folio || undefined,
        fecha: docForm.fecha || undefined,
      });
      toast.success('Documento agregado exitosamente');
      setDocDialogOpen(false);
      setDocForm({ tipo: '', folio: '', fecha: '' });
      loadMovimiento();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Error al agregar documento');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!movimiento) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <div className="text-center py-20 text-muted-foreground">
          Movimiento no encontrado
        </div>
      </div>
    );
  }

  const Icon = getMovementIcon(movimiento.tipo);
  const detalles = movimiento.detalles || [];
  const documentos = movimiento.documentos || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <Icon className="h-6 w-6 text-muted-foreground" />
            <h1 className="text-2xl md:text-3xl font-bold">
              {movimiento.tipo}
            </h1>
            <Badge variant={getMovementBadgeVariant(movimiento.tipo) as "default" | "secondary" | "outline" | "destructive"}>
              {movimiento.tipo}
            </Badge>
            <Badge variant={getStatusBadgeVariant(movimiento.estado) as "default" | "secondary" | "outline" | "destructive"}>
              {movimiento.estado}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">
            Creado el {new Date(movimiento.createdAt).toLocaleDateString('es-CL')}
          </p>
        </div>
        <div className="flex gap-2">
          {movimiento.estado === 'BORRADOR' && (
            <Button onClick={handleConfirmar} disabled={confirming}>
              {confirming ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4 mr-2" />
              )}
              Confirmar
            </Button>
          )}
          <Button variant="outline" onClick={() => setDocDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Documento
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Fecha
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">
              {new Date(movimiento.fecha).toLocaleDateString('es-CL', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Origen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">
              {movimiento.establecimientoOrigen?.nombre || '-'}
            </p>
            {movimiento.titularOrigen && (
              <p className="text-sm text-muted-foreground">
                {movimiento.titularOrigen.nombreRazonSocial}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Destino
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">
              {movimiento.establecimientoDestino?.nombre || '-'}
            </p>
            {movimiento.titularDestino && (
              <p className="text-sm text-muted-foreground">
                {movimiento.titularDestino.nombreRazonSocial}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Beef className="h-5 w-5" />
                Animales ({detalles.length})
              </CardTitle>
              <CardDescription>Animales incluidos en este movimiento</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {detalles.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No hay animales registrados en este movimiento
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>DIIO</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Raza</TableHead>
                    <TableHead>Sexo</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {detalles.map((detalle) => {
                    const animal = detalle.animal;
                    const diio = animal?.identificadores?.find(
                      (i) => i.tipo === 'DIIO_VISUAL' && i.activo
                    )?.codigo || '-';
                    return (
                      <TableRow key={detalle.id}>
                        <TableCell className="font-mono text-sm">{diio}</TableCell>
                        <TableCell>{animal?.categoria || '-'}</TableCell>
                        <TableCell>{animal?.raza?.nombre || '-'}</TableCell>
                        <TableCell>{animal?.sexo || '-'}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/dashboard/animales/${detalle.animalId}`}>
                              Ver animal
                            </Link>
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

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Documentos ({documentos.length})
              </CardTitle>
              <CardDescription>Guías, facturas y formularios asociados</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => setDocDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {documentos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No hay documentos asociados
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Folio</TableHead>
                    <TableHead>Fecha</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documentos.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>
                        <Badge variant="outline">{doc.tipo.replace(/_/g, ' ')}</Badge>
                      </TableCell>
                      <TableCell>{doc.folio || '-'}</TableCell>
                      <TableCell>
                        {doc.fecha
                          ? new Date(doc.fecha).toLocaleDateString('es-CL')
                          : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={docDialogOpen} onOpenChange={setDocDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Documento</DialogTitle>
            <DialogDescription>
              Asocia un documento a este movimiento
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Tipo de documento</Label>
              <Select value={docForm.tipo} onValueChange={(val) => setDocForm({ ...docForm, tipo: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GUIA_DESPACHO">Guía de Despacho</SelectItem>
                  <SelectItem value="FACTURA">Factura</SelectItem>
                  <SelectItem value="FORMULARIO_ENTREGA">Formulario de Entrega</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Folio</Label>
              <Input
                placeholder="Número de folio"
                value={docForm.folio}
                onChange={(e) => setDocForm({ ...docForm, folio: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Fecha</Label>
              <Input
                type="date"
                value={docForm.fecha}
                onChange={(e) => setDocForm({ ...docForm, fecha: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDocDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddDocumento}>
              Agregar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
