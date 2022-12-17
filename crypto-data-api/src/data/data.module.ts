import { CacheModule, Module } from '@nestjs/common';
import { DataController } from './data.controller';
import { DataService } from './data.service';

@Module({
    controllers: [DataController],
    providers: [DataService],
    imports: [CacheModule.register()],
})
export class DataModule {}
