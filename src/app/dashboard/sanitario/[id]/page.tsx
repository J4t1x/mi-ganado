'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  Loader2,
  Syringe,
  Pill,
  Bug,
  Stethoscope,
  Calendar,
  Edit,
  Trash2,
  Save,
  X,
} from 'lucide-react';
import { sanitarioService, EventoSanitario, UpdateEventoSanitarioDto } from '@/lib/api/sanitario';
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

export default function EventoSanitarioDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [evento, setEvento] = useState<EventoSanitario | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editData, setEditData] = useState<UpdateEventoSanitarioDto>({});

  useEffect(() => {
    loadEvento();
  }, [params.id]);

  const loadEvento = async () => {
    try {
      const data = await sanitarioService.getById(params.id as string);
      setEvento(data);
      setEditData({
        tipo: data.tipo,
        fecha: data.fecha?.split('T')[0],
        fechaProxima: data.fechaProxima?.split('T')[0],
        producto: data.producto,
        dosis: data.dosis,
        viaAplicacion: data.viaAplicacion,
        lote: data.lote,
        periodoResguardo: data.periodoResguardo,
        veterinario: data.veterinario,
        observaciones: data.observaciones,
        estado: data.estado,
      });
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Error al cargar evento');
      router.push('/dashboard/sanitario');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await sanitarioService.update(params.id as string, editData);
      toast.success('Evento actualizado');
      setEditing(false);
      loadEvento();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Error al actualizar');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await sanitarioService.delete(params.id as string);
      toast.success('Evento eliminado');
      router.push('/dashboard/sanitario');
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Error al eliminar');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!evento) return null;

  const TipoIcon = TIPOS.find((t) => t.value === evento.tipo)?.icon || Calendar;
  const tipoLabel = TIPOS.find((t) => t.value === evento.tipo)?.label || evento.tipo;
  const estadoInfo = ESTADOS.find((e) => e.value === evento.estado);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/sanitario">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Detalle Evento Sanitario</h1>
            <p className="text-muted-foreground">{tipoLabel} — {evento.producto}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {editing ? (
            <>
              <Button variant="outline" onClick={() => setEditing(false)} disabled={saving}>
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                Guardar
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
              <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TipoIcon className="h-5 w-5" />
              Información del Evento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {editing ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tipo</Label>
                    <Select
                      value={editData.tipo}
                      onValueChange={(v) => setEditData({ ...editData, tipo: v as EventoSanitario['tipo'] })}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
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
                      value={editData.estado}
                      onValueChange={(v) => setEditData({ ...editData, estado: v as EventoSanitario['estado'] })}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {ESTADOS.map((e) => (
                          <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Producto</Label>
                  <Input
                    value={editData.producto || ''}
                    onChange={(e) => setEditData({ ...editData, producto: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Fecha</Label>
                    <Input
                      type="date"
                      value={editData.fecha || ''}
                      onChange={(e) => setEditData({ ...editData, fecha: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Próxima dosis</Label>
                    <Input
                      type="date"
                      value={editData.fechaProxima || ''}
                      onChange={(e) => setEditData({ ...editData, fechaProxima: e.target.value || undefined })}
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <p className="text-sm text-muted-foreground">Tipo</p>
                  <div className="flex items-center gap-2 mt-1">
                    <TipoIcon className="h-4 w-4" />
                    <p className="font-medium">{tipoLabel}</p>
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Producto / Vacuna</p>
                  <p className="font-medium">{evento.producto}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Fecha de aplicación</p>
                  <p className="font-medium">{new Date(evento.fecha).toLocaleDateString('es-CL')}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Próxima dosis</p>
                  <p className="font-medium">
                    {evento.fechaProxima
                      ? new Date(evento.fechaProxima).toLocaleDateString('es-CL')
                      : 'No programada'}
                  </p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Estado</p>
                  <Badge variant={estadoInfo?.variant || 'outline'} className="mt-1">
                    {estadoInfo?.label || evento.estado}
                  </Badge>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detalles de Aplicación</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {editing ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Dosis</Label>
                    <Input
                      value={editData.dosis || ''}
                      onChange={(e) => setEditData({ ...editData, dosis: e.target.value || undefined })}
                      placeholder="Ej: 5 ml"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Vía</Label>
                    <Select
                      value={editData.viaAplicacion || ''}
                      onValueChange={(v) => setEditData({ ...editData, viaAplicacion: v || undefined })}
                    >
                      <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
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
                      value={editData.veterinario || ''}
                      onChange={(e) => setEditData({ ...editData, veterinario: e.target.value || undefined })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Resguardo (días)</Label>
                    <Input
                      type="number"
                      min={0}
                      value={editData.periodoResguardo || ''}
                      onChange={(e) => setEditData({ ...editData, periodoResguardo: e.target.value ? parseInt(e.target.value) : undefined })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Lote producto</Label>
                  <Input
                    value={editData.lote || ''}
                    onChange={(e) => setEditData({ ...editData, lote: e.target.value || undefined })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Observaciones</Label>
                  <Input
                    value={editData.observaciones || ''}
                    onChange={(e) => setEditData({ ...editData, observaciones: e.target.value || undefined })}
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <p className="text-sm text-muted-foreground">Dosis</p>
                  <p className="font-medium">{evento.dosis || 'No especificada'}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Vía de aplicación</p>
                  <p className="font-medium">{evento.viaAplicacion?.replace('_', ' ') || 'No especificada'}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Veterinario</p>
                  <p className="font-medium">{evento.veterinario || 'No especificado'}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Período de resguardo</p>
                  <p className="font-medium">
                    {evento.periodoResguardo ? `${evento.periodoResguardo} días` : 'No aplica'}
                  </p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Lote del producto</p>
                  <p className="font-medium">{evento.lote || 'No especificado'}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Observaciones</p>
                  <p className="font-medium">{evento.observaciones || 'Sin observaciones'}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">Metadatos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-8 text-sm text-muted-foreground">
            <div>
              <span className="font-medium">Creado:</span>{' '}
              {new Date(evento.createdAt).toLocaleString('es-CL')}
            </div>
            <div>
              <span className="font-medium">Actualizado:</span>{' '}
              {new Date(evento.updatedAt).toLocaleString('es-CL')}
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar evento sanitario?</AlertDialogTitle>
            <AlertDialogDescription>
              Se eliminará permanentemente el registro de &quot;{evento.producto}&quot;.
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
