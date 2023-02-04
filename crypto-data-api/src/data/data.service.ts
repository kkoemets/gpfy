import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import {
    findCoinSummaryFromCmc as _findCoinSummaryFromCmc,
    findGreedIndex as _findGreedIndex,
    findMarketCapSummary as _findMarketCapSummary,
    findTrendingCoins as _findTrendingCoins,
} from 'crypto-data/lib/src/index';
import {
    createMarketCapSummaryTemplate,
    createSummaryTemplateFromCmcSummary,
    createTrendingCoinsSummary,
} from '../common/summary';

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
