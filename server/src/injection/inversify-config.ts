import { Container } from 'inversify';
import { INVERSIFY_TYPES } from './inversify-types';
import * as express from 'express';
import { RestController } from '../rest/rest-controller';
import { ImageController } from '../rest/image-controller';
import { MonitoringController } from '../rest/monitoring-controller';
import { CoinmarketcapApi } from '../process/api/coinmarketcap/coinmarketcap-api';
import { CoinmarketcapRestClient } from '../process/api/coinmarketcap/coinmarketcap-rest-client';
import { CoingeckoApi } from '../process/api/coingecko/coingecko-api';
import { CoingeckoRestClient } from '../process/api/coingecko/coingecko-rest-client';
import { DexGuruApi } from '../process/api/dexguru/dex-guru-api';
import DexGuruRestClient from '../process/api/dexguru/dex-guru-rest-client';
import { BscscanApi } from '../process/api/bscscan/bscscan-api';
import { BscscanRestClient } from '../process/api/bscscan/bscscan-rest-client';
import { LookIntoBitcoinRestClient } from '../process/api/lookintobitcoin/look-into-bitcoin-rest-client';
import { LookIntoBitcoinApi } from '../process/api/lookintobitcoin/look-into-bitcoin-api';
import { BlockChainCenterRestClient } from '../process/api/blockchaincenter/block-chain-center-rest-client';
import { BlockChainCenterApi } from '../process/api/blockchaincenter/block-chain-center-api';
import { CryptoDataController } from '../rest/crypto-data-controller';

export class InversifyConfig {
  private readonly _container: Container;

  constructor() {
    this._container = new Container({ skipBaseClassChecks: true });

    this._container
      .bind<express.Application>(INVERSIFY_TYPES.ExpressApplication)
      .toConstantValue(express());

    this._container
      .bind<RestController>(INVERSIFY_TYPES.RestController)
      .to(CryptoDataController)
      .inSingletonScope();

    this._container
      .bind<RestController>(INVERSIFY_TYPES.RestController)
      .to(ImageController)
      .inSingletonScope();

    this._container
      .bind<RestController>(INVERSIFY_TYPES.RestController)
      .to(MonitoringController)
      .inSingletonScope();

    this._container
      .bind<CoinmarketcapApi>(INVERSIFY_TYPES.CoinmarketcapApi)
      .to(CoinmarketcapRestClient)
      .inSingletonScope();

    this._container
      .bind<CoingeckoApi>(INVERSIFY_TYPES.CoingeckoApi)
      .to(CoingeckoRestClient)
      .inSingletonScope();

    this._container
      .bind<DexGuruApi>(INVERSIFY_TYPES.DexGuruApi)
      .to(DexGuruRestClient)
      .inSingletonScope();

    this._container
      .bind<BscscanApi>(INVERSIFY_TYPES.BscscanApi)
      .to(BscscanRestClient)
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
