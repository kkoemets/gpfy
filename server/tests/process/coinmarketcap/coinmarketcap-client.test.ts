import { expect } from 'chai';
import {
  findCoinSummaryFromCmc,
  findContract,
  findMarketCapSummary,
} from '../../../src/process/coinmarketcap/coinmarketcap-client';

describe('coinmarketcapClient', function () {
  it('Fetch ethereum', async function () {
    const contract = await findContract({ coinOfficialName: 'ethereum' });
    expect(contract).to.be.equal('0x2170ed0880ac9a755fd29b2688956bd959f933f8');
  });

  it('Fetch binance-coin', async function () {
    const contract = await findContract({ coinOfficialName: 'binance-coin' });
    expect(contract).to.be.equal('0xB8c77482e45F1F44dE1745F52C74426C631bDD52');
  });

  it('Fetch invalid contract', async function () {
    const contract = await findContract({ coinOfficialName: 'dsfdsgsd33' });
    expect(contract).to.be.null;
  });

  it('Fetch market cap summary', async function () {
    const {
      mcap,
      volume24H,
      btcDominance,
      ethDominance,
    } = await findMarketCapSummary();
    expect(mcap).match(new RegExp(/^[zA-Z0-9$,\\?]*$/)).to.be.not.null;
    expect(volume24H).match(new RegExp(/^[zA-Z0-9$,\\?]*$/)).to.be.not.null;
    expect(btcDominance).not.to.be.null;
    expect(ethDominance).not.to.be.null;
  });

  it('Fetch coin summary from cmc', async function () {
    expect(
      (
        await findCoinSummaryFromCmc({
          coinOfficialName: 'bitcoin',
        })
      ).length,
    ).to.equal(7);
  });

  it('Fetch invalid coin summary from cmc', async function () {
    return expect(
      await findCoinSummaryFromCmc({
        coinOfficialName: 'invalidcoin573',
      }).catch((error) => error),
    ).and.be.an.instanceOf(Error);
  });
});
