import { expect } from 'chai';
import { findGreedIndex } from '../../src/process/crypto-data';

describe('findGreedIndex', function () {
  it('Fetch', async function () {
    const greedIndexPromise = await findGreedIndex();

    expect(greedIndexPromise.time_until_update).to.be.not.null;
  });
});
