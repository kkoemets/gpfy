import { Test, TestingModule } from '@nestjs/testing';
import { DataService } from './data.service';

describe('DataService', () => {
    let service: DataService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [DataService],
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
        return expect(await service.findContractSummaryByNameApi('bnb')).toMatch('BNB');
    });

    it('Find BTC', async function () {
        return expect(await service.findContractSummaryByNameApi('bitcoin')).toMatch('Bitcoin');
    });

    it('Find trending summary', async function () {
        const { trendingSummary }: { trendingSummary: string } = await service.findTrendingCoins();
        expect(trendingSummary).not.toBeNull();
        expect(trendingSummary.split('\n').length).toEqual(40);
    });
});
