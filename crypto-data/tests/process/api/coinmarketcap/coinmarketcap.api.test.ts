import { expect } from 'chai';
import { InversifyContainer } from '../../../../src/injection/inversify.container';
import {
    CoinmarketcapApi,
    CoinSummary,
    TrendingCoinData,
} from '../../../../src/process/api/coinmarketcap/coinmarketcap.api';
import { INVERSIFY_TYPES } from '../../../../src/injection/inversify.types';

const api: CoinmarketcapApi = InversifyContainer.get<CoinmarketcapApi>(INVERSIFY_TYPES.CoinmarketcapApi);

describe('coinmarketcapClient', function () {
    it('Fetch market cap summary', async function () {
        const { mcap, volume24H, btcDominance, ethDominance } = await api.findMarketCapSummary();
        expect(mcap).match(new RegExp(/^[zA-Z0-9$,.\\?]*$/)).to.be.not.null;
        expect(volume24H).match(new RegExp(/^[zA-Z0-9$,.\\?]*$/)).to.be.not.null;
        expect(btcDominance).not.to.be.null;
        expect(ethDominance).not.to.be.null;
    });

    it('Fetch coin summary from cmc - bitcoin', async function () {
        const summary: CoinSummary = await api.findCoinSummaryFromCmc({
            coinOfficialName: 'bitcoin',
        });
        expect(Object.entries(summary).length).to.equal(8);
        expect(summary.coinName).to.equal('Bitcoin');
    });

    it('Fetch coin summary from cmc - fetch.ai', async function () {
        const summary: CoinSummary = await api.findCoinSummaryFromCmc({
            coinOfficialName: 'fetch',
        });
        expect(Object.entries(summary).length).to.equal(8);
        expect(summary.coinName).to.equal('Fetch.ai');
    });

    it('Fetch invalid coin summary from cmc', async function () {
        return expect(
            await api
                .findCoinSummaryFromCmc({
                    coinOfficialName: 'invalidcoin573',
                })
                .catch((error) => error),
        ).and.be.an.instanceOf(Error);
    });

    it('Fetch trending coins from cmc', async function () {
        const results: TrendingCoinData[] = await api.findTrendingCoins();

        expect(results.length).to.equal(30);

        results.forEach(({ position, coinName, price, _24hChange, _7dChange, _30Change, mcap, _24hVol }) => {
            expect(typeof position).to.equal('string');
            expect(typeof coinName).to.equal('string');
            expect(typeof price).to.equal('string');
            expect(typeof _24hChange).to.equal('string');
            expect(typeof _7dChange).to.equal('string');
            expect(typeof _30Change).to.equal('string');
            expect(typeof mcap).to.equal('string');
            expect(typeof _24hVol).to.equal('string');
        });
    });
});
