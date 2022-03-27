import { Container } from 'inversify';
import { CoinmarketcapController } from '../rest/coinmarketcap-controller';
import { INVERSIFY_TYPES } from './inversify-types';
import * as express from 'express';
import { RestController } from '../rest/rest-controller';
import { ContractController } from '../rest/contract-controller';
import { LookIntoBitcoinController } from '../rest/look-into-bitcoin-controller';
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

export class InversifyConfig {
  private readonly _container: Container;

  constructor() {
    this._container = new Container();

    this._container
      .bind<express.Application>(INVERSIFY_TYPES.ExpressApplication)
      .toConstantValue(express());

    this._container
      .bind<RestController>(INVERSIFY_TYPES.RestController)
      .to(CoinmarketcapController)
      .inSingletonScope();

    this._container
      .bind<RestController>(INVERSIFY_TYPES.RestController)
      .to(ContractController)
      .inSingletonScope();

    this._container
      .bind<RestController>(INVERSIFY_TYPES.RestController)
      .to(LookIntoBitcoinController)
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
  }

  get container(): Container {
    return this._container;
  }
}
