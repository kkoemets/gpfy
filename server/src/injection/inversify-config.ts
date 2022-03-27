import { Container } from 'inversify';
import { CoinmarketcapController } from '../rest/coinmarketcap-controller';
import { INVERSIFY_TYPES } from './inversify-types';
import * as express from 'express';
import { RestController } from '../rest/rest-controller';
import { ContractController } from '../rest/contract-controller';
import { LookIntoBitcoinController } from '../rest/look-into-bitcoin-controller';
import { MonitoringController } from '../rest/monitoring-controller';

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
  }

  get container(): Container {
    return this._container;
  }
}
