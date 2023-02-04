import { CacheModule, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { BagController } from './bag.controller';
import { BagService } from './bag.service';
import { QueryTrimMiddleware } from '../common/query.trim.middleware';
import { LruCacheModule } from '../lru-cache-service/lru.cache.module';

@Module({
    controllers: [BagController],
    providers: [BagService],
    imports: [CacheModule.register(), LruCacheModule],
})
export class BagModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(QueryTrimMiddleware).forRoutes({
            path: '*',
            method: RequestMethod.ALL,
        });
    }
}
