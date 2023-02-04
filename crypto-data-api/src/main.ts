import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { config } from './config';
import { MainModule } from './main.module';

async function bootstrap() {
    const app = await NestFactory.create(MainModule);
    app.useGlobalPipes(new ValidationPipe());
    const { app_port } = config;
    await app.listen(app_port);
    console.log(`Listening on port-${app_port}`);
}

bootstrap();
