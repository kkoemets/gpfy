import { expect } from 'chai';
import {
  getCachedContractByName,
  setCachedContractByName,
} from '../../../src/process/cache/token.cache.manager';

describe('tokenCacheManager', function () {
  it('Null if does not exist', async function () {
    const contract = await getCachedContractByName({ coinOfficialName: 'zxc' });
    expect(contract).to.be.null;
  });

  it('Set and get', async function () {
    const coinOfficialName = 'zxxcv';
    expect(await getCachedContractByName({ coinOfficialName })).to.be.null;

    const contract = '34324';
    await setCachedContractByName({ coinOfficialName, contract });
    expect(await getCachedContractByName({ coinOfficialName })).to.be.equal(
      contract,
    );
  });
});
