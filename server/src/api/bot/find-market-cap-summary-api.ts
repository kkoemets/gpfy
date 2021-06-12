import { findMarketCapSummary } from '../../process/coinmarketcap/coinmarketcap-client';
import { COULD_NOT_FIND_MARKETCAP } from '../api-errors';
import { getLogger } from '../../util/get-logger';

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
  } = await findMarketCapSummary();
  if (!mcap) {
    return COULD_NOT_FIND_MARKETCAP;
  }

  return {
    cmcSummary: createMarketCapSummaryTemplate({
      mcap,
      volume24H,
      btcDominance,
      ethDominance,
    }),
  };
};

const createMarketCapSummaryTemplate = ({
  mcap,
  volume24H,
  btcDominance,
  ethDominance,
}: {
  mcap: string;
  volume24H: string;
  btcDominance: string;
  ethDominance: string;
}): string => {
  return `💰Market Cap: ${mcap}
💱Volume 24h: ${volume24H}
💲BTC dominance: ${btcDominance}
🦄ETH dominance: ${ethDominance}`;
};
