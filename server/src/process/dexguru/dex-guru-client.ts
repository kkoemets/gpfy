import { getLogger } from '../../util/get-logger';
import fetch from 'node-fetch';
import { DEX_GURU_HOST } from '../../server-config';
import { DexContractSummary } from './dex-contract-summary';

const log = getLogger();

export const findContractSummary = async ({
  contract,
}: {
  contract: string;
}): Promise<DexContractSummary> => {
  const url = `${DEX_GURU_HOST}/v1/tokens/search/${contract}`;
  log.info(`Requesting ${url}`);
  const { data } = await getJson(url);
  return (
    data.find(({ AMM }: { AMM: string }) => AMM === 'pancakeswap') || data[0]
  );
};

async function getJson(url: string) {
  const response = await fetch(url, {
    method: 'GET',
  });

  return await response.json();
}
