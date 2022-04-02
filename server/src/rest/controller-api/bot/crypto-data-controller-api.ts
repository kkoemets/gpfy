import {
  ContractSummary,
  findSummary,
  findSummaryByName,
} from '../../../process/crypto-data';
import { CoinmarketcapApi } from '../../../process/api/coinmarketcap/coinmarketcap-api';
import { InversifyContainer } from '../../../injection/inversify-container';
import { INVERSIFY_TYPES } from '../../../injection/inversify-types';
import { COULD_NOT_FIND_CONTRACT } from '../api-errors';
import {
  createSummaryTemplate,
  createSummaryTemplateFromCmcSummary,
} from './contract/contract-summary';
import { getLogger } from '../../../util/get-logger';

const log = getLogger();

export const findContractSummaryApi = async (
  contract: string,
): Promise<string> => {
  return createSummaryTemplate(await findSummary(contract));
};

export const findContractSummaryByNameApi = async (
  coinOfficialNameInput: string,
): Promise<string> => {
  log.info(`Finding summary for-${coinOfficialNameInput}`);
  const coinmarketcapApi: CoinmarketcapApi =
    InversifyContainer.get<CoinmarketcapApi>(INVERSIFY_TYPES.CoinmarketcapApi);

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
