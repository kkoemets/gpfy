import { Controller, Get, Query } from '@nestjs/common';
import { DataService } from './data.service';
import { createSummaryTemplate, createSummaryTemplateFromCmcSummary } from './contract-summary';
import { findSummary, findSummaryByName } from 'crypto-data';
import { ContractSummary } from 'crypto-data/lib/src/process/crypto-data';
import { COULD_NOT_FIND_CONTRACT } from 'crypto-data/lib/src/process/errors';
import { INVERSIFY_TYPES } from 'crypto-data/lib/src/injection/inversify.types';
import { CoinmarketcapApi } from 'crypto-data/lib/src/process/api/coinmarketcap/coinmarketcap.api';
import { InversifyContainer } from 'crypto-data/lib/src/injection/inversify.container';

@Controller()
export class DataController {
    constructor(private ds: DataService) {}

    @Get('/bot/images/2YearMovingAvg')
    async findBtc2YearMovingAverage() {
        return await this.ds.findBtc2YearMovingAverage();
    }

    @Get('/bot/images/rainbow')
    async findRainbowChart() {
        return await this.ds.findRainbowChart();
    }

    @Get('/coinmarketcap/mcap-summary')
    findMarketCapSummary() {
        return 'findMarketCapSummary';
    }

    @Get('/bot/contract/summary')
    async findContractSummary(@Query() query) {
        const contract = query.contract?.toString().trim();
        const coinFullName = query.coinFullName?.toString().trim();
        return await (contract
            ? this.findContractSummaryApi(contract)
            : this.findContractSummaryByNameApi(coinFullName));
    }

    @Get('/coinmarketcap/trending')
    async findTrendingCoins() {
        return await this.ds.findTrendingCoins();
    }

    private findContractSummaryApi = async (contract: string): Promise<string> => {
        return createSummaryTemplate(await findSummary(contract));
    };

    private findContractSummaryByNameApi = async (coinOfficialNameInput: string): Promise<string> => {
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
}
