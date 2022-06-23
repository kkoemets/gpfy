import { Controller, Get } from '@nestjs/common';

@Controller()
export class DataController {
    @Get('/bot/images/2YearMovingAvg')
    findBtc2YearMovingAverage() {
        return 'findBtc2YearMovingAverage';
    }

    @Get('/bot/images/rainbow')
    findRainbowChart() {
        return 'findRainbowChart';
    }

    @Get('/coinmarketcap/mcap-summary')
    findMarketCapSummary() {
        return 'findMarketCapSummary';
    }

    @Get('/bot/contract/summary')
    findContractSummary() {
        return (
            'contract\n' +
            '  //                 ? await findContractSummaryApi(contract)\n' +
            "  //                 : await findContractSummaryByNameApi(coinFullName || '')"
        );
    }

    @Get('/coinmarketcap/trending')
    findTrendingCoins() {
        return 'findTrendingCoins';
    }
}
