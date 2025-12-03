// Sistema de caché simple para datos del usuario
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

class DataCache {
  private cache: Map<string, CacheItem<any>> = new Map();
  private isEnabled: boolean = true;

  constructor() {
    // Verificar si el almacenamiento está disponible
    try {
      const testKey = '__cache_test__';
      this.cache.set(testKey, { data: 'test', timestamp: Date.now() });
      this.cache.delete(testKey);
      this.isEnabled = true;
    } catch (error) {
      console.warn('Cache disabled due to storage error:', error);
      this.isEnabled = false;
    }
  }

  set<T>(key: string, data: T): void {
    if (!this.isEnabled) return;

    try {
      this.cache.set(key, {
        data,
        timestamp: Date.now()
      });
    } catch (error) {
      console.warn('Error setting cache:', error);
    }
  }

  get<T>(key: string): T | null {
    if (!this.isEnabled) return null;

    try {
      const item = this.cache.get(key);

      if (!item) return null;

      // Verificar si el caché expiró
      if (Date.now() - item.timestamp > CACHE_DURATION) {
        this.cache.delete(key);
        return null;
      }

      return item.data as T;
    } catch (error) {
      console.warn('Error getting cache:', error);
      return null;
    }
  }

  clear(key?: string): void {
    try {
      if (key) {
        this.cache.delete(key);
      } else {
        this.cache.clear();
      }
    } catch (error) {
      console.warn('Error clearing cache:', error);
    }
  }

  clearAll(): void {
    try {
      this.cache.clear();
    } catch (error) {
      console.warn('Error clearing all cache:', error);
    }
  }

  // Método para verificar si el caché está habilitado
  isAvailable(): boolean {
    return this.isEnabled;
  }
}

export const dataCache = new DataCache();
