import { InversifyContainer } from '../injection/inversify-container';
import { LookIntoBitcoinApi } from './api/lookintobitcoin/look-into-bitcoin-api';
import { INVERSIFY_TYPES } from '../injection/inversify-types';

export interface Btc2YearMovingAverage {
  base64Img: string;
  originUrl: string;
}

export const findBtc2YearMovingAverage: () => Promise<Btc2YearMovingAverage> = async () => {
  return InversifyContainer.get<LookIntoBitcoinApi>(
    INVERSIFY_TYPES.LookIntoBitcoinApi,
  ).findBtc2YearMovingAverageGraph();
};
