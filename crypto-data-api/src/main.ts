import { NestFactory } from '@nestjs/core';
import { DataModule } from './data/data.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(DataModule);
    app.useGlobalPipes(new ValidationPipe());
    await app.listen(3000);
}

bootstrap();
