import { expect } from 'chai';
import { InversifyContainer } from '../../../../src/injection/inversify-container';
import { INVERSIFY_TYPES } from '../../../../src/injection/inversify-types';
import { BscscanApi } from '../../../../src/process/api/bscscan/bscscan-api';

describe('BscscanClient', function () {
  it('Fetch contract holders', async function () {
    const { holdersAmount } = await InversifyContainer.get<BscscanApi>(
      INVERSIFY_TYPES.BscscanApi,
    ).findHolders({
      bscContract: '0x27ae27110350b98d564b9a3eed31baebc82d878d',
    });

    expect(Number(holdersAmount)).to.not.be.NaN;
  });
});
