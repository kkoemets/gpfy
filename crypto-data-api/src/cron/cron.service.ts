import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { LruCacheService } from '../lru-cache-service/lru.cache.service';
import { findCoinSummaryFromCmc } from 'crypto-data';

@Injectable()
export class CronService {
    private readonly logger = new Logger(CronService.name);

    constructor(@Inject(CACHE_MANAGER) private cacheManager, private lruCache: LruCacheService) {}

    @Cron('*/3 * * * *')
    async updateLeastRecentlyFetchedCoins() {
        this.logger.debug('Updating least recently fetched coins');
        const leastRecentlyFetchedCoins: unknown[][] = this.lruCache.getAllEntries();
        if (leastRecentlyFetchedCoins.length === 0) {
            this.logger.debug('No coins to fetch');
            return;
        }

        (
            await Promise.all(
                leastRecentlyFetchedCoins.map(async ([key, value]) => ({
                    key,
                    summary: await findCoinSummaryFromCmc({ coinOfficialName: value.toString() }),
                })),
            )
        ).map(({ key, summary }) => this.cacheManager.set(key, summary, 5 * 60));
        this.logger.debug('Fetched coins');
    }
}
