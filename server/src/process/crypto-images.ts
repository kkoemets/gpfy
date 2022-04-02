import { InversifyContainer } from '../injection/inversify-container';
import { BlockChainCenterApi } from './api/blockchaincenter/block-chain-center-api';
import { INVERSIFY_TYPES } from '../injection/inversify-types';
import { LookIntoBitcoinApi } from './api/lookintobitcoin/look-into-bitcoin-api';

export interface RainbowChart {
  base64Img: string;
  originUrl: string;
}

export const findRainbowChart: () => Promise<RainbowChart> = async () => {
  return InversifyContainer.get<BlockChainCenterApi>(
    INVERSIFY_TYPES.BlockChainCenterApi,
  ).findRainbowGraph();
};

export interface Btc2YearMovingAverage {
  base64Img: string;
  originUrl: string;
}

export const findBtc2YearMovingAverage: () => Promise<Btc2YearMovingAverage> =
  async () => {
    return InversifyContainer.get<LookIntoBitcoinApi>(
      INVERSIFY_TYPES.LookIntoBitcoinApi,
    ).findBtc2YearMovingAverageGraph();
  };
