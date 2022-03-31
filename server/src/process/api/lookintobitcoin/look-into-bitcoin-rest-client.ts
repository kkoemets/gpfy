import { RestClient } from '../rest-client';
import {
  Btc2YearMovingAverageResponse,
  LookIntoBitcoinApi,
} from './look-into-bitcoin-api';
import * as fs from 'fs';
import * as puppeteer from 'puppeteer';
import { getLogger } from '../../../util/get-logger';
import { Viewport } from 'puppeteer';

const logger = getLogger();

const graphScreenshotPath = __dirname + '/btc2YearMovingAverageGraph.png';
const lookIntoBitcoinUrl =
  'https://www.lookintobitcoin.com/charts/bitcoin-investor-tool/';

export class LookIntoBitcoinRestClient
  extends RestClient
  implements LookIntoBitcoinApi {
  async findBtc2YearMovingAverageGraph(): Promise<Btc2YearMovingAverageResponse> {
    await retrieveScreenshot();

    return {
      base64Img: await fs.promises.readFile(graphScreenshotPath, 'base64'),
      originUrl: lookIntoBitcoinUrl,
    };
  }
}

const retrieveScreenshot: () => Promise<void> = async () => {
  const doesScreenshotExistAlready = fs.existsSync(graphScreenshotPath);

  if (doesScreenshotExistAlready) {
    if (
      isFileFromTheSameDay(
        (await fs.promises.stat(graphScreenshotPath)).birthtime,
      )
    ) {
      logger.info('Not updating screenshot');
      return;
    }

    logger.info('Deleting existing screenshot');
    await fs.promises.unlink(graphScreenshotPath);
  }

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const viewport: Viewport = {
    width: 1000,
    height: 1200,
  };
  await page.setViewport(viewport);

  await page.goto(lookIntoBitcoinUrl);
  await page.waitForTimeout(3000);

  logger.info('Creating new screenshot');
  await page.screenshot({
    path: graphScreenshotPath,
    clip: {
      x: 80,
      y: 205,
      width: viewport.width - 90,
      height: viewport.height - 430,
    },
  });
  await browser.close();

  return;
};

const isFileFromTheSameDay = (date: Date) => {
  return date.getUTCDate() === new Date().getUTCDate();
};
