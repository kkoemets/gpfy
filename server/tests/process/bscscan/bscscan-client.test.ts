import { expect } from 'chai';
import { findHolders } from '../../../src/process/bscscan/bscscan-client';

describe('BscscanClient', function () {
  it('Fetch contract holders', async function () {
    const { holdersAmount } = await findHolders({
      bscContract: '0x27ae27110350b98d564b9a3eed31baebc82d878d',
    });

    expect(Number(holdersAmount)).to.not.be.NaN;
  });
});
