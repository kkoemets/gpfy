import { GreedIndex } from './greed-index';
import fetch from 'node-fetch';
import { getLogger } from '../util/get-logger';

const log = getLogger();

export const findGreedIndex = async (): Promise<GreedIndex> => {
  log.info('Finding greed index');
  const data = (await (
    await fetch(`https://api.alternative.me/fng`, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    })
  ).json()) as { data: object[] };

  log.info(data);

  return { ...(data.data[0] as GreedIndex) };
};
