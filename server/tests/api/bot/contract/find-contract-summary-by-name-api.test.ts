import { findContractSummaryByNameApi } from '../../../../src/api/bot/contract/find-contract-summary-by-name-api';
import { expect, use as chaiUse } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';

chaiUse(chaiAsPromised);

describe('findContractSummaryByNameApi', function () {
  it('Test promise', function () {
    return expect(findContractSummaryByNameApi('fdf3r3w'))
      .to.eventually.be.rejectedWith('Could not find contract')
      .and.be.an.instanceOf(Error);
  });

  it('Find BNB', async function () {
    return expect(
      await findContractSummaryByNameApi('binance-coin'),
    ).to.include('BNB');
  });

  it('Find BTC', async function () {
    return expect(await findContractSummaryByNameApi('bitcoin')).to.include(
      'BNB',
    );
  });
});
