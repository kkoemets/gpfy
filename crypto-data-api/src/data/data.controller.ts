import { Controller, Get, Query } from '@nestjs/common';
import { DataService } from './data.service';

@Controller()
export class DataController {
    constructor(private ds: DataService) {}

    @Get('/coinmarketcap/mcap-summary')
    findMarketCapSummary(): Promise<{ cmcSummary: string }> {
        return this.ds.findMarketCapSummary();
    }

    @Get('/bot/contract/summary')
    async findContractSummary(@Query() query): Promise<{ summaryText: string }> {
        const { coinFullName } = query;
        return await this.ds.findContractSummaryByNameApi(coinFullName);
    }

    @Get('/coinmarketcap/trending')
    async findTrendingCoins(): Promise<{ trendingSummary: string }> {
        return await this.ds.findTrendingCoins();
    }
}
