import { ContractSummary } from './contract-summary';

import { getLogger } from '../util/get-logger';
import { findContract as findContractFromCoingecko } from './coingecko/coingecko-client';
import { findSummary } from './find-summary';
import { findContract as findContractFromCmc } from './coinmarketcap/coinmarketcap-client';
import {
  getCachedContractByName,
  setCachedContractByName,
} from './cache/token-cache-manager';
import { COULD_NOT_FIND_CONTRACT } from '../api/api-errors';

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
    return COULD_NOT_FIND_CONTRACT;
  }

  await setCachedContractByName({ coinOfficialName, contract });

  return await findSummary(contract);
};
