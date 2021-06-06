import { expect } from 'chai';

import { findContract } from '../../../src/process/coingecko/coingecko-client';

describe('coinGeckoClient', function () {
  it('Fetch contract', async function () {
    const contract = await findContract({ coinOfficialName: 'algopainter' });
    expect(contract).to.be.equal('0xbee554dbbc677eb9fb711f5e939a2f2302598c75');
  });
});
