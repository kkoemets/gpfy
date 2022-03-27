import {
  createSummaryTemplate,
  createSummaryTemplateFromCmcSummary,
} from './create-summary-template';
import { getLogger } from '../../../util/get-logger';
import { findSummaryByName } from '../../../process/find-summary-by-name';
import { ContractSummary } from '../../../process/contract-summary';
import { COULD_NOT_FIND_CONTRACT } from '../../api-errors';
import { CoinmarketcapApi } from '../../../process/api/coinmarketcap/coinmarketcap-api';
import { INVERSIFY_TYPES } from '../../../injection/inversify-types';
import { InversifyContainer } from '../../../injection/inversify-container';

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
    const coinmarketcapApi: CoinmarketcapApi = InversifyContainer.get<CoinmarketcapApi>(
      INVERSIFY_TYPES.CoinmarketcapApi,
    );

    return createSummaryTemplateFromCmcSummary(
      await coinmarketcapApi.findCoinSummaryFromCmc({ coinOfficialName }),
    );
  }

  log.info(contractSummary);

  return createSummaryTemplate(contractSummary);
};
