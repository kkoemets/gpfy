import { Test, TestingModule } from '@nestjs/testing';
import { BagService } from './bag.service';
import { CACHE_MANAGER } from '@nestjs/common';

describe('BagService', () => {
    let service: BagService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BagService,
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

        service = module.get<BagService>(BagService);
    });

    it('Find coin price in usd', async function () {
        const coinPrice = await service.findCoinPriceInUsd('bitcoin', 1);
        Object.entries(coinPrice).forEach(([, value]) => {
            expect(value).not.toBeNull();
        });
    });

    it('Find coin prices in usd', async function () {
        const data = [
            { coinOfficialName: 'bitcoin', amount: 1 },
            { coinOfficialName: 'ethereum', amount: 1 },
        ];
        const coinPrice = await service.findCoinsPricesInUsd({ data });
        Object.entries(coinPrice).forEach(([, value]) => {
            expect(value).not.toBeNull();
        });
    });
});
