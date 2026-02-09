'use client';

import { useEffect, useCallback } from 'react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { syncQueue } from '@/lib/offline/sync-queue';
import { useOfflineStore } from '@/stores/offline-store';
import { toast } from 'sonner';

/**
 * Component that manages automatic sync when coming back online.
 * Mount this once in the dashboard layout.
 */
export function SyncManager() {
  const { isOnline } = useOnlineStatus();
  const { pendingSync } = useOfflineStore();

  const processQueue = useCallback(async () => {
    if (pendingSync === 0) return;

    toast.info(`Sincronizando ${pendingSync} operación(es) pendiente(s)...`);

    try {
      const result = await syncQueue.processAll();
      if (result.success > 0) {
        toast.success(`${result.success} operación(es) sincronizada(s)`);
      }
      if (result.failed > 0) {
        toast.warning(`${result.failed} operación(es) fallaron. Se reintentarán.`);
      }
    } catch {
      toast.error('Error al sincronizar operaciones pendientes');
    }
  }, [pendingSync]);

  // Auto-sync when coming back online
  useEffect(() => {
    if (isOnline && pendingSync > 0) {
      // Small delay to let the connection stabilize
      const timer = setTimeout(processQueue, 2000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, pendingSync, processQueue]);

  // Initialize pending count on mount
  useEffect(() => {
    syncQueue.count().then((count) => {
      useOfflineStore.getState().setPendingSync(count);
    });
  }, []);

  // Show toast when going offline
  useEffect(() => {
    if (!isOnline) {
      toast.warning('Sin conexión. Los cambios se guardarán localmente.', {
        duration: 5000,
      });
    }
  }, [isOnline]);

  return null;
}
