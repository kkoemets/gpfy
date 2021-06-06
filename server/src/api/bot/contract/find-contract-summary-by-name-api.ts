import { createSummaryTemplate } from './create-summary-template';
import { getLogger } from '../../../util/get-logger';
import { findSummaryByName } from '../../../process/find-summary-by-name';
import { ContractSummary } from '../../../process/contract-summary';

const log = getLogger();

export const findContractSummaryByNameApi = async (
  coinOfficialNameInput: string,
): Promise<string> => {
  log.info(`Finding summary for-${coinOfficialNameInput}`);

  const coinOfficialName = coinOfficialNameInput?.trim()?.toLowerCase();
  if (!coinOfficialName) {
    return Promise.reject(Error('Could not find contract'));
  }

  const contractSummary: ContractSummary = await findSummaryByName(
    coinOfficialName,
  ).catch((error) => error);

  if (contractSummary instanceof Error) {
    return Promise.reject(contractSummary);
  }

  log.info(contractSummary);

  return createSummaryTemplate(contractSummary);
};
