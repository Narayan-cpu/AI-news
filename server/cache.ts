import type { EnrichedArticle } from "@shared/schema";

interface CacheEntry {
  data: EnrichedArticle[];
  timestamp: number;
}

class ArticleCache {
  private cache: Map<string, CacheEntry> = new Map();
  private readonly TTL = 5 * 60 * 1000; // 5 minutes

  set(key: string, data: EnrichedArticle[]): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  get(key: string): EnrichedArticle[] | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    const age = Date.now() - entry.timestamp;
    
    if (age > this.TTL) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  clear(): void {
    this.cache.clear();
  }

  generateKey(params: Record<string, any>): string {
    return JSON.stringify(params);
  }
}

export const articleCache = new ArticleCache();
