import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ImageController } from './image.controller';
import { QueryTrimMiddleware } from '../common/query.trim.middleware';
import { ImageService } from './image.service';

@Module({
    controllers: [ImageController],
    providers: [ImageService],
})
export class ImageModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(QueryTrimMiddleware).forRoutes({
            path: '*',
            method: RequestMethod.ALL,
        });
    }
}
