import { Btc2YearMovingAverageResponse, LookIntoBitcoinApi } from './look-into-bitcoin.api';
import { PuppeteerRestClient } from '../puppeteer.rest.client';

export class LookIntoBitcoinRestClient extends PuppeteerRestClient implements LookIntoBitcoinApi {
    constructor() {
        super({
            url: 'https://www.lookintobitcoin.com/charts/bitcoin-investor-tool/',
            screenshotPath: __dirname + '/btc2YearMovingAverageGraph.png',
            clip: {
                x: 20,
                y: 130,
                width: 950,
                height: 820,
            },
        });
    }

    async findBtc2YearMovingAverageGraph(): Promise<Btc2YearMovingAverageResponse> {
        return await this.retrieveScreenshot();
    }
}
