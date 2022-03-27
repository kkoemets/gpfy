import { COULD_NOT_FIND_MARKETCAP } from '../api-errors';
import { getLogger } from '../../util/get-logger';
import { findGreedIndex } from '../../process/find-greed-index';
import { INVERSIFY_TYPES } from '../../injection/inversify-types';
import { CoinmarketcapApi } from '../../process/api/coinmarketcap/coinmarketcap-api';
import { InversifyContainer } from '../../injection/inversify-container';

const log = getLogger();

export const findMarketCapSummaryApi = async (): Promise<{
  cmcSummary: string;
}> => {
  log.info('Finding coinmarketcap summary');

  const {
    mcap,
    volume24H,
    btcDominance,
    ethDominance,
  } = await InversifyContainer.get<CoinmarketcapApi>(
    INVERSIFY_TYPES.CoinmarketcapApi,
  ).findMarketCapSummary();
  if (!mcap) {
    return COULD_NOT_FIND_MARKETCAP();
  }

  const {
    value: fearIndex,
    value_classification: fearClass,
  } = await findGreedIndex();

  return {
    cmcSummary: createMarketCapSummaryTemplate({
      mcap,
      volume24H,
      btcDominance,
      ethDominance,
      fearIndex,
      fearClass,
    }),
  };
};

const createMarketCapSummaryTemplate = ({
  mcap,
  volume24H,
  btcDominance,
  ethDominance,
  fearIndex,
  fearClass,
}: {
  mcap: string;
  volume24H: string;
  btcDominance: string;
  ethDominance: string;
  fearIndex: string;
  fearClass: string;
}): string => {
  return `💰Market Cap: 
        ${mcap}
💱Volume 24h: 
        ${volume24H}
💲BTC dominance:
        ${btcDominance}
🦄ETH dominance: 
        ${ethDominance}
${Number(fearIndex) > 50 ? '🐂' : '🐻'}Fear/Greed index: 
        ${fearIndex}
🦈Fear classification: 
        ${fearClass}`;
};
