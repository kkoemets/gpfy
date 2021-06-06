import { ContractSummary } from './contract-summary';

import { getLogger } from '../util/get-logger';
import { findContract } from './coingecko/coingecko-client';
import { findSummary } from './find-summary';

const log = getLogger();

export const findSummaryByName = async (
  coinOfficialName: string,
): Promise<ContractSummary> => {
  log.info(`Finding for-${coinOfficialName}`);

  const contract = await findContract({ coinOfficialName });
  if (!contract) {
    return Promise.reject(Error('Could not find contract'));
  }

  return await findSummary(contract);
};
