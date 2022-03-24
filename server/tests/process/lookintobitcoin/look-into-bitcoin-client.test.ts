import { expect } from 'chai';

import { findBtc2YearMovingAverageGraph } from '../../../src/process/lookintobitcoin/look-into-bitcoin-client';

describe('find2YearMovingAverageGraph', function () {
  it('Find', async function () {
    const { base64Img, originUrl } = await findBtc2YearMovingAverageGraph();

    expect(base64Img).to.be.not.null;
    expect(originUrl).to.be.not.null;
  });
});
