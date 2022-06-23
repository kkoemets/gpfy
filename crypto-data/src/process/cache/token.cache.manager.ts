import { CacheContainer } from 'node-ts-cache';
import { MemoryStorage } from 'node-ts-cache-storage-memory';
import { createLogger } from '../../util/log';

const myCache = new CacheContainer(new MemoryStorage());

const log = createLogger();

export const getCachedContractByName = async ({
  coinOfficialName,
}: {
  coinOfficialName: string;
}): Promise<string | null> => {
  log.info('Trying to find cached contract for-' + coinOfficialName);
  const contract = await myCache.getItem<string>(coinOfficialName);
  if (!contract) {
    log.info('Did not find');
    return null;
  }
  log.info(`Found cached contract-${contract}`);
  return contract;
};

export const setCachedContractByName = async ({
  coinOfficialName,
  contract,
}: {
  coinOfficialName: string;
  contract: string;
}): Promise<void> => {
  await myCache.setItem(coinOfficialName, contract, { ttl: 86400000 });
};
