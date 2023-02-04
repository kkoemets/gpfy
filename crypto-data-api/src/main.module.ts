import { Module } from '@nestjs/common';
import { DataModule } from './data/data.module';
import { BagModule } from './bag/bag.module';
import { ImageModule } from './image/image.module';

@Module({
    imports: [DataModule, BagModule, ImageModule],
})
export class MainModule {}
