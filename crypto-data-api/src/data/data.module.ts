import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { DataController } from './data.controller';
import { DataService } from './data.service';
import { QueryTrimMiddleware } from '../common/query.trim.middleware';

@Module({
    controllers: [DataController],
    providers: [DataService],
    imports: [CacheModule.register()],
})
export class DataModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(QueryTrimMiddleware).forRoutes({
            path: '*',
            method: RequestMethod.ALL,
        });
    }
}
