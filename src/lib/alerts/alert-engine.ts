'use client';

import { useNotificationsStore, NotificationCategory } from '@/stores/notifications-store';

interface AlertRule {
  id: string;
  category: NotificationCategory;
  title: string;
  check: () => AlertResult | null;
  enabled: boolean;
}

interface AlertResult {
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  href?: string;
}

/**
 * Generates alerts based on dashboard/API data.
 * Call this periodically or after data loads.
 */
export function generateAlerts(data: {
  eventosVencidos?: number;
  eventosProgramadosHoy?: number;
  ventasPendientes?: number;
  animalesSinPesaje30d?: number;
  movimientosBorrador?: number;
}) {
  const store = useNotificationsStore.getState();
  const existingTitles = new Set(
    store.notifications
      .filter((n) => !n.read && Date.now() - new Date(n.createdAt).getTime() < 24 * 60 * 60 * 1000)
      .map((n) => n.title)
  );

  const addIfNew = (
    title: string,
    message: string,
    type: 'info' | 'warning' | 'error' | 'success',
    category: NotificationCategory,
    href?: string
  ) => {
    if (!existingTitles.has(title)) {
      store.addNotification({ title, message, type, category, href });
    }
  };

  // Sanitary alerts
  if (data.eventosVencidos && data.eventosVencidos > 0) {
    addIfNew(
      'Eventos sanitarios vencidos',
      `Hay ${data.eventosVencidos} evento(s) sanitario(s) vencido(s) que requieren atención.`,
      'error',
      'sanitario',
      '/dashboard/sanitario'
    );
  }

  if (data.eventosProgramadosHoy && data.eventosProgramadosHoy > 0) {
    addIfNew(
      'Eventos sanitarios hoy',
      `Tienes ${data.eventosProgramadosHoy} evento(s) sanitario(s) programado(s) para hoy.`,
      'warning',
      'sanitario',
      '/dashboard/sanitario'
    );
  }

  // Sales alerts
  if (data.ventasPendientes && data.ventasPendientes > 0) {
    addIfNew(
      'Ventas pendientes de pago',
      `Hay ${data.ventasPendientes} venta(s) sin confirmar pago.`,
      'warning',
      'ventas',
      '/dashboard/financiero'
    );
  }

  // Weighing alerts
  if (data.animalesSinPesaje30d && data.animalesSinPesaje30d > 0) {
    addIfNew(
      'Animales sin pesaje reciente',
      `${data.animalesSinPesaje30d} animal(es) no han sido pesados en los últimos 30 días.`,
      'info',
      'pesajes',
      '/dashboard/pesajes'
    );
  }

  // Movement alerts
  if (data.movimientosBorrador && data.movimientosBorrador > 0) {
    addIfNew(
      'Movimientos en borrador',
      `Hay ${data.movimientosBorrador} movimiento(s) en estado borrador sin confirmar.`,
      'info',
      'movimientos',
      '/dashboard/movimientos'
    );
  }
}

/**
 * Alert configuration stored in localStorage.
 */
export interface AlertConfig {
  sanitarioVencidos: boolean;
  sanitarioProgramados: boolean;
  ventasPendientes: boolean;
  pesajesAtrasados: boolean;
  movimientosBorrador: boolean;
}

const DEFAULT_CONFIG: AlertConfig = {
  sanitarioVencidos: true,
  sanitarioProgramados: true,
  ventasPendientes: true,
  pesajesAtrasados: true,
  movimientosBorrador: true,
};

export function getAlertConfig(): AlertConfig {
  if (typeof window === 'undefined') return DEFAULT_CONFIG;
  try {
    const stored = localStorage.getItem('alert-config');
    return stored ? { ...DEFAULT_CONFIG, ...JSON.parse(stored) } : DEFAULT_CONFIG;
  } catch {
    return DEFAULT_CONFIG;
  }
}

export function setAlertConfig(config: AlertConfig): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('alert-config', JSON.stringify(config));
}
