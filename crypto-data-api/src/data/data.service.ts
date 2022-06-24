import { Injectable } from '@nestjs/common';
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
import { COULD_NOT_FIND_CONTRACT, COULD_NOT_FIND_MARKETCAP } from 'crypto-data/lib/src/process/errors';
import {
    createMarketCapSummaryTemplate,
    createSummaryTemplate,
    createSummaryTemplateFromCmcSummary,
} from './contract-summary';

@Injectable()
export class DataService {
    async findRainbowChart(): Promise<{ originUrl: string; base64Img: string }> {
        const { originUrl, base64Img } = await _findRainbowChart();
        return { originUrl, base64Img };
    }

    async findBtc2YearMovingAverage(): Promise<{ originUrl: string; base64Img: string }> {
        const { originUrl, base64Img }: Btc2YearMovingAverage = await _findBtc2YearMovingAverage();
        return { originUrl, base64Img };
    }

    findContractSummaryApi = async (contract: string): Promise<string> => {
        return createSummaryTemplate(await findSummary(contract));
    };

    findContractSummaryByNameApi = async (coinOfficialNameInput: string): Promise<string> => {
        const coinmarketcapApi: CoinmarketcapApi = InversifyContainer.get<CoinmarketcapApi>(
            INVERSIFY_TYPES.CoinmarketcapApi,
        );

        const coinOfficialName = coinOfficialNameInput?.trim()?.toLowerCase();
        if (!coinOfficialName) {
            return COULD_NOT_FIND_CONTRACT();
        }

        const contractSummary: ContractSummary = await findSummaryByName(coinOfficialName).catch((error) => error);

        if (contractSummary instanceof Error) {
            return createSummaryTemplateFromCmcSummary(
                await coinmarketcapApi.findCoinSummaryFromCmc({ coinOfficialName }),
            );
        }

        return createSummaryTemplate(contractSummary);
    };

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
            return COULD_NOT_FIND_MARKETCAP();
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
}
