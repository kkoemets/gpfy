import {
    Btc2YearMovingAverage,
    findBtc2YearMovingAverage as _findBtc2YearMovingAverage,
    findRainbowChart as _findRainbowChart,
    RainbowChart,
} from './process/crypto-images';
import {
    findCoinSummaryFromCmc as _findCoinSummaryFromCmc,
    findGreedIndex as _findGreedIndex,
    findMarketCapSummary as _findMarketCapSummary,
    findTrendingCoins as _findTrendingCoins,
    GreedIndex,
} from './process/crypto-data';
import { InversifyContainer } from './injection/inversify.container';
import { Container } from 'inversify';
import { INVERSIFY_TYPES } from './injection/inversify.types';
import { CoinSummary, MarketCapSummary, TrendingCoinData } from './process/api/coinmarketcap/coinmarketcap.api';

export const container: Container = InversifyContainer;
export const containerTypes: {
    BlockChainCenterApi: symbol;
    CoinmarketcapApi: symbol;
    RestController: symbol;
    LookIntoBitcoinApi: symbol;
    ExpressApplication: symbol;
} = INVERSIFY_TYPES;

export const findBtc2YearMovingAverage: () => Promise<Btc2YearMovingAverage> = async () => _findBtc2YearMovingAverage();
export const findRainbowChart: () => Promise<RainbowChart> = async () => _findRainbowChart();
export const findGreedIndex: () => Promise<GreedIndex> = async () => _findGreedIndex();
export const findTrendingCoins: () => Promise<TrendingCoinData[]> = async () => _findTrendingCoins();
export const findMarketCapSummary: () => Promise<MarketCapSummary> = async () => _findMarketCapSummary();
export const findCoinSummaryFromCmc: ({
    coinOfficialName,
}: {
    coinOfficialName: string;
}) => Promise<CoinSummary> = async ({ coinOfficialName }) => _findCoinSummaryFromCmc({ coinOfficialName });
