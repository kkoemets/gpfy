import fetch from 'node-fetch';
import { createLogger } from '../util/log';
import { InversifyContainer } from '../injection/inversify.container';
import { CoinmarketcapApi, MarketCapSummary, TrendingCoinData } from './api/coinmarketcap/coinmarketcap.api';
import { INVERSIFY_TYPES } from '../injection/inversify.types';

const log = createLogger();

export interface GreedIndex {
    value: string;
    value_classification: string;
    timestamp: string;
    time_until_update: string;
}

export const findGreedIndex = async (): Promise<GreedIndex> => {
    log.info('Finding greed index');
    const data = (await (
        await fetch(`https://api.alternative.me/fng`, {
            headers: { 'User-Agent': 'Mozilla/5.0' },
        })
    ).json()) as { data: object[] };

    return { ...(data.data[0] as GreedIndex) };
};

export const findTrendingCoins: () => Promise<TrendingCoinData[]> = async () => {
    return InversifyContainer.get<CoinmarketcapApi>(INVERSIFY_TYPES.CoinmarketcapApi).findTrendingCoins();
};

export const findMarketCapSummary: () => Promise<MarketCapSummary> = async () => {
    return InversifyContainer.get<CoinmarketcapApi>(INVERSIFY_TYPES.CoinmarketcapApi).findMarketCapSummary();
};

export const findCoinSummaryFromCmc: ({
    coinOfficialName,
}: {
    coinOfficialName: string;
}) => Promise<{ valueText: string; value: string }[]> = ({ coinOfficialName }: { coinOfficialName: string }) => {
    return InversifyContainer.get<CoinmarketcapApi>(INVERSIFY_TYPES.CoinmarketcapApi).findCoinSummaryFromCmc({
        coinOfficialName,
    });
};
