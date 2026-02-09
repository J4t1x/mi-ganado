'use client';

import { useOfflineStore } from '@/stores/offline-store';

interface QueuedRequest {
  id?: number;
  url: string;
  method: string;
  headers: Record<string, string>;
  body: string;
  timestamp: number;
  description?: string;
}

const DB_NAME = 'mi-ganado-offline';
const DB_VERSION = 1;
const STORE_NAME = 'sync-queue';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('offline-data')) {
        db.createObjectStore('offline-data', { keyPath: 'key' });
      }
    };
  });
}

export const syncQueue = {
  /**
   * Add a failed request to the sync queue for later retry.
   */
  async add(request: Omit<QueuedRequest, 'id' | 'timestamp'>, description?: string): Promise<void> {
    try {
      const db = await openDB();
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      await new Promise<void>((resolve, reject) => {
        const req = store.add({
          ...request,
          timestamp: Date.now(),
          description,
        });
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
      db.close();

      // Update the store count
      const count = await this.count();
      useOfflineStore.getState().setPendingSync(count);
    } catch (error) {
      console.error('[SyncQueue] Error adding to queue:', error);
    }
  },

  /**
   * Get all queued requests.
   */
  async getAll(): Promise<QueuedRequest[]> {
    try {
      const db = await openDB();
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      return new Promise((resolve, reject) => {
        const req = store.getAll();
        req.onsuccess = () => {
          db.close();
          resolve(req.result);
        };
        req.onerror = () => {
          db.close();
          reject(req.error);
        };
      });
    } catch {
      return [];
    }
  },

  /**
   * Get the count of pending requests.
   */
  async count(): Promise<number> {
    try {
      const db = await openDB();
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      return new Promise((resolve, reject) => {
        const req = store.count();
        req.onsuccess = () => {
          db.close();
          resolve(req.result);
        };
        req.onerror = () => {
          db.close();
          reject(req.error);
        };
      });
    } catch {
      return 0;
    }
  },

  /**
   * Remove a specific request from the queue.
   */
  async remove(id: number): Promise<void> {
    try {
      const db = await openDB();
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      await new Promise<void>((resolve, reject) => {
        const req = store.delete(id);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
      db.close();

      const count = await this.count();
      useOfflineStore.getState().setPendingSync(count);
    } catch (error) {
      console.error('[SyncQueue] Error removing from queue:', error);
    }
  },

  /**
   * Process all queued requests. Called when back online.
   */
  async processAll(): Promise<{ success: number; failed: number }> {
    const items = await this.getAll();
    let success = 0;
    let failed = 0;

    for (const item of items) {
      try {
        const response = await fetch(item.url, {
          method: item.method,
          headers: item.headers,
          body: item.method !== 'GET' ? item.body : undefined,
        });

        if (response.ok) {
          await this.remove(item.id!);
          success++;
        } else {
          failed++;
        }
      } catch {
        failed++;
      }
    }

    const count = await this.count();
    useOfflineStore.getState().setPendingSync(count);

    if (success > 0) {
      useOfflineStore.getState().setLastSyncAt(new Date().toISOString());
    }

    return { success, failed };
  },

  /**
   * Clear all queued requests.
   */
  async clear(): Promise<void> {
    try {
      const db = await openDB();
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      await new Promise<void>((resolve, reject) => {
        const req = store.clear();
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
      db.close();
      useOfflineStore.getState().setPendingSync(0);
    } catch (error) {
      console.error('[SyncQueue] Error clearing queue:', error);
    }
  },
};
