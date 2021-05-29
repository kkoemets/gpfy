import { createSummaryTemplate } from './create-summary-template';
import { findSummary } from '../../../process/dexguru/find-summary';

export const findContractSummaryApi = async (
  contract: string,
): Promise<string> => {
  return createSummaryTemplate(await findSummary(contract));
};