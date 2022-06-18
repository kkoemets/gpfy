import { parseTrendingTable } from '../../../../src/process/api/coinmarketcap/parse-trending-table';
import * as fs from 'fs';
import { expect } from 'chai';
import { TrendingCoinData } from '../../../../src/process/api/coinmarketcap/coinmarketcap-api';

describe('parseTrendingTable', function () {
  it('Parse data', async function () {
    const result: TrendingCoinData[] = parseTrendingTable({
      trendingHtmlPage: fs
        .readFileSync(`${__dirname}/trending_page_table.html`)
        .toString(),
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

    expect(first._24hVol).to.equal('$32,895,414,238');
    expect(first.price).to.equal('$19,304.86');
    expect(first.mcap).to.equal('$368,152,388,590');
    expect(first.position).to.equal('1');
    expect(first.coinName).to.equal('Bitcoin');
    expect(first._24hChange).to.equal('-8.61%');
    expect(first._7dChange).to.equal('-33.27%');
    expect(first._30Change).to.equal('-33.72%');
  });
});
