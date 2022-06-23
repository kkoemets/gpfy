import {
  BlockChainCenterApi,
  RainbowGraphResponse,
} from './block-chain-center.api';
import { PuppeteerRestClient } from '../puppeteer.rest.client';

export class BlockChainCenterRestClient
  extends PuppeteerRestClient
  implements BlockChainCenterApi
{
  constructor() {
    super({
      url: 'https://www.blockchaincenter.net/en/bitcoin-rainbow-chart/',
      screenshotPath: __dirname + '/bitcoinRainbowChart.png',
      clip: {
        x: 80,
        y: 255,
        width: 910,
        height: 720,
      },
    });
  }

  async findRainbowGraph(): Promise<RainbowGraphResponse> {
    return await this.retrieveScreenshot();
  }
}
