import { getLogger } from '../../../util/get-logger';
import {
  findBtc2YearMovingAverage,
  findRainbowChart,
} from '../../../process/crypto-images';

const logger = getLogger();

export const findBtc2YearMovingAverageApi: () => Promise<{
  originUrl: string;
  base64Img: string;
}> = async () => {
  logger.info('Finding 2 year btc avg');
  const { base64Img, originUrl } = await findBtc2YearMovingAverage();
  return { base64Img, originUrl };
};

export const findRainbowChartApi: () => Promise<{
  originUrl: string;
  base64Img: string;
}> = async () => {
  logger.info('Finding rainbow chart');
  const { base64Img, originUrl } = await findRainbowChart();
  return { base64Img, originUrl };
};
