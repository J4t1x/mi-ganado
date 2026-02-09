'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Bell,
  Syringe,
  Scale,
  ShoppingCart,
  ArrowRightLeft,
  Save,
  Trash2,
} from 'lucide-react';
import { getAlertConfig, setAlertConfig, AlertConfig } from '@/lib/alerts/alert-engine';
import { useNotificationsStore } from '@/stores/notifications-store';
import { toast } from 'sonner';

export default function AlertasConfigPage() {
  const [config, setConfig] = useState<AlertConfig>({
    sanitarioVencidos: true,
    sanitarioProgramados: true,
    ventasPendientes: true,
    pesajesAtrasados: true,
    movimientosBorrador: true,
  });
  const [mounted, setMounted] = useState(false);
  const { notifications, clearAll } = useNotificationsStore();

  useEffect(() => {
    setConfig(getAlertConfig());
    setMounted(true);
  }, []);

  const handleSave = () => {
    setAlertConfig(config);
    toast.success('Configuración de alertas guardada');
  };

  const handleClearAll = () => {
    clearAll();
    toast.success('Todas las notificaciones eliminadas');
  };

  if (!mounted) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/configuracion">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Configuración de Alertas</h1>
          <p className="text-muted-foreground">
            Controla qué notificaciones recibes
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Tipos de Alerta
            </CardTitle>
            <CardDescription>
              Activa o desactiva las alertas automáticas por categoría
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Syringe className="h-4 w-4 text-red-600" />
                <div>
                  <Label className="text-sm font-medium">Eventos sanitarios vencidos</Label>
                  <p className="text-xs text-muted-foreground">Alerta cuando hay vacunas o tratamientos vencidos</p>
                </div>
              </div>
              <Switch
                checked={config.sanitarioVencidos}
                onCheckedChange={(v: boolean) => setConfig({ ...config, sanitarioVencidos: v })}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Syringe className="h-4 w-4 text-yellow-600" />
                <div>
                  <Label className="text-sm font-medium">Eventos sanitarios programados</Label>
                  <p className="text-xs text-muted-foreground">Alerta de eventos programados para hoy</p>
                </div>
              </div>
              <Switch
                checked={config.sanitarioProgramados}
                onCheckedChange={(v: boolean) => setConfig({ ...config, sanitarioProgramados: v })}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingCart className="h-4 w-4 text-yellow-600" />
                <div>
                  <Label className="text-sm font-medium">Ventas pendientes de pago</Label>
                  <p className="text-xs text-muted-foreground">Alerta cuando hay ventas sin confirmar pago</p>
                </div>
              </div>
              <Switch
                checked={config.ventasPendientes}
                onCheckedChange={(v: boolean) => setConfig({ ...config, ventasPendientes: v })}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Scale className="h-4 w-4 text-blue-600" />
                <div>
                  <Label className="text-sm font-medium">Pesajes atrasados</Label>
                  <p className="text-xs text-muted-foreground">Alerta de animales sin pesaje en 30+ días</p>
                </div>
              </div>
              <Switch
                checked={config.pesajesAtrasados}
                onCheckedChange={(v: boolean) => setConfig({ ...config, pesajesAtrasados: v })}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ArrowRightLeft className="h-4 w-4 text-blue-600" />
                <div>
                  <Label className="text-sm font-medium">Movimientos en borrador</Label>
                  <p className="text-xs text-muted-foreground">Alerta de movimientos sin confirmar</p>
                </div>
              </div>
              <Switch
                checked={config.movimientosBorrador}
                onCheckedChange={(v: boolean) => setConfig({ ...config, movimientosBorrador: v })}
              />
            </div>

            <div className="pt-2">
              <Button onClick={handleSave} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Guardar Configuración
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estado de Notificaciones</CardTitle>
            <CardDescription>
              Resumen de tus notificaciones actuales
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg text-center">
                <p className="text-2xl font-bold">{notifications.length}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <p className="text-2xl font-bold text-primary">{unreadCount}</p>
                <p className="text-xs text-muted-foreground">Sin leer</p>
              </div>
            </div>

            {notifications.length > 0 && (
              <>
                <Separator />
                <div className="space-y-2">
                  <p className="text-sm font-medium">Últimas notificaciones</p>
                  {notifications.slice(0, 5).map((n) => (
                    <div key={n.id} className="flex items-center gap-2 text-sm">
                      <div className={`h-2 w-2 rounded-full flex-shrink-0 ${
                        n.type === 'error' ? 'bg-red-500' :
                        n.type === 'warning' ? 'bg-yellow-500' :
                        n.type === 'success' ? 'bg-green-500' :
                        'bg-blue-500'
                      }`} />
                      <span className={n.read ? 'text-muted-foreground' : 'font-medium'}>{n.title}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            <Separator />

            <Button variant="outline" onClick={handleClearAll} className="w-full" disabled={notifications.length === 0}>
              <Trash2 className="h-4 w-4 mr-2" />
              Limpiar todas las notificaciones
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
