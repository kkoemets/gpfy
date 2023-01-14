import { CacheModule, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { DataController } from './data.controller';
import { DataService } from './data.service';
import { QueryTrimMiddleware } from './query.trim.middleware';

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
