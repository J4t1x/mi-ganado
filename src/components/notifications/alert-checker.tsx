'use client';

import { useEffect, useRef } from 'react';
import { generateAlerts, getAlertConfig } from '@/lib/alerts/alert-engine';
import { sanitarioService } from '@/lib/api/sanitario';
import { ventasService } from '@/lib/api/financiero';
import { movimientosService } from '@/lib/api/movimientos';

/**
 * Runs alert checks periodically (every 5 minutes) and on mount.
 * Mount this once in the dashboard layout.
 */
export function AlertChecker() {
  const lastCheck = useRef<number>(0);

  useEffect(() => {
    const CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes

    const runChecks = async () => {
      const now = Date.now();
      if (now - lastCheck.current < CHECK_INTERVAL) return;
      lastCheck.current = now;

      const config = getAlertConfig();
      const alertData: Parameters<typeof generateAlerts>[0] = {};

      try {
        // Check sanitary events
        if (config.sanitarioVencidos) {
          try {
            const vencidos = await sanitarioService.getAll({ estado: 'VENCIDO', limit: 1 });
            alertData.eventosVencidos = vencidos.meta.total;
          } catch { /* API not available yet */ }
        }

        if (config.sanitarioProgramados) {
          try {
            const today = new Date().toISOString().split('T')[0];
            const programados = await sanitarioService.getAll({
              estado: 'PROGRAMADO',
              fechaDesde: today,
              fechaHasta: today,
              limit: 1,
            });
            alertData.eventosProgramadosHoy = programados.meta.total;
          } catch { /* API not available yet */ }
        }

        // Check pending sales
        if (config.ventasPendientes) {
          try {
            const ventas = await ventasService.getAll({ limit: 100 });
            alertData.ventasPendientes = ventas.data.filter((v) => !v.pagado).length;
          } catch { /* API not available yet */ }
        }

        // Check draft movements
        if (config.movimientosBorrador) {
          try {
            const borradores = await movimientosService.getAll({ estado: 'BORRADOR', limit: 1 });
            alertData.movimientosBorrador = borradores.meta.total;
          } catch { /* API not available yet */ }
        }

        generateAlerts(alertData);
      } catch {
        // Silently fail - alerts are non-critical
      }
    };

    // Run on mount after a short delay
    const initialTimer = setTimeout(runChecks, 3000);

    // Run periodically
    const interval = setInterval(runChecks, 5 * 60 * 1000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  return null;
}
