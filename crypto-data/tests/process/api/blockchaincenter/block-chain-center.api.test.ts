import { InversifyContainer } from '../../../../src/injection/inversify.container';
import { INVERSIFY_TYPES } from '../../../../src/injection/inversify.types';
import { expect } from 'chai';
import { BlockChainCenterApi } from '../../../../src/process/api/blockchaincenter/block-chain-center.api';

const api: BlockChainCenterApi = InversifyContainer.get<BlockChainCenterApi>(INVERSIFY_TYPES.BlockChainCenterApi);

describe('BlockChainCenterApi', function () {
    it('Find rainbow chart', async function () {
        const { base64Img, originUrl } = await api.findRainbowGraph();

        expect(base64Img).to.be.not.null;
        expect(originUrl).to.be.not.null;
    });
});
