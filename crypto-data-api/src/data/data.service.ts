import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import {
    findBtc2YearMovingAverage as _findBtc2YearMovingAverage,
    findCoinsPricesInUsd as _findCoinsPricesInUsd,
    findCoinSummaryFromCmc as _findCoinSummaryFromCmc,
    findGreedIndex as _findGreedIndex,
    findMarketCapSummary as _findMarketCapSummary,
    findRainbowChart as _findRainbowChart,
    findTrendingCoins as _findTrendingCoins,
} from 'crypto-data/lib/src/index';
import {
    createBagSummaryTemplate,
    createMarketCapSummaryTemplate,
    createSummaryTemplateFromCmcSummary,
    createTrendingCoinsSummary,
} from './summary';
import { Btc2YearMovingAverage } from 'crypto-data/lib/src/process/crypto-images';

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

@Injectable()
export class DataService {
    constructor(@Inject(CACHE_MANAGER) private cacheManager) {}

    async findRainbowChart(): Promise<{ originUrl: string; base64Img: string }> {
        const { originUrl, base64Img } = await _findRainbowChart();
        return { originUrl, base64Img };
    }

    async findBtc2YearMovingAverage(): Promise<{ originUrl: string; base64Img: string }> {
        const { originUrl, base64Img }: Btc2YearMovingAverage = await _findBtc2YearMovingAverage();
        return { originUrl, base64Img };
    }

    async findTrendingCoins(): Promise<{ trendingSummary: string }> {
        return {
            trendingSummary: createTrendingCoinsSummary((await _findTrendingCoins()).slice(0, 10)),
        };
    }

    findMarketCapSummary = async (): Promise<{
        cmcSummary: string;
    }> => {
        const { mcap, volume24H, btcDominance, ethDominance } = await _findMarketCapSummary();
        if (!mcap) {
            return Promise.reject('Failed to mcap findCoinSummaryFromCmc summary');
        }

        const { value: fearIndex, value_classification: fearClass } = await _findGreedIndex();

        return {
            cmcSummary: createMarketCapSummaryTemplate({
                mcap,
                volume24H,
                btcDominance,
                ethDominance,
                fearIndex,
                fearClass,
            }),
        };
    };

    findContractSummaryByNameApi = async (coinOfficialNameInput: string): Promise<{ summaryText: string }> => {
        return {
            summaryText: createSummaryTemplateFromCmcSummary(await this.findCoinSummaryFromCmc(coinOfficialNameInput)),
        };
    };

    findBagSummary = async (
        data: {
            coinOfficialName: string;
            amount: number;
        }[],
    ): Promise<{ bagSummary: string }> => {
        return { bagSummary: createBagSummaryTemplate(await _findCoinsPricesInUsd({ data })) };
    };

    private async findCoinSummaryFromCmc(coinOfficialName: string): Promise<{ valueText: string; value: string }[]> {
        const cachedValue = await this.cacheManager.get(coinOfficialName);
        if (cachedValue) {
            return cachedValue;
        }

        const foundSummary: { valueText: string; value: string }[] = await _findCoinSummaryFromCmc({
            coinOfficialName,
        });
        this.cacheManager.set(coinOfficialName, foundSummary, 5 * 60);
        return foundSummary;
    }
}
