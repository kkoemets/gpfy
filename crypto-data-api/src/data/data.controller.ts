import { Controller, Get, Query } from '@nestjs/common';
import { DataService } from './data.service';

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
            ? this.ds.findContractSummaryApi(contract)
            : this.ds.findContractSummaryByNameApi(coinFullName));
    }

    @Get('/coinmarketcap/trending')
    async findTrendingCoins() {
        return await this.ds.findTrendingCoins();
    }
}
