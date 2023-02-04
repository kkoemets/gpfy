import { Module } from '@nestjs/common';
import { LruCacheService } from './lru.cache.service';

@Module({ providers: [LruCacheService], exports: [LruCacheService] })
export class LruCacheModule {}
