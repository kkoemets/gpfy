import { Test, TestingModule } from '@nestjs/testing';
import { DataService } from './data.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('DataService', () => {
    let service: DataService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
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

        service = module.get<DataService>(DataService);
    });

    it('Mcap summary should work', async () => {
        expect(await service.findMarketCapSummary()).toBeDefined();
    });

    it('Find BNB', async function () {
        return expect(JSON.stringify(await service.findContractSummaryByNameApi('bnb'))).toMatch('BNB');
    });

    it('Find BTC', async function () {
        return expect(JSON.stringify(await service.findContractSummaryByNameApi('bitcoin'))).toMatch('Bitcoin');
    });

    it('Find trending summary', async function () {
        const { trendingSummary }: { trendingSummary: string } = await service.findTrendingCoins();
        expect(trendingSummary).not.toBeNull();
        expect(trendingSummary.split('\n').length).toEqual(40);
    });
});
