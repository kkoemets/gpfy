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

    it('Find market cap summary', function () {
        return request(app.getHttpServer()).get('/coinmarketcap/mcap-summary').expect(200);
    });

    it('Should return response on call by coin full name - ethereum', function () {
        return request(app.getHttpServer())
            .get('/bot/contract/summary?coinFullName=ethereum')
            .then((res) => {
                expect(res.text).toMatch('Ethereum Token/ETH');
            });
    });

    it('Should return response on call by coin full name - cumrocket', function () {
        return request(app.getHttpServer())
            .get('/bot/contract/summary?coinFullName=cumrocket')
            .then((res) => {
                expect(res.text).toMatch('CumRocket/CUMMIES');
            });
    });

    it('Should return response on call', function () {
        return request(app.getHttpServer())
            .get('/bot/contract/summary?contract=0x27ae27110350b98d564b9a3eed31baebc82d878d')
            .then((res) => {
                expect(res.text).toMatch('CumRocket/CUMMIES');
            });
    });

    it('/bot/images/2YearMovingAvg (GET)', () => {
        return request(app.getHttpServer()).get('/bot/images/2YearMovingAvg').expect(200);
    });

    it('/bot/images/rainbow (GET)', () => {
        return request(app.getHttpServer()).get('/bot/images/rainbow').expect(200);
    });

    it('/coinmarketcap/mcap-summary (GET)', () => {
        return request(app.getHttpServer()).get('/coinmarketcap/mcap-summary').expect(200);
    });

    it('/coinmarketcap/trending (GET)', () => {
        return request(app.getHttpServer()).get('/coinmarketcap/trending').expect(200);
    });
});
