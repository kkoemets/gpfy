import { getLogger } from '../util/get-logger';
import { ContractSummary } from './contract-summary';
import { DexContractSummary } from './api/dexguru/dex-contract-summary';
import { InversifyContainer } from '../injection/inversify-container';
import { BscscanApi } from './api/bscscan/bscscan-api';
import { INVERSIFY_TYPES } from '../injection/inversify-types';
import { DexGuruApi } from './api/dexguru/dex-guru-api';

const log = getLogger();
export const findSummary = async (
  contract: string,
): Promise<ContractSummary> => {
  log.info(`Finding summary for contract ${contract}`);
  const dexContractSummary: DexContractSummary = await InversifyContainer.get<DexGuruApi>(
    INVERSIFY_TYPES.DexGuruApi,
  ).findContractSummary({
    contract,
  });

  const { holdersAmount } =
    dexContractSummary.network === 'bsc'
      ? await InversifyContainer.get<BscscanApi>(
          INVERSIFY_TYPES.BscscanApi,
        ).findHolders({ bscContract: contract })
      : {
          holdersAmount: null,
        };
  return {
    dexContractSummary,
    holdersAmount,
  };
};
