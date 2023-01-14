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

export type CoinPrice = {
    coinFullName: string;
    fullUnitPrice: string;
    amount: string;
    amountPrice: string;
    currency: string;
};

export type CoinsPrices = {
    prices: CoinPrice[];
    totalValue: { amount: string; currency: string; btc: string };
    btcPrice: CoinPrice;
};

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

export const findCoinsPricesInUsd: ({
    data,
}: {
    data: { coinOfficialName: string; amount: number }[];
}) => Promise<CoinsPrices> = async ({
    data,
}: {
    data: {
        coinOfficialName: string;
        amount: number;
    }[];
}): Promise<CoinsPrices> => {
    const btcPrice: CoinPrice = await findCoinPriceInUsd('bitcoin', 1);

    const prices: CoinPrice[] = await Promise.all(
        data.map(({ coinOfficialName, amount }) => findCoinPriceInUsd(coinOfficialName, amount)),
    );

    const totalValueInFiat: { amount: string; currency: string } = {
        amount: prices
            .map(({ amountPrice }) => amountPrice)
            .map(Number)
            .reduce((a, b) => a + b)
            .toString(),
        currency: prices.find((e) => e)?.currency || 'USD',
    };

    return {
        prices,
        totalValue: {
            ...totalValueInFiat,
            btc: Number((Number(totalValueInFiat.amount) / Number(btcPrice.fullUnitPrice)).toFixed(8)).toString(),
        },
        btcPrice: btcPrice,
    };
};

export const findCoinPriceInUsd = async (coinOfficialName: string, amount: number): Promise<CoinPrice> => {
    const fullUnitPrice: string =
        (await findCoinSummaryFromCmc({ coinOfficialName }))
            .find(({ valueText }) => valueText)
            ?.value.replace(new RegExp(/[$,]/g), '') || '';

    return {
        coinFullName: coinOfficialName,
        fullUnitPrice,
        amountPrice: (amount * Number(fullUnitPrice)).toString(),
        currency: 'USD',
        amount: amount.toString(),
    } as CoinPrice;
};
