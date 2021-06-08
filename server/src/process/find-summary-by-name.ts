import { ContractSummary } from './contract-summary';

import { getLogger } from '../util/get-logger';
import { findContract as findContractFromCoingecko } from './coingecko/coingecko-client';
import { findSummary } from './find-summary';
import { findContract as findContractFromCmc } from './coinmarketcap/coinmarketcap-client';

const log = getLogger();

export const findSummaryByName = async (
  coinOfficialName: string,
): Promise<ContractSummary> => {
  log.info(`Finding for-${coinOfficialName}`);

  const contract =
    (await findContractFromCoingecko({ coinOfficialName })) ||
    (await findContractFromCmc({ coinOfficialName }));
  if (!contract) {
    return Promise.reject(Error('Could not find contract'));
  }

  return await findSummary(contract);
};
