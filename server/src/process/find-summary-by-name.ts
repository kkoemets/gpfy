import { ContractSummary } from './contract-summary';

import { getLogger } from '../util/get-logger';
import { findContract as findContractFromCoingecko } from './coingecko/coingecko-client';
import { findSummary } from './find-summary';
import { findContract as findContractFromCmc } from './coinmarketcap/coinmarketcap-client';
import {
  getCachedContractByName,
  setCachedContractByName,
} from './cache/token-cache-manager';

const log = getLogger();

export const findSummaryByName = async (
  coinOfficialName: string,
): Promise<ContractSummary> => {
  log.info(`Finding for-${coinOfficialName}`);

  const contract =
    (await getCachedContractByName({ coinOfficialName })) ||
    (await findContractFromCoingecko({ coinOfficialName })) ||
    (await findContractFromCmc({ coinOfficialName }));
  if (!contract) {
    return Promise.reject(Error('Could not find contract'));
  }

  await setCachedContractByName({ coinOfficialName, contract });

  return await findSummary(contract);
};
