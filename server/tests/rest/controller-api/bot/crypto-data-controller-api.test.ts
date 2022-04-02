import { expect, use as chaiUse } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { findContractSummaryByNameApi } from '../../../../src/rest/controller-api/bot/crypto-data-controller-api';

chaiUse(chaiAsPromised);

describe('cryptoDataControllerApi', function () {
  it('Test promise', function () {
    return expect(findContractSummaryByNameApi('fdf3r3w'))
      .to.eventually.be.rejectedWith('Could not find contract')
      .and.be.an.instanceOf(Error);
  });

  it('Find BNB', async function () {
    return expect(await findContractSummaryByNameApi('bnb')).to.include('BNB');
  });

  it('Find BTC', async function () {
    return expect(await findContractSummaryByNameApi('bitcoin')).to.include(
      'Bitcoin',
    );
  });
});
