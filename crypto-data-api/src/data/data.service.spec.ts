import { Test, TestingModule } from '@nestjs/testing';
import { CoinPrice, CoinsPrices, DataService } from './data.service';
import { CACHE_MANAGER } from '@nestjs/common';

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

    it('rainbow should work', async () => {
        expect(await service.findRainbowChart()).toBeDefined();
    });

    it('2 year avg should work', async () => {
        expect(await service.findBtc2YearMovingAverage()).toBeDefined();
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

    it('Find ETH price', async function () {
        const result: CoinPrice = await service.findCoinPriceInUsd('ethereum', 0.1432);
        expect(result).not.toBeNull();
        expect(result.currency).toEqual('USD');
    });

    it('Find ETH & BTC price', async function () {
        const result: CoinsPrices = await service.findCoinsPricesInUsd([
            { coinOfficialName: 'ethereum', amount: 0.1432 },
            { coinOfficialName: 'bitcoin', amount: 0.1432 },
        ]);
        expect(result.prices.length).toEqual(2);
        expect(result.totalValue).not.toBeNull();
    });
});
