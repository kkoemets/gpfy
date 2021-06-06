import { findContractSummaryByNameApi } from '../../../../src/api/bot/contract/find-contract-summary-by-name-api';
import { expect, use as chaiUse } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';

chaiUse(chaiAsPromised);

describe('findContractSummaryByNameApi', function () {
  it('connect: test promise', function () {
    return expect(findContractSummaryByNameApi('fdf3r3w'))
      .to.eventually.be.rejectedWith('Could not find contract')
      .and.be.an.instanceOf(Error);
  });
});
