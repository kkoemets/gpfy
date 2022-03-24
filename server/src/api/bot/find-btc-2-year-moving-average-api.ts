import { findBtc2YearMovingAverage } from '../../process/find-btc-2-year-moving-average';
import { getLogger } from '../../util/get-logger';

const logger = getLogger();

export const findBtc2YearMovingAverageApi: () => Promise<{
  originUrl: string;
  base64Img: string;
}> = async () => {
  logger.info('Finding 2 year btc avg');
  const { base64Img, originUrl } = await findBtc2YearMovingAverage();
  return { base64Img, originUrl };
};
