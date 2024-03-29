import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from './cron.service';
import { LruCacheModule } from '../lru-cache-service/lru.cache.module';

@Module({
    providers: [CronService],
    imports: [ScheduleModule.forRoot(), CacheModule.register(), LruCacheModule],
})
export class CronModule {}
