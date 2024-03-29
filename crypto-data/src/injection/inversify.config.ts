import { Container } from 'inversify';
import 'reflect-metadata';
import { INVERSIFY_TYPES } from './inversify.types';
import { CoinmarketcapApi } from '../process/api/coinmarketcap/coinmarketcap.api';
import { CoinmarketcapRestClient } from '../process/api/coinmarketcap/coinmarketcap.rest.client';
import { LookIntoBitcoinRestClient } from '../process/api/lookintobitcoin/look-into-bitcoin.rest.client';
import { LookIntoBitcoinApi } from '../process/api/lookintobitcoin/look-into-bitcoin.api';
import { BlockChainCenterRestClient } from '../process/api/blockchaincenter/block-chain-center.rest.client';
import { BlockChainCenterApi } from '../process/api/blockchaincenter/block-chain-center.api';

export class InversifyConfig {
    private readonly _container: Container;

    constructor() {
        this._container = new Container({ skipBaseClassChecks: true });

        this._container
            .bind<CoinmarketcapApi>(INVERSIFY_TYPES.CoinmarketcapApi)
            .to(CoinmarketcapRestClient)
            .inSingletonScope();

        this._container
            .bind<LookIntoBitcoinApi>(INVERSIFY_TYPES.LookIntoBitcoinApi)
            .to(LookIntoBitcoinRestClient)
            .inSingletonScope();

        this._container
            .bind<BlockChainCenterApi>(INVERSIFY_TYPES.BlockChainCenterApi)
            .to(BlockChainCenterRestClient)
            .inSingletonScope();
    }

    get container(): Container {
        return this._container;
    }
}
