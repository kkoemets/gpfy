import { Test, TestingModule } from '@nestjs/testing';
import { ImageService } from './image.service';

describe('ImageService', () => {
    let service: ImageService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ImageService],
        }).compile();

        service = module.get<ImageService>(ImageService);
    });

    it('rainbow should work', async () => {
        expect(await service.findRainbowChart()).toBeDefined();
    });

    it('2 year avg should work', async () => {
        expect(await service.findBtc2YearMovingAverage()).toBeDefined();
    });
});
