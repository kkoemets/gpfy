import { expect } from 'chai';
import { InversifyContainer } from '../../../../src/injection/inversify.container';
import { LookIntoBitcoinApi } from '../../../../src/process/api/lookintobitcoin/look-into-bitcoin.api';
import { INVERSIFY_TYPES } from '../../../../src/injection/inversify.types';

const api: LookIntoBitcoinApi = InversifyContainer.get<LookIntoBitcoinApi>(INVERSIFY_TYPES.LookIntoBitcoinApi);

describe('LookIntoBitcoinApi', function () {
    it('Find', async function () {
        const { base64Img, originUrl } = await api.findBtc2YearMovingAverageGraph();

        expect(base64Img).to.be.not.null;
        expect(originUrl).to.be.not.null;
    });
});
