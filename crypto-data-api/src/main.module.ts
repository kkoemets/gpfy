import { Module } from '@nestjs/common';
import { DataModule } from './data/data.module';
import { BagModule } from './bag/bag.module';
import { ImageModule } from './image/image.module';
import { CronModule } from './cron/cron.module';

@Module({
    imports: [DataModule, BagModule, ImageModule, CronModule],
})
export class MainModule {}
