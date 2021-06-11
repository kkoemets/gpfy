import { findMarketCapSummary } from '../../process/coinmarketcap/coinmarketcap-client';
import { COULD_NOT_FIND_MARKETCAP } from '../api-errors';
import { getLogger } from '../../util/get-logger';

const log = getLogger();

export const findMarketCapSummaryApi = async (): Promise<{
  cmcSummary: string;
}> => {
  log.info('Finding coinmarketcap summary');
  const { mcap } = await findMarketCapSummary();
  if (!mcap) {
    return COULD_NOT_FIND_MARKETCAP;
  }

  const createMarketCapSummaryTemplate = ({
    mcap: marketcap,
  }: {
    mcap: string;
  }) => {
    return 'Market Cap: ' + marketcap;
  };

  return { cmcSummary: createMarketCapSummaryTemplate({ mcap: mcap }) };
};
