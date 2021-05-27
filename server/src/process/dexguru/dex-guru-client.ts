import { getLogger } from '../../util/get-logger';
import * as fetch from 'node-fetch';
import { DEX_GURU_HOST } from '../../internal-config';
import { ContractSummary } from './contract-summary';

const log = getLogger();

export const findContractSummary = async ({
  contract,
}: {
  contract: string;
}): Promise<ContractSummary> => {
  const url = `${DEX_GURU_HOST}/v1/tokens/${contract}`;
  log.info(`Requesting ${url}`);
  const contactSummary = await getJson(url);
  return { ...contactSummary };
};

async function getJson(url: string) {
  const response = await fetch(url, {
    method: 'GET',
  });

  return await response.json();
}
