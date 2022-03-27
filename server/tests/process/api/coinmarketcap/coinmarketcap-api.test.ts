import { expect } from 'chai';
import { InversifyContainer } from '../../../../src/injection/inversify-container';
import { CoinmarketcapApi } from '../../../../src/process/api/coinmarketcap/coinmarketcap-api';
import { INVERSIFY_TYPES } from '../../../../src/injection/inversify-types';

const api: CoinmarketcapApi = InversifyContainer.get<CoinmarketcapApi>(
  INVERSIFY_TYPES.CoinmarketcapApi,
);

describe('coinmarketcapClient', function () {
  it('Fetch ethereum', async function () {
    const contract = await api.findContract({
      coinOfficialName: 'ethereum',
    });
    expect(contract).to.be.equal('0x2170ed0880ac9a755fd29b2688956bd959f933f8');
  });

  it('Fetch bnb', async function () {
    const contract = await api.findContract({
      coinOfficialName: 'bnb',
    });
    expect(contract).to.be.equal('0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c');
  });

  it('Fetch invalid contract', async function () {
    const contract = await api.findContract({
      coinOfficialName: 'dsfdsgsd33',
    });
    expect(contract).to.be.null;
  });

  it('Fetch market cap summary', async function () {
    const {
      mcap,
      volume24H,
      btcDominance,
      ethDominance,
    } = await api.findMarketCapSummary();
    expect(mcap).match(new RegExp(/^[zA-Z0-9$,\\?]*$/)).to.be.not.null;
    expect(volume24H).match(new RegExp(/^[zA-Z0-9$,\\?]*$/)).to.be.not.null;
    expect(btcDominance).not.to.be.null;
    expect(ethDominance).not.to.be.null;
  });

  it('Fetch coin summary from cmc', async function () {
    expect(
      (
        await api.findCoinSummaryFromCmc({
          coinOfficialName: 'bitcoin',
        })
      ).length,
    ).to.equal(7);
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
});
