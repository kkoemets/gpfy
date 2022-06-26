import { NestFactory } from '@nestjs/core';
import { DataModule } from './data/data.module';
import { ValidationPipe } from '@nestjs/common';
import { config } from './config';

async function bootstrap() {
    const app = await NestFactory.create(DataModule);
    app.useGlobalPipes(new ValidationPipe());
    const { app_port } = config;
    await app.listen(app_port);
    console.log(`Listening on port-${app_port}`);
}

bootstrap();
