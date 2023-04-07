import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { DataModule } from '../src/data/data.module';
import { MainModule } from '../src/main.module';

describe('DataController (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [DataModule, MainModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('Find market cap summary', function () {
        return request(app.getHttpServer()).get('/coinmarketcap/mcap-summary').expect(200);
    });

    it('Should return response on call by coin full name - ethereum', function () {
        return request(app.getHttpServer())
            .get('/bot/contract/summary?coinFullName=ethereum')
            .then((res) => {
                expect(res.text).toMatch('Ethereum Price');
            });
    });

    it('Should return response on call by coin full name - cumrocket', function () {
        return request(app.getHttpServer())
            .get('/bot/contract/summary?coinFullName=cumrocket')
            .then((res) => {
                expect(res.text).toMatch('CumRocket Price');
            });
    });

    it('/images/2YearMovingAvg (GET)', () => {
        return request(app.getHttpServer()).get('/images/2YearMovingAvg').expect(200);
    });

    it('/images/rainbow (GET)', () => {
        return request(app.getHttpServer()).get('/images/rainbow').expect(200);
    });

    it('/coinmarketcap/mcap-summary (GET)', () => {
        return request(app.getHttpServer()).get('/coinmarketcap/mcap-summary').expect(200);
    });

    it('/coinmarketcap/trending (GET)', () => {
        return request(app.getHttpServer()).get('/coinmarketcap/trending').expect(200);
    });
});
