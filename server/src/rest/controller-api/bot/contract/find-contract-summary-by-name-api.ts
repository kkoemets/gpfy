import {
  createSummaryTemplate,
  createSummaryTemplateFromCmcSummary,
} from './create-summary-template';
import { getLogger } from '../../../../util/get-logger';
import { COULD_NOT_FIND_CONTRACT } from '../../api-errors';
import { CoinmarketcapApi } from '../../../../process/api/coinmarketcap/coinmarketcap-api';
import { INVERSIFY_TYPES } from '../../../../injection/inversify-types';
import { InversifyContainer } from '../../../../injection/inversify-container';
import {
  ContractSummary,
  findSummaryByName,
} from '../../../../process/crypto-data';

const log = getLogger();

const coinmarketcapApi: CoinmarketcapApi =
  InversifyContainer.get<CoinmarketcapApi>(INVERSIFY_TYPES.CoinmarketcapApi);

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
      await coinmarketcapApi.findCoinSummaryFromCmc({ coinOfficialName }),
    );
  }

  log.info(contractSummary);

  return createSummaryTemplate(contractSummary);
};
