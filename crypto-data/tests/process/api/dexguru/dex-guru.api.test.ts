import { expect } from 'chai';
import { DexContractSummary } from '../../../../src/process/api/dexguru/dex-contract-summary';
import { InversifyContainer } from '../../../../src/injection/inversify.container';
import { DexGuruApi } from '../../../../src/process/api/dexguru/dex-guru.api';
import { INVERSIFY_TYPES } from '../../../../src/injection/inversify.types';

const api: DexGuruApi = InversifyContainer.get<DexGuruApi>(INVERSIFY_TYPES.DexGuruApi);

describe('dexGuruClient', function () {
    it('Fetch contract summary - cumrocket', async function () {
        const contract = '0x27ae27110350b98d564b9a3eed31baebc82d878d';
        const contractSummary: DexContractSummary = await api.findContractSummary({
            contract,
        });

        expect(contractSummary.symbol).to.equal('CUMMIES');
        expect(contractSummary.name).to.equal('CumRocket');
    });

    it('Fetch contract summary - binance coin', async function () {
        const contract = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c';
        const contractSummary: DexContractSummary = await api.findContractSummary({
            contract,
        });

        expect(contractSummary.symbol).to.contains('BNB');
        expect(contractSummary.name).to.contains('BNB');
    });
});
