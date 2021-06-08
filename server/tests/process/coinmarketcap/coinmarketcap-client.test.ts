import { expect } from 'chai';
import { findContract } from '../../../src/process/coinmarketcap/coinmarketcap-client';

describe('coinmarketcapClient', function () {
  it('Fetch contract', async function () {
    const contract = await findContract({ coinOfficialName: 'ethereum' });
    expect(contract).to.be.equal('0x2170ed0880ac9a755fd29b2688956bd959f933f8');
  });
});
