import { expect } from 'chai';
import {
    findCoinPriceInUsd,
    findCoinsPricesInUsd,
    findCoinSummaryFromCmc,
    findGreedIndex,
    findMarketCapSummary,
    findTrendingCoins,
} from '../../src/process/crypto-data';

describe('crypto-data', function () {
    it('Fetch - fear index', async function () {
        const greedIndexPromise = await findGreedIndex();

        expect(greedIndexPromise.time_until_update).to.be.not.null;
    });

    it('Find trending coins', async function () {
        const trendingCoinData = await findTrendingCoins();

        expect(trendingCoinData.length).to.be.greaterThan(0);
    });

    it('Find market cap summary', async function () {
        const { btcDominance, ethDominance, mcap, volume24H } = await findMarketCapSummary();
        expect(btcDominance).to.be.not.null;
        expect(ethDominance).to.be.not.null;
        expect(mcap).to.be.not.null;
        expect(volume24H).to.be.not.null;
    });

    it('Find coin summary from cmc', async function () {
        const coinSummary = await findCoinSummaryFromCmc({ coinOfficialName: 'bitcoin' });
        Object.entries(coinSummary).forEach(([, value]) => {
            expect(value).to.be.not.null;
        });
    });

    it('Find coin price in usd', async function () {
        const coinPrice = await findCoinPriceInUsd('bitcoin', 1);
        Object.entries(coinPrice).forEach(([, value]) => {
            expect(value).to.be.not.null;
        });
    });

    it('Find coin prices in usd', async function () {
        const data = [
            { coinOfficialName: 'bitcoin', amount: 1 },
            { coinOfficialName: 'ethereum', amount: 1 },
        ];
        const coinPrice = await findCoinsPricesInUsd({ data });
        Object.entries(coinPrice).forEach(([, value]) => {
            expect(value).to.be.not.null;
        });
    });
});
