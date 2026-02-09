'use client';

import { useEffect } from 'react';
import { useOfflineStore } from '@/stores/offline-store';

/**
 * Hook that provides online/offline status and pending sync count.
 * Integrates with the offline store and listens to browser events.
 */
export function useOnlineStatus() {
  const { isOnline, pendingSync, lastSyncAt, setOnline } = useOfflineStore();

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Sync initial state
    setOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setOnline]);

  return { isOnline, pendingSync, lastSyncAt };
}
