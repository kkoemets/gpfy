import {
  Btc2YearMovingAverageResponse,
  LookIntoBitcoinApi,
} from './look-into-bitcoin-api';
import { PuppeteerRestClient } from '../puppeteer-rest-client';

export class LookIntoBitcoinRestClient
  extends PuppeteerRestClient
  implements LookIntoBitcoinApi
{
  constructor() {
    super({
      url: 'https://www.lookintobitcoin.com/charts/bitcoin-investor-tool/',
      screenshotPath: __dirname + '/btc2YearMovingAverageGraph.png',
      clip: {
        x: 80,
        y: 130,
        width: 910,
        height: 720,
      },
    });
  }

  async findBtc2YearMovingAverageGraph(): Promise<Btc2YearMovingAverageResponse> {
    return await this.retrieveScreenshot();
  }
}
