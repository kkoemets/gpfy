import { Test, TestingModule } from '@nestjs/testing';
import { DataController } from './data.controller';
import { DataService } from './data.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('DataController', () => {
    let controller: DataController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [DataController],
            providers: [
                DataService,
                {
                    provide: CACHE_MANAGER,
                    useValue: {
                        get: async () => {
                            return null;
                        },
                        set: async () => {
                            return null;
                        },
                    },
                },
            ],
        }).compile();

        controller = module.get<DataController>(DataController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
        expect(controller.findMarketCapSummary).toBeDefined();
        expect(controller.findContractSummary).toBeDefined();
        expect(controller.findTrendingCoins).toBeDefined();
    });
});
