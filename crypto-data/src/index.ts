import {
    Btc2YearMovingAverage,
    findBtc2YearMovingAverage as _findBtc2YearMovingAverage,
    findRainbowChart as _findRainbowChart,
    RainbowChart,
} from './process/crypto-images';
import {
    ContractSummary,
    findGreedIndex as _findGreedIndex,
    findSummary as _findSummary,
    findSummaryByName as _findSummaryByName,
    GreedIndex,
} from './process/crypto-data';
import { InversifyContainer } from './injection/inversify.container';
import { Container } from 'inversify';
import { INVERSIFY_TYPES } from './injection/inversify.types';

export const findBtc2YearMovingAverage: () => Promise<Btc2YearMovingAverage> = () => _findBtc2YearMovingAverage();
export const findRainbowChart: () => Promise<RainbowChart> = () => _findRainbowChart();
export const findGreedIndex: () => Promise<GreedIndex> = () => _findGreedIndex();
export const findSummary: (contract: string) => Promise<ContractSummary> = (contract: string) => _findSummary(contract);
export const findSummaryByName: (coinOfficialName: string) => Promise<ContractSummary> = (coinOfficialName: string) =>
    _findSummaryByName(coinOfficialName);
export const container: Container = InversifyContainer;
export const containerTypes: {
    BlockChainCenterApi: symbol;
    CoingeckoApi: symbol;
    CoinmarketcapApi: symbol;
    RestController: symbol;
    BscscanApi: symbol;
    DexGuruApi: symbol;
    LookIntoBitcoinApi: symbol;
    ExpressApplication: symbol;
} = INVERSIFY_TYPES;
