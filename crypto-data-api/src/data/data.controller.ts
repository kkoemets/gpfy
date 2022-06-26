import { Controller, Get, Query } from '@nestjs/common';
import { DataService } from './data.service';

@Controller()
export class DataController {
    constructor(private ds: DataService) {}

    @Get('/bot/images/2YearMovingAvg')
    async findBtc2YearMovingAverage(): Promise<{ originUrl: string; base64Img: string }> {
        return await this.ds.findBtc2YearMovingAverage();
    }

    @Get('/bot/images/rainbow')
    async findRainbowChart(): Promise<{ originUrl: string; base64Img: string }> {
        return await this.ds.findRainbowChart();
    }

    @Get('/coinmarketcap/mcap-summary')
    findMarketCapSummary(): Promise<{ cmcSummary: string }> {
        return this.ds.findMarketCapSummary();
    }

    @Get('/bot/contract/summary')
    async findContractSummary(@Query() query): Promise<{ summaryText: string }> {
        const contract = query.contract?.toString().trim();
        const coinFullName = query.coinFullName?.toString().trim();
        return await (contract
            ? this.ds.findContractSummaryApi(contract)
            : this.ds.findContractSummaryByNameApi(coinFullName));
    }

    @Get('/coinmarketcap/trending')
    async findTrendingCoins(): Promise<{ trendingSummary: string }> {
        return await this.ds.findTrendingCoins();
    }
}
