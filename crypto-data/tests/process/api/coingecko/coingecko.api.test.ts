import { expect } from 'chai';
import { InversifyContainer } from '../../../../src/injection/inversify.container';
import { INVERSIFY_TYPES } from '../../../../src/injection/inversify.types';
import { CoingeckoApi } from '../../../../src/process/api/coingecko/coingecko.api';

describe('coinGeckoClient', function () {
    it('Fetch contract', async function () {
        const contract = await InversifyContainer.get<CoingeckoApi>(INVERSIFY_TYPES.CoingeckoApi).findContract({
            coinOfficialName: 'algopainter',
        });
        expect(contract).to.be.equal('0xbee554dbbc677eb9fb711f5e939a2f2302598c75');
    });
});
