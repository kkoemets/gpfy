import { findContractSummary } from '../../../src/process/dexguru/dex-guru-client';
import { expect } from 'chai';
import { DexContractSummary } from '../../../src/process/dexguru/dex-contract-summary';

describe('dexGuruClient', function () {
  it('Fetch contract summary', async function () {
    const contract = '0x27ae27110350b98d564b9a3eed31baebc82d878d';
    const contractSummary: DexContractSummary = await findContractSummary({
      contract,
    });

    expect(contractSummary.symbol).to.equal('CUMMIES');
    expect(contractSummary.name).to.equal('CumRocket');
  });
});
