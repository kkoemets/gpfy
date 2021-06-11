import { expect } from 'chai';
import {
  findContract,
  findMarketCapSummary,
} from '../../../src/process/coinmarketcap/coinmarketcap-client';

describe('coinmarketcapClient', function () {
  it('Fetch contract', async function () {
    const contract = await findContract({ coinOfficialName: 'ethereum' });
    expect(contract).to.be.equal('0x2170ed0880ac9a755fd29b2688956bd959f933f8');
  });

  it('Fetch invalid contract', async function () {
    const contract = await findContract({ coinOfficialName: 'dsfdsgsd33' });
    expect(contract).to.be.null;
  });

  it('Fetch market cap summary', async function () {
    expect((await findMarketCapSummary()).mcap).match(
      new RegExp(/^[zA-Z0-9$,\\?]*$/),
    ).to.be.not.null;
  });
});
