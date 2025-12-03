// Sistema de caché simple para datos del usuario
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

class DataCache {
  private cache: Map<string, CacheItem<any>> = new Map();

  set<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) return null;
    
    // Verificar si el caché expiró
    if (Date.now() - item.timestamp > CACHE_DURATION) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data as T;
  }

  clear(key?: string): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  clearAll(): void {
    this.cache.clear();
  }
}

export const dataCache = new DataCache();
