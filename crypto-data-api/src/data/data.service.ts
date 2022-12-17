import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import {
    Btc2YearMovingAverage,
    findBtc2YearMovingAverage as _findBtc2YearMovingAverage,
    findRainbowChart as _findRainbowChart,
} from 'crypto-data/lib/src/process/crypto-images';
import { InversifyContainer } from 'crypto-data/lib/src/injection/inversify.container';
import { INVERSIFY_TYPES } from 'crypto-data/lib/src/injection/inversify.types';
import { CoinmarketcapApi } from 'crypto-data/lib/src/process/api/coinmarketcap/coinmarketcap.api';
import { findGreedIndex, findSummary, findSummaryByName } from 'crypto-data';
import { ContractSummary } from 'crypto-data/lib/src/process/crypto-data';
import {
    createBagSummaryTemplate,
    createMarketCapSummaryTemplate,
    createSummaryTemplate,
    createSummaryTemplateFromCmcSummary,
} from './contract-summary';

export type CoinPrice = {
    coinFullName: string;
    fullUnitPrice: string;
    amount: string;
    amountPrice: string;
    currency: string;
};

export type CoinsPrices = {
    prices: CoinPrice[];
    totalValue: { amount: string; currency: string };
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
            trendingSummary: (
                await InversifyContainer.get<CoinmarketcapApi>(INVERSIFY_TYPES.CoinmarketcapApi).findTrendingCoins()
            )
                .slice(0, 10)
                .map(
                    ({ position, coinName, price, _24hChange, mcap }) =>
                        `#${position} ${coinName}
      💵${price}
      2️⃣4️⃣↕️${_24hChange}
      🐂${mcap} `,
                )
                .join('\n'),
        };
    }

    findMarketCapSummary = async (): Promise<{
        cmcSummary: string;
    }> => {
        const coinmarketcapApi: CoinmarketcapApi = InversifyContainer.get<CoinmarketcapApi>(
            INVERSIFY_TYPES.CoinmarketcapApi,
        );

        const { mcap, volume24H, btcDominance, ethDominance } = await coinmarketcapApi.findMarketCapSummary();
        if (!mcap) {
            return Promise.reject('Failed to mcap findCoinSummaryFromCmc summary');
        }

        const { value: fearIndex, value_classification: fearClass } = await findGreedIndex();

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

    findContractSummaryApi = async (contract: string): Promise<{ summaryText: string }> => {
        return { summaryText: createSummaryTemplate(await findSummary(contract)) };
    };

    findContractSummaryByNameApi = async (coinOfficialNameInput: string): Promise<{ summaryText: string }> => {
        const coinmarketcapApi: CoinmarketcapApi = InversifyContainer.get<CoinmarketcapApi>(
            INVERSIFY_TYPES.CoinmarketcapApi,
        );

        const coinOfficialName = coinOfficialNameInput?.trim()?.toLowerCase();
        if (!coinOfficialName) {
            return Promise.reject('Failed to findCoinSummaryFromCmc contract summary');
        }

        const contractSummary: ContractSummary = await findSummaryByName(coinOfficialName).catch((error) => error);

        return {
            summaryText:
                contractSummary instanceof Error
                    ? createSummaryTemplateFromCmcSummary(await this.findCoinSummaryFromCmc(coinOfficialName))
                    : createSummaryTemplate(contractSummary),
        };
    };

    findCoinPriceInUsd = async (coinOfficialName: string, amount: number): Promise<CoinPrice> => {
        const fullUnitPrice: string =
            (await this.findCoinSummaryFromCmc(coinOfficialName))
                .find(({ valueText }) => valueText)
                ?.value.replace(new RegExp(/[$,]/g), '') || '';
        return {
            coinFullName: coinOfficialName,
            fullUnitPrice,
            amountPrice: this.formatAmount((amount * Number(fullUnitPrice)).toString()),
            currency: 'USD',
            amount: amount.toString(),
        } as CoinPrice;
    };

    findBagSummary = async (
        data: {
            coinOfficialName: string;
            amount: number;
        }[],
    ): Promise<{ bagSummary: string }> => {
        return { bagSummary: createBagSummaryTemplate(await this.findCoinsPricesInUsd(data)) };
    };

    findCoinsPricesInUsd = async (
        data: {
            coinOfficialName: string;
            amount: number;
        }[],
    ): Promise<CoinsPrices> => {
        const prices: CoinPrice[] = await Promise.all(
            data.map(({ coinOfficialName, amount }) => this.findCoinPriceInUsd(coinOfficialName, amount)),
        );
        return {
            prices,
            totalValue: {
                amount: this.formatAmount(
                    prices
                        .map(({ amountPrice }) => amountPrice)
                        .map(Number)
                        .reduce((a, b) => a + b)
                        .toString(),
                ),
                currency: prices.find((e) => e).currency,
            },
        };
    };

    private async findCoinSummaryFromCmc(coinOfficialName: string): Promise<{ valueText: string; value: string }[]> {
        const coinmarketcapApi: CoinmarketcapApi = InversifyContainer.get<CoinmarketcapApi>(
            INVERSIFY_TYPES.CoinmarketcapApi,
        );

        const cachedValue = await this.cacheManager.get(coinOfficialName);
        if (cachedValue) {
            return cachedValue;
        }

        const foundSummary: { valueText: string; value: string }[] = await coinmarketcapApi.findCoinSummaryFromCmc({
            coinOfficialName,
        });
        this.cacheManager.set(coinOfficialName, foundSummary, 5 * 60);
        return foundSummary;
    }

    private formatAmount = (string) => {
        return string.match(new RegExp('^(\\d+.\\d{2})\\d*$'))[1];
    };
}
