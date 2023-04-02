import LRUCache from 'lru-cache';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LruCacheService {
    private maxSize = 50;

    private cache: LRUCache<string, unknown> = new LRUCache({ max: this.maxSize });

    get(key: string): unknown {
        return this.cache.get(key);
    }

    set(key: string, value: unknown): void {
        this.cache.set(key, value);
    }

    size(): number {
        return this.cache.size;
    }

    getAllEntries(): unknown[][] {
        if (this.cache.size === 0) {
            return [];
        }

        return [...this.cache.entries()];
    }
}
