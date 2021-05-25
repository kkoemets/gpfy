import { getLogger } from '../../util/get-logger';

const log = getLogger();
export const fetchCoinsSummary = ({ coinName }: { coinName: string }) => {
  log.info(coinName);
};
