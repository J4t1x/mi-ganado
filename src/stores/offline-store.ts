import { create } from 'zustand';

interface OfflineState {
  isOnline: boolean;
  pendingSync: number;
  lastSyncAt: string | null;
  setOnline: (online: boolean) => void;
  setPendingSync: (count: number) => void;
  setLastSyncAt: (date: string) => void;
  incrementPending: () => void;
  decrementPending: () => void;
}

export const useOfflineStore = create<OfflineState>((set) => ({
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  pendingSync: 0,
  lastSyncAt: null,
  setOnline: (isOnline) => set({ isOnline }),
  setPendingSync: (pendingSync) => set({ pendingSync }),
  setLastSyncAt: (lastSyncAt) => set({ lastSyncAt }),
  incrementPending: () => set((state) => ({ pendingSync: state.pendingSync + 1 })),
  decrementPending: () => set((state) => ({ pendingSync: Math.max(0, state.pendingSync - 1) })),
}));

// Initialize online/offline listeners
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    useOfflineStore.getState().setOnline(true);
  });
  
  window.addEventListener('offline', () => {
    useOfflineStore.getState().setOnline(false);
  });
}
