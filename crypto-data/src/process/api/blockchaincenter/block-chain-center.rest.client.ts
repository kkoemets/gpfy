import { BlockChainCenterApi, RainbowGraphResponse } from './block-chain-center.api';
import { PuppeteerRestClient } from '../puppeteer.rest.client';

export class BlockChainCenterRestClient extends PuppeteerRestClient implements BlockChainCenterApi {
    constructor() {
        super({
            url: 'https://www.blockchaincenter.net/static/rainbow-chart.html',
            screenshotPath: __dirname + '/bitcoinRainbowChart.png',
            clip: {
                x: 0,
                y: 0,
                width: 1250,
                height: 720,
            },
        });
    }

    async findRainbowGraph(): Promise<RainbowGraphResponse> {
        return await this.retrieveScreenshot();
    }
}
