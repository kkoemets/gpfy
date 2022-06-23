import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { DataModule } from '../src/data/data.module';

describe('DataController (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [DataModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/bot/images/2YearMovingAvg (GET)', () => {
        return request(app.getHttpServer())
            .get('/bot/images/2YearMovingAvg')
            .expect(200)
            .expect('findBtc2YearMovingAverage');
    });

    it('/bot/images/rainbow (GET)', () => {
        return request(app.getHttpServer()).get('/bot/images/rainbow').expect(200).expect('findRainbowChart');
    });

    it('/coinmarketcap/mcap-summary (GET)', () => {
        return request(app.getHttpServer())
            .get('/coinmarketcap/mcap-summary')
            .expect(200)
            .expect('findMarketCapSummary');
    });

    it('/bot/contract/summary (GET)', () => {
        return request(app.getHttpServer())
            .get('/bot/contract/summary')
            .expect(200)
            .expect(
                'contract\n' +
                    '  //                 ? await findContractSummaryApi(contract)\n' +
                    "  //                 : await findContractSummaryByNameApi(coinFullName || '')",
            );
    });

    it('/coinmarketcap/trending (GET)', () => {
        return request(app.getHttpServer()).get('/coinmarketcap/trending').expect(200).expect('findTrendingCoins');
    });
});
