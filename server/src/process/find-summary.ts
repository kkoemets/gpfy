import { getLogger } from '../util/get-logger';
import { findContractSummary } from './dexguru/dex-guru-client';
import { ContractSummary } from './contract-summary';
import { DexContractSummary } from './dexguru/dex-contract-summary';
import { findHolders } from './bscscan/bscscan-client';

const log = getLogger();
export const findSummary = async (
  contract: string,
): Promise<ContractSummary> => {
  log.info(`Finding summary for contract ${contract}`);
  const dexContractSummary: DexContractSummary = await findContractSummary({
    contract,
  });

  const { holdersAmount } =
    dexContractSummary.network === 'bsc'
      ? await findHolders({ bscContract: contract })
      : { holdersAmount: null };

  return {
    dexContractSummary,
    holdersAmount,
  };
};
