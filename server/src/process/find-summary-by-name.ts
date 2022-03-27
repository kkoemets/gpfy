import { ContractSummary } from './contract-summary';

import { getLogger } from '../util/get-logger';
import { findSummary } from './find-summary';
import {
  getCachedContractByName,
  setCachedContractByName,
} from './cache/token-cache-manager';
import { COULD_NOT_FIND_CONTRACT } from '../api/api-errors';
import { CoinmarketcapApi } from './api/coinmarketcap/coinmarketcap-api';
import { INVERSIFY_TYPES } from '../injection/inversify-types';
import { InversifyContainer } from '../injection/inversify-container';
import { CoingeckoApi } from './api/coingecko/coingecko-api';

const log = getLogger();

export const findSummaryByName = async (
  coinOfficialName: string,
): Promise<ContractSummary> => {
  log.info(`Finding for-${coinOfficialName}`);

  const contract =
    (await getCachedContractByName({ coinOfficialName })) ||
    (await InversifyContainer.get<CoingeckoApi>(
      INVERSIFY_TYPES.CoingeckoApi,
    ).findContract({ coinOfficialName })) ||
    (await InversifyContainer.get<CoinmarketcapApi>(
      INVERSIFY_TYPES.CoinmarketcapApi,
    ).findContract({ coinOfficialName }));
  if (!contract) {
    return COULD_NOT_FIND_CONTRACT();
  }

  await setCachedContractByName({ coinOfficialName, contract });

  return await findSummary(contract);
};
