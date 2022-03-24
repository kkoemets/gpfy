import {
  createSummaryTemplate,
  createSummaryTemplateFromCmcSummary,
} from './create-summary-template';
import { getLogger } from '../../../util/get-logger';
import { findSummaryByName } from '../../../process/find-summary-by-name';
import { ContractSummary } from '../../../process/contract-summary';
import { COULD_NOT_FIND_CONTRACT } from '../../api-errors';
import { findCoinSummaryFromCmc } from '../../../process/coinmarketcap/coinmarketcap-client';

const log = getLogger();

export const findContractSummaryByNameApi = async (
  coinOfficialNameInput: string,
): Promise<string> => {
  log.info(`Finding summary for-${coinOfficialNameInput}`);

  const coinOfficialName = coinOfficialNameInput?.trim()?.toLowerCase();
  if (!coinOfficialName) {
    return COULD_NOT_FIND_CONTRACT();
  }

  const contractSummary: ContractSummary = await findSummaryByName(
    coinOfficialName,
  ).catch((error) => error);

  if (contractSummary instanceof Error) {
    return createSummaryTemplateFromCmcSummary(
      await findCoinSummaryFromCmc({ coinOfficialName }),
    );
  }

  log.info(contractSummary);

  return createSummaryTemplate(contractSummary);
};
