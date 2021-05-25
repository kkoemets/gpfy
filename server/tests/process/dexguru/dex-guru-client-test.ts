import { fetchCoinsSummary } from '../../../src/process/dexguru/dex-guru-client';

describe('dexGuruClient', function () {
  it('Fetch coin summar', function () {
    const coinName = 'cummies';
    fetchCoinsSummary({ coinName });
  });
});
