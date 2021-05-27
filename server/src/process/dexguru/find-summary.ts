import { getLogger } from '../../util/get-logger';
import { findContractSummary } from './dex-guru-client';
import { ContractSummary } from './contract-summary';

const log = getLogger();
export const findSummary = async (
  contract: string,
): Promise<ContractSummary> => {
  log.info(`Finding summary for contract ${contract}`);
  return await findContractSummary({ contract });
};
