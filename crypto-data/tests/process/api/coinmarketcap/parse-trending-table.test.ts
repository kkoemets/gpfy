import { parseTrendingTable } from '../../../../src/process/api/coinmarketcap/parse-trending-table';
import * as fs from 'fs';
import { expect } from 'chai';
import { TrendingCoinData } from '../../../../src/process/api/coinmarketcap/coinmarketcap.api';

describe('parseTrendingTable', function () {
    it('Parse data', async function () {
        const result: TrendingCoinData[] = parseTrendingTable({
            trendingHtmlPage: fs.readFileSync(`${__dirname}/trending_page_table.html`).toString(),
        });
        expect(result.length).to.equal(30);

        const first: {
            position: string;
            coinName: string;
            price: string;
            _24hChange: string;
            _7dChange: string;
            _30Change: string;
            mcap: string;
            _24hVol: string;
        } = result[0];

        expect(first._24hVol).to.equal('$519,957,279');
        expect(first.price).to.equal('$7.47');
        expect(first.mcap).to.equal('$970,698,353');
        expect(first.position).to.equal('1');
        expect(first.coinName).to.equal('Aptos');
        expect(first._24hChange).to.equal('-1.80%');
        expect(first._7dChange).to.equal('-10.95%');
        expect(first._30Change).to.equal('-10.95%');
    });

    it('Parse data - with neutral', async function () {
        parseTrendingTable({
            trendingHtmlPage: fs.readFileSync(`${__dirname}/trending_table_table_with_neutral_mcap.html`).toString(),
        }).forEach(({ mcap }) => expect(mcap).to.match(new RegExp('^[\\d,$]*$')));
    });
});
